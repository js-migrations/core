import migrateTest from './migrate/test';
import migrateByKeyTest from './migrateByKey/test';
import rollbackTest from './rollback/test';
import rollbackByKeyTest from './rollbackByKey/test';
import TestFactory from './utils/tests/TestFactory';

const testFactory: TestFactory = (repoFactory) => {
  describe('factory', () => {
    beforeEach(async () => {
      await repoFactory([]).clearMigrations();
    });

    migrateTest(repoFactory);
    migrateByKeyTest(repoFactory);
    rollbackTest(repoFactory);
    rollbackByKeyTest(repoFactory);
  });
};

export default testFactory;
