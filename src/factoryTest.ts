import migrateTest from './migrate/test';
import migrateByKeyTest from './migrateByKey/test';
import rollbackTest from './rollback/test';
import rollbackByKeyTest from './rollbackByKey/test';
import TestFactory from './utils/tests/TestFactory';

const testFactory: TestFactory = (serviceFactory) => {
  describe('factory', () => {
    beforeEach(async () => {
      await serviceFactory([]).clearMigrations();
    });

    migrateTest(serviceFactory);
    migrateByKeyTest(serviceFactory);
    rollbackTest(serviceFactory);
    rollbackByKeyTest(serviceFactory);
  });
};

export default testFactory;
