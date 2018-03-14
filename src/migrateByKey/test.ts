import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import DuplicateKeyError from '../utils/errors/DuplicateKeyError';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import MissingMigrationError from '../utils/errors/MissingMigrationError';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import assertLocked from '../utils/tests/assertLocked';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestUpMigration, { testMigrationKey } from '../utils/tests/createTestUpMigration';
import TestFactory from '../utils/tests/TestFactory';

const testMigrateByKey: TestFactory = (createService) => {
  const successfulMigration = createTestUpMigration();
  const failingMigration = createTestUpMigration(() => { throw new Error(); });

  describe('migrateByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService([]);
      const promise = service.migrateByKey({ key: 'missingKey' });
      await assertRejects(promise, MissingMigrationError);
    });

    it('should error when there are duplicate keys', async () => {
      const service = createService([createTestUpMigration(), createTestUpMigration()]);
      const promise = service.migrateByKey({ key: testMigrationKey });
      await assertRejects(promise, DuplicateKeyError);
    });

    it('should error when the migration errors', async () => {
      const service = createService([failingMigration]);
      const promise = service.migrateByKey({ key: testMigrationKey });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService([createTestUpMigration(process)]);
      await service.migrateByKey({ key: testMigrationKey });
      assert.equal(getProcessed(), true);
    });

    it('should error when reprocessing migrations without force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService([createTestUpMigration()]).migrate();
      const service = createService([createTestUpMigration(process)]);
      const promise = service.migrateByKey({ key: testMigrationKey });
      await assertRejects(promise, ProcessedMigrationError);
      assert.equal(getProcessed(), false);
    });

    it('should reprocess migration when using force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService([createTestUpMigration()]).migrate();
      const service = createService([createTestUpMigration(process)]);
      await service.migrateByKey({ key: testMigrationKey, force: true });
      assert.equal(getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService([successfulMigration]);
      await assertLocked([
        service.migrateByKey({ key: testMigrationKey }),
        service.migrateByKey({ key: testMigrationKey }),
      ]);
    });
  });
};

export default testMigrateByKey;
