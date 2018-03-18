import FacadeConfig from '../FacadeConfig';
import FailingMigrationError from './errors/FailingMigrationError';
import getMigrationByKey from './getMigrationByKey';
import RollbackEndStatus from './statuses/RollbackEndStatus';
import RollbackStartStatus from './statuses/RollbackStartStatus';
import Status from './statuses/Status';

export interface Opts {
  readonly config: FacadeConfig;
  readonly key: string;
  readonly dryRun: boolean;
  readonly log: (status: Status) => void;
}

export default async ({ config, key, dryRun, log }: Opts) => {
  const migrations = await config.repo.getMigrations();
  const migration = getMigrationByKey(migrations, key);
  log(new RollbackStartStatus(key));
  if (!dryRun) {
    try {
      await migration.down();
    } catch (err) {
      throw new FailingMigrationError(key, err);
    }
  }
  await config.repo.removeProcessedMigration(key);
  log(new RollbackEndStatus(key));
};
