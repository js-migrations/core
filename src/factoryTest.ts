import migrateTest from './migrate/test';
import migrateByKeyTest from './migrateByKey/test';
import RepoFacade from './RepoFacade';
import rollbackTest from './rollback/test';
import rollbackByKeyTest from './rollbackByKey/test';

export default (repo: RepoFacade) => {
  describe('factory', () => {
    beforeEach(async () => {
      await repo.clearMigrations();
    });

    migrateTest(repo);
    migrateByKeyTest(repo);
    rollbackTest(repo);
    rollbackByKeyTest(repo);
  });
};
