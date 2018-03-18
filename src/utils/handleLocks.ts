import FacadeConfig from '../FacadeConfig';
import LockedStatus from './statuses/LockedStatus';
import Status from './statuses/Status';
import UnlockedCompletionStatus from './statuses/UnlockedCompletionStatus';
import UnlockedErrorStatus from './statuses/UnlockedErrorStatus';

export interface Opts {
  readonly config: FacadeConfig;
  readonly log: (status: Status) => void;
}

export default async ({ config, log }: Opts, handler: () => Promise<void>) => {
  await config.repo.lockMigrations();
  log(new LockedStatus());
  try {
    await handler();
    log(new UnlockedCompletionStatus());
    await config.repo.unlockMigrations();
  } catch (err) {
    log(new UnlockedErrorStatus());
    await config.repo.unlockMigrations();
    throw err;
  }
};
