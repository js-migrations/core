import FacadeConfig from '../FacadeConfig';
import FailingMigrationError from './errors/FailingMigrationError';
import getMigrationByKey from './getMigrationByKey';

export interface Opts {
  readonly config: FacadeConfig;
  readonly key: string;
  readonly dryRun: boolean;
}

export default async ({ config, key, dryRun }: Opts) => {
  const migrations = await config.repo.getMigrations();
  const migration = getMigrationByKey(migrations, key);
  config.log(`Starting to rollback with ${key}`);
  if (!dryRun) {
    try {
      await migration.down();
    } catch (err) {
      throw new FailingMigrationError(key, err);
    }
  }
  await config.repo.removeProcessedMigration(key);
  config.log(`Completed rollback with ${key}`);
};
