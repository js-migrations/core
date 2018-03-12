/*
Error for missing migration.
Error in migration.
Run processed migration.
Run unprocessed migration with force.
Error unprocessed migration without force.
*/
import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import RepoFacade from '../RepoFacade';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestDownMigration from '../utils/tests/createTestDownMigration';
import MigrationDictionary from '../utils/types/MigrationDictionary';

export default (repo: RepoFacade) => {
  const failingMigration = createTestDownMigration(() => { throw new Error(); });

  const createService = (migrations: MigrationDictionary) => {
    const log = () => null;
    return factory({ log, migrations, repo });
  };

  describe('rollbackByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService({});
      await service.rollbackByKey({ key: 'missingKey' });
    });

    it('should error when the migration errors', async () => {
      const service = createService({ failingMigration });
      await service.migrate();
      const promise = service.rollbackByKey({ key: 'failingMigration' });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should rollback processed migration', async () => {
      const { process, processed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.migrate();
      await service.rollbackByKey({ key: 'testMigration' });
      assert.equal(processed, true);
    });

    it('should error when rolling back unprocessed migrations without force', async () => {
      const { process, processed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      const promise = service.rollbackByKey({ key: 'testMigration' });
      await assertRejects(promise, ProcessedMigrationError);
      assert.equal(processed, false);
    });

    it('should rollback when rolling back a unprocessed migration with force', async () => {
      const { process, processed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.rollbackByKey({ key: 'testMigration', force: true });
      assert.equal(processed, true);
    });
  });
};
