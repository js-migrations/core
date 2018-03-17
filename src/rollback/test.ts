// tslint:disable:max-file-line-count
import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import MissingMigrationError from '../utils/errors/MissingMigrationError';
import assertDateOrder from '../utils/tests/assertDateOrder';
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

    it('should process rollbacks for processed migrations in reverse order', async () => {
      const firstProcess = createMigrationProcess();
      const secondProcess = createMigrationProcess();
      const service = createService([
        createTestDownMigration(firstProcess.process, 'firstMigration'),
        createTestDownMigration(secondProcess.process, 'secondMigration'),
      ]);
      await service.migrate();
      await service.rollback();
      assert.notEqual(firstProcess.getProcessed(), undefined);
      assert.notEqual(secondProcess.getProcessed(), undefined);
      const processes = [secondProcess.getProcessed(), firstProcess.getProcessed()];
      assertDateOrder(processes as Date[]);
    });

    it('should not process rollback for a unprocessed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      await service.rollback();
      assert.equal(getProcessed(), undefined);
    });

    it('should skip unprocessed migrations after processed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([unskippableMigration]).migrate();
      await createService([
        createTestDownMigration(unskippedProcess.process, unskippableKey),
        createTestDownMigration(skippedProcess.process),
      ]).rollback();
      assert.equal(skippedProcess.getProcessed(), undefined);
      assert.notEqual(unskippedProcess.getProcessed(), undefined);
    });

    it('should skip unprocessed migrations before processed migrations', async () => {
      const skippedProcess = createMigrationProcess();
      const unskippedProcess = createMigrationProcess();
      await createService([unskippableMigration]).migrate();
      await createService([
        createTestDownMigration(skippedProcess.process),
        createTestDownMigration(unskippedProcess.process, unskippableKey),
      ]).rollback();
      assert.equal(skippedProcess.getProcessed(), undefined);
      assert.notEqual(unskippedProcess.getProcessed(), undefined);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([]);
      await assertLocked([service.rollback(), service.rollback()]);
    });
  });
};

export default testRollback;
