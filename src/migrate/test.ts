import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import assertDateOrder from '../utils/tests/assertDateOrder';
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
      await createService([]).migrate();
    });

    it('should error when there are duplicate keys', async () => {
      const service = createService([createTestUpMigration(), createTestUpMigration()]);
      const promise = service.migrate();
      await assertRejects(promise, DuplicateKeyError);
    });

    it('should not error when a migration fails during a dry run', async () => {
      await createService([failingMigration]).migrate({ dryRun: true });
    });

    it('should error when the first migration errors', async () => {
      const promise = createService([failingMigration, successfulMigration]).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should error when the second migration errors', async () => {
      const promise = createService([successfulMigration, failingMigration]).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migrations in order', async () => {
      const firstProcess = createMigrationProcess();
      const secondProcess = createMigrationProcess();
      const service = createService([
        createTestUpMigration(firstProcess.process, 'firstMigration'),
        createTestUpMigration(secondProcess.process, 'secondMigration'),
      ]);
      await service.migrate();
      assert.notEqual(firstProcess.getProcessed(), undefined);
      assert.notEqual(secondProcess.getProcessed(), undefined);
      const processes = [firstProcess.getProcessed(), secondProcess.getProcessed()];
      assertDateOrder(processes as Date[]);
    });

    it('should not reprocess migrations', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService([createTestUpMigration()]).migrate();
      await createService([createTestUpMigration(process)]).migrate();
      assert.equal(getProcessed(), undefined);
    });

    it('should skip processed migrations after unprocessed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([skippableMigration]).migrate();
      await createService([
        createTestUpMigration(unskippedProcess.process),
        createTestUpMigration(skippedProcess.process, skippableKey),
      ]).migrate();
      assert.equal(skippedProcess.getProcessed(), undefined);
      assert.notEqual(unskippedProcess.getProcessed(), undefined);
    });

    it('should skip processed migrations before unprocessed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([skippableMigration]).migrate();
      await createService([
        createTestUpMigration(skippedProcess.process, skippableKey),
        createTestUpMigration(unskippedProcess.process),
      ]).migrate();
      assert.equal(skippedProcess.getProcessed(), undefined);
      assert.notEqual(unskippedProcess.getProcessed(), undefined);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([]);
      await assertLocked([service.migrate(), service.migrate()]);
    });
  });
};

export default testMigrate;
