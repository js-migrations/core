import LockedStatus from './statuses/LockedStatus';
import MigrationEndStatus from './statuses/MigrationEndStatus';
import MigrationStartStatus from './statuses/MigrationStartStatus';
import RollbackEndStatus from './statuses/RollbackEndStatus';
import RollbackStartStatus from './statuses/RollbackStartStatus';
import Status from './statuses/Status';
import UnlockedCompletionStatus from './statuses/UnlockedCompletionStatus';
import UnlockedErrorStatus from './statuses/UnlockedErrorStatus';

export default (status: Status) => {
  const log = (_message: string) => {
    return;
  };
  if (status instanceof LockedStatus) {
    log('Locked migrations');
  } else if (status instanceof MigrationEndStatus) {
    log(`Completed migration (${status.key})`);
  } else if (status instanceof MigrationStartStatus) {
    log(`Starting migration (${status.key})`);
  } else if (status instanceof RollbackEndStatus) {
    log(`Completed rollback (${status.key})`);
  } else if (status instanceof RollbackStartStatus) {
    log(`Starting rollback (${status.key})`);
  } else if (status instanceof UnlockedCompletionStatus) {
    log('Unlocking migratons after completion');
  } else if (status instanceof UnlockedErrorStatus) {
    log('Unlocking migratons after error');
  } else {
    /* istanbul ignore next - Unknown status */
    return;
  }
};
