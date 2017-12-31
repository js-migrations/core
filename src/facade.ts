import FacadeConfig from './FacadeConfig';
import migrate from './migrate';
import migrateByKey from './migrateByKey';
import rollback from './rollback';
import rollbackByKey from './rollbackByKey';
import Service from './Service';

export default (config: FacadeConfig): Service => {
  return {
    migrate: migrate(config),
    migrateByKey: migrateByKey(config),
    rollback: rollback(config),
    rollbackByKey: rollbackByKey(config),
  };
};
