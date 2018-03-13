import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import MissingMigrationError from '../utils/errors/MissingMigrationError';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import assertLocked from '../utils/tests/assertLocked';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestUpMigration from '../utils/tests/createTestUpMigration';
import TestFactory from '../utils/tests/TestFactory';
import MigrationDictionary from '../utils/types/MigrationDictionary';

const testMigrateByKey: TestFactory = (repoFactory) => {
  const successfulMigration = createTestUpMigration();
  const failingMigration = createTestUpMigration(() => { throw new Error(); });

  const createService = (migrations: MigrationDictionary) => {
    const log = () => null;
    return factory({ log, repo: repoFactory(migrations) });
  };

  describe('migrateByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService({});
      const promise = service.migrateByKey({ key: 'missingKey' });
      await assertRejects(promise, MissingMigrationError);
    });

    it('should error when the migration errors', async () => {
      const service = createService({ failingMigration });
      const promise = service.migrateByKey({ key: 'failingMigration' });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestUpMigration(process) });
      await service.migrateByKey({ key: 'testMigration' });
      assert.equal(getProcessed(), true);
    });

    it('should error when reprocessing migrations without force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService({ testMigration: createTestUpMigration() }).migrate();
      const service = createService({ testMigration: createTestUpMigration(process) });
      const promise = service.migrateByKey({ key: 'testMigration' });
      await assertRejects(promise, ProcessedMigrationError);
      assert.equal(getProcessed(), false);
    });

    it('should reprocess migration when using force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService({ testMigration: createTestUpMigration() }).migrate();
      const service = createService({ testMigration: createTestUpMigration(process) });
      await service.migrateByKey({ key: 'testMigration', force: true });
      assert.equal(getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService({ successfulMigration });
      await assertLocked([
        service.migrateByKey({ key: 'successfulMigration' }),
        service.migrateByKey({ key: 'successfulMigration' }),
      ]);
    });
  });
};

export default testMigrateByKey;
