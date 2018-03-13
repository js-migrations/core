import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import RepoFacade from '../RepoFacade';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import LockedMigrationsError from '../utils/errors/LockedMigrationsError';
import UnprocessedMigrationError from '../utils/errors/UnprocessedMigrationError';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestDownMigration from '../utils/tests/createTestDownMigration';
import MigrationDictionary from '../utils/types/MigrationDictionary';

export default (repo: RepoFacade) => {
  const successfulMigration = createTestDownMigration();
  const failingMigration = createTestDownMigration(() => { throw new Error(); });

  const createService = (migrations: MigrationDictionary) => {
    const log = () => null;
    return factory({ log, migrations, repo });
  };

  describe('rollbackByKey', () => {
    it('should error when the migration is missing', async () => {
      const service = createService({});
      const promise = service.rollbackByKey({ key: 'missingKey' });
      await assertRejects(promise, UnprocessedMigrationError);
    });

    it('should error when the migration errors', async () => {
      const service = createService({ failingMigration });
      await service.migrate();
      const promise = service.rollbackByKey({ key: 'failingMigration' });
      await assertRejects(promise, FailingMigrationError);
    });

    it('should rollback processed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.migrate();
      await service.rollbackByKey({ key: 'testMigration' });
      assert.equal(getProcessed(), true);
    });

    it('should error when rolling back unprocessed migrations without force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      const promise = service.rollbackByKey({ key: 'testMigration' });
      await assertRejects(promise, UnprocessedMigrationError);
      assert.equal(getProcessed(), false);
    });

    it('should rollback when rolling back a unprocessed migration with force', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.rollbackByKey({ key: 'testMigration', force: true });
      assert.equal(getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService({ successfulMigration });
      await service.migrate();
      const promise = Promise.all([
        service.rollbackByKey({ key: 'successfulMigration' }),
        service.rollbackByKey({ key: 'successfulMigration' }),
      ]);
      await assertRejects(promise, LockedMigrationsError);
    });
  });
};
