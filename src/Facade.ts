import MigrateSignature from './migrate/Signature';
import MigrateByKeySignature from './migrateByKey/Signature';
import RollbackSignature from './rollback/Signature';
import RollbackByKeySignature from './rollbackByKey/Signature';

export default interface Facade {
  readonly migrate: MigrateSignature;
  readonly migrateByKey: MigrateByKeySignature;
  readonly rollback: RollbackSignature;
  readonly rollbackByKey: RollbackByKeySignature;
}
