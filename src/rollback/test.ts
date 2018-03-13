import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import RepoFacade from '../RepoFacade';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import MissingMigrationError from '../utils/errors/MissingMigrationError';
import assertLocked from '../utils/tests/assertLocked';
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

  describe('rollback', () => {
    it('should not error when there are no migrations', async () => {
      const service = createService({});
      await service.rollback();
    });

    it('should error when a processed migration is missing', async () => {
      await createService({ successfulMigration }).migrate();
      const promise = createService({}).rollback();
      await assertRejects(promise, MissingMigrationError);
    });

    it('should error when the first migration errors', async () => {
      const service = createService({ failingMigration, successfulMigration });
      await service.migrate();
      const promise = service.rollback();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should error when the second migration errors', async () => {
      const service = createService({ successfulMigration, failingMigration });
      await service.migrate();
      const promise = service.rollback();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process rollback for a processed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.migrate();
      await service.rollback();
      assert.equal(getProcessed(), true);
    });

    it('should not process rollback for a unprocessed migration', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestDownMigration(process) });
      await service.rollback();
      assert.equal(getProcessed(), false);
    });

    it('should skip processed migrations after unprocessed migrations', async () => {
      const skippedMigration = createMigrationProcess();
      const unskippedMigration = createMigrationProcess();
      await createService({ migrationToProcess: createTestDownMigration() }).migrate();
      await createService({
        migrationToProcess: createTestDownMigration(unskippedMigration.process),
        migrationToSkip: createTestDownMigration(skippedMigration.process),
      }).rollback();
      assert.equal(skippedMigration.getProcessed(), false);
      assert.equal(unskippedMigration.getProcessed(), true);
    });

    it('should skip processed migrations before unprocessed migrations', async () => {
      const skippedMigration = createMigrationProcess();
      const unskippedMigration = createMigrationProcess();
      await createService({ migrationToProcess: createTestDownMigration() }).migrate();
      await createService({
        migrationToSkip: createTestDownMigration(skippedMigration.process),
        // tslint:disable-next-line:object-literal-sort-keys
        migrationToProcess: createTestDownMigration(unskippedMigration.process),
      }).rollback();
      assert.equal(skippedMigration.getProcessed(), false);
      assert.equal(unskippedMigration.getProcessed(), true);
    });

    it('should error when migrations are locked', async () => {
      const service = createService({});
      await assertLocked([service.rollback(), service.rollback()]);
    });
  });
};
