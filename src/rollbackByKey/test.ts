import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import UnprocessedMigrationError from '../utils/errors/UnprocessedMigrationError';
import assertLocked from '../utils/tests/assertLocked';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestDownMigration from '../utils/tests/createTestDownMigration';
import { testMigrationKey } from '../utils/tests/createTestUpMigration';
import TestFactory from '../utils/tests/TestFactory';

const testRollbackByKey: TestFactory = (createService) => {
  const successfulMigration = createTestDownMigration();
  const failingMigration = createTestDownMigration(() => { throw new Error(); });

  describe('rollbackByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService([]);
      const promise = service.rollbackByKey({ key: 'missingKey' });
      await assertRejects(promise, UnprocessedMigrationError);
    });

    it('should error when there are duplicate keys', async () => {
      await createService([createTestDownMigration()]).migrate();
      const service = createService([createTestDownMigration(), createTestDownMigration()]);
      const promise = service.rollbackByKey({ key: testMigrationKey });
      await assertRejects(promise, DuplicateKeyError);
    });

    it('should not error when the migration fails during a dry run', async () => {
      const service = createService([failingMigration]);
      await service.migrate();
      await service.rollbackByKey({ key: testMigrationKey, dryRun: true });
    });

    it('should error when the migration errors', async () => {
      const service = createService([failingMigration]);
      await service.migrate();
      const promise = service.rollbackByKey({ key: testMigrationKey });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should rollback processed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      await service.migrate();
      await service.rollbackByKey({ key: testMigrationKey });
      assert.notEqual(getProcessed(), undefined);
    });

    it('should error when rolling back unprocessed migrations without force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      const promise = service.rollbackByKey({ key: testMigrationKey });
      await assertRejects(promise, UnprocessedMigrationError);
      assert.equal(getProcessed(), undefined);
    });

    it('should rollback when rolling back a unprocessed migration with force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestDownMigration(process)]);
      await service.rollbackByKey({ key: testMigrationKey, force: true });
      assert.notEqual(getProcessed(), undefined);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([successfulMigration]);
      await service.migrate();
      await assertLocked([
        service.rollbackByKey({ key: testMigrationKey }),
        service.rollbackByKey({ key: testMigrationKey }),
      ]);
    });
  });
};

export default testRollbackByKey;
