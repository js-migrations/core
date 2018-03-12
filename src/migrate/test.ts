import * as assert from 'assert';
import * as assertRejects from 'assert-rejects';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import factory from '../factory';
import RepoFacade from '../RepoFacade';
import FailingMigrationError from '../utils/errors/FailingMigrationError';
import createMigrationProcess from '../utils/tests/createMigrationProcess';
import createTestUpMigration from '../utils/tests/createTestUpMigration';
import MigrationDictionary from '../utils/types/MigrationDictionary';

export default (repo: RepoFacade) => {
  const successfulMigration = createTestUpMigration();
  const failingMigration = createTestUpMigration(() => { throw new Error(); });

  const createService = (migrations: MigrationDictionary) => {
    const log = () => null;
    return factory({ log, migrations, repo });
  };

  describe('migrate', () => {
    it('should not error when there are no migrations', async () => {
      const service = createService({});
      await service.migrate();
    });

    it('should error when the first migration errors', async () => {
      const promise = createService({ failingMigration, successfulMigration }).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should error when the second migration errors', async () => {
      const promise = createService({ successfulMigration, failingMigration }).migrate();
      await assertRejects(promise, FailingMigrationError);
    });

    it('should process migrations', async () => {
      const { process, getProcessed } = createMigrationProcess();
      const service = createService({ testMigration: createTestUpMigration(process) });
      await service.migrate();
      assert.equal(getProcessed(), true);
    });

    it('should not reprocess migrations', async () => {
      const { process, getProcessed } = createMigrationProcess();
      await createService({ testMigration: createTestUpMigration() }).migrate();
      await createService({ testMigration: createTestUpMigration(process) }).migrate();
      assert.equal(getProcessed(), false);
    });

    it('should skip processed migrations after unprocessed migrations', async () => {
      const skippedMigration = createMigrationProcess();
      const unskippedMigration = createMigrationProcess();
      await createService({ migrationToSkip: createTestUpMigration() }).migrate();
      await createService({
        migrationToProcess: createTestUpMigration(unskippedMigration.process),
        migrationToSkip: createTestUpMigration(skippedMigration.process),
      }).migrate();
      assert.equal(skippedMigration.getProcessed(), false);
      assert.equal(unskippedMigration.getProcessed(), true);
    });

    it('should skip processed migrations before unprocessed migrations', async () => {
      const skippedMigration = createMigrationProcess();
      const unskippedMigration = createMigrationProcess();
      await createService({ migrationToSkip: createTestUpMigration() }).migrate();
      await createService({
        migrationToSkip: createTestUpMigration(skippedMigration.process),
        // tslint:disable-next-line:object-literal-sort-keys
        migrationToProcess: createTestUpMigration(unskippedMigration.process),
      }).migrate();
      assert.equal(skippedMigration.getProcessed(), false);
      assert.equal(unskippedMigration.getProcessed(), true);
    });
  });
};
