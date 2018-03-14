import Facade from './Facade';
import FacadeConfig from './FacadeConfig';
import migrate from './migrate';
import migrateByKey from './migrateByKey';
import rollback from './rollback';
import rollbackByKey from './rollbackByKey';

export default (config: FacadeConfig): Facade => {
  return {
    clearMigrations: config.repo.clearMigrations,
    getMigrations: config.repo.getMigrations,
    migrate: migrate(config),
    migrateByKey: migrateByKey(config),
    rollback: rollback(config),
    rollbackByKey: rollbackByKey(config),
  };
};
