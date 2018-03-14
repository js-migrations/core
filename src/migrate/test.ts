import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import assertLocked from '../utils/tests/assertLocked';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestUpMigration from '../utils/tests/createTestUpMigration';
import TestFactory from '../utils/tests/TestFactory';

const testMigrate: TestFactory = (createService) => {
  const successfulMigration = createTestUpMigration(undefined, 'successfulMigration');
  const failingMigration = createTestUpMigration(() => { throw new Error(); }, 'failingMigration');
  const skippableKey = 'skippableMigration';
  const skippableMigration = createTestUpMigration(undefined, skippableKey);

  describe('migrate', () => {
    it('should not error when there are no migrations', async () => {
      const service = createService([]);
      await service.migrate();
    });

    it('should error when there are duplicate keys', async () => {
      const service = createService([createTestUpMigration(), createTestUpMigration()]);
      const promise = service.migrate();
      await assertRejects(promise, DuplicateKeyError);
    });

    it('should error when the first migration errors', async () => {
      const promise = createService([failingMigration, successfulMigration]).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should error when the second migration errors', async () => {
      const promise = createService([successfulMigration, failingMigration]).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migrations', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestUpMigration(process)]);
      await service.migrate();
      assert.equal(getProcessed(), true);
    });

    it('should not reprocess migrations', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService([createTestUpMigration()]).migrate();
      await createService([createTestUpMigration(process)]).migrate();
      assert.equal(getProcessed(), false);
    });

    it('should skip processed migrations after unprocessed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([skippableMigration]).migrate();
      await createService([
        createTestUpMigration(unskippedProcess.process),
        createTestUpMigration(skippedProcess.process, skippableKey),
      ]).migrate();
      assert.equal(skippedProcess.getProcessed(), false);
      assert.equal(unskippedProcess.getProcessed(), true);
    });

    it('should skip processed migrations before unprocessed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([skippableMigration]).migrate();
      await createService([
        createTestUpMigration(skippedProcess.process, skippableKey),
        createTestUpMigration(unskippedProcess.process),
      ]).migrate();
      assert.equal(skippedProcess.getProcessed(), false);
      assert.equal(unskippedProcess.getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([]);
      await assertLocked([service.migrate(), service.migrate()]);
    });
  });
};

export default testMigrate;
