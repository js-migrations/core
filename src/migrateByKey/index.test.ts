import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import RepoFacade from '../RepoFacade';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestUpMigration from '../utils/tests/createTestUpMigration';
import MigrationDictionary from '../utils/types/MigrationDictionary';

export default (repo: RepoFacade) => {
  const failingMigration = createTestUpMigration(() => { throw new Error(); });

  const createService = (migrations: MigrationDictionary) => {
    const log = () => null;
    return factory({ log, migrations, repo });
  };

  describe('migrateByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService({});
      await service.migrateByKey({ key: 'missingKey' });
    });

    it('should error when the migration errors', async () => {
      const service = createService({ failingMigration });
      const promise = service.migrateByKey({ key: 'failingMigration' });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migration', async () => {
      const { process, processed } = createMigrationProcess();
      const service = createService({ testMigration: createTestUpMigration(process) });
      await service.migrateByKey({ key: 'testMigration' });
      assert.equal(processed, true);
    });

    it('should error when reprocessing migrations without force', async () => {
      const { process, processed } = createMigrationProcess();
      await createService({ testMigration: createTestUpMigration() }).migrate();
      const service = createService({ testMigration: createTestUpMigration(process) });
      const promise = service.migrateByKey({ key: 'testMigration' });
      await assertRejects(promise, ProcessedMigrationError);
      assert.equal(processed, false);
    });

    it('should reprocess migration when using force', async () => {
      const { process, processed } = createMigrationProcess();
      await createService({ testMigration: createTestUpMigration() }).migrate();
      const service = createService({ testMigration: createTestUpMigration(process) });
      await service.migrateByKey({ key: 'testMigration', force: true });
      assert.equal(processed, true);
    });
  });
};
