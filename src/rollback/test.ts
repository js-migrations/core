// tslint:disable:max-file-line-count
import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import MissingMigrationError from '../utils/errors/MissingMigrationError';
import assertLocked from '../utils/tests/assertLocked';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestDownMigration from '../utils/tests/createTestDownMigration';
import TestFactory from '../utils/tests/TestFactory';

const testRollback: TestFactory = (createService) => {
  const successfulMigration = createTestDownMigration(undefined, 'successfulMigration');
  const failingMigration = createTestDownMigration(() => {
    throw new Error();
  }, 'failingMigration');
  const unskippableKey = 'unskippableMigration';
  const unskippableMigration = createTestDownMigration(undefined, unskippableKey);

  describe('rollback', () => {
    it('should not error when there are no migrations', async () => {
      const service = createService([]);
      await service.rollback();
    });

    it('should error when there are duplicate keys', async () => {
      await createService([createTestDownMigration()]).migrate();
      const service = createService([createTestDownMigration(), createTestDownMigration()]);
      const promise = service.rollback();
      await assertRejects(promise, DuplicateKeyError);
    });

    it('should error when a processed migration is missing', async () => {
      await createService([successfulMigration]).migrate();
      const promise = createService([]).rollback();
      await assertRejects(promise, MissingMigrationError);
    });

    it('should not error when the migration fails during a dry run', async () => {
      const service = createService([failingMigration]);
      await service.migrate();
      await service.rollback({ dryRun: true });
    });

    it('should error when the first migration errors', async () => {
      const service = createService([failingMigration, successfulMigration]);
      await service.migrate();
      const promise = service.rollback();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should error when the second migration errors', async () => {
      const service = createService([successfulMigration, failingMigration]);
      await service.migrate();
      const promise = service.rollback();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process rollback for a processed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      await service.migrate();
      await service.rollback();
      assert.equal(getProcessed(), true);
    });

    it('should not process rollback for a unprocessed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      await service.rollback();
      assert.equal(getProcessed(), false);
    });

    it('should skip unprocessed migrations after processed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([unskippableMigration]).migrate();
      await createService([
        createTestDownMigration(unskippedProcess.process, unskippableKey),
        createTestDownMigration(skippedProcess.process),
      ]).rollback();
      assert.equal(skippedProcess.getProcessed(), false);
      assert.equal(unskippedProcess.getProcessed(), true);
    });

    it('should skip unprocessed migrations before processed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([unskippableMigration]).migrate();
      await createService([
        createTestDownMigration(skippedProcess.process),
        createTestDownMigration(unskippedProcess.process, unskippableKey),
      ]).rollback();
      assert.equal(skippedProcess.getProcessed(), false);
      assert.equal(unskippedProcess.getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([]);
      await assertLocked([service.rollback(), service.rollback()]);
    });
  });
};

export default testRollback;
