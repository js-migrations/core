import MigrateSignature from './migrate/Signature';
import MigrateByKeySignature from './migrateByKey/Signature';
import RollbackSignature from './rollback/Signature';
import RollbackByKeySignature from './rollbackByKey/Signature';
import Migration from './utils/types/Migration';

export default interface Facade {
  readonly clearMigrations: () => Promise<void>;
  readonly getMigrations: () => Promise<Migration[]>;
  readonly migrate: MigrateSignature;
  readonly migrateByKey: MigrateByKeySignature;
  readonly rollback: RollbackSignature;
  readonly rollbackByKey: RollbackByKeySignature;
}
