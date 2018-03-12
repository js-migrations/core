import FacadeConfig from '../FacadeConfig';
import FailingMigrationError from './errors/FailingMigrationError';
import getMigrationByKey from './getMigrationByKey';

export interface Opts {
  readonly config: FacadeConfig;
  readonly key: string;
}

export default async ({ config, key }: Opts) => {
  const migration = getMigrationByKey(config.migrations, key);
  config.log(`Starting to rollback with ${key}`);
  try {
    await migration.down();
  } catch (err) {
    throw new FailingMigrationError(key, err);
  }
  await config.repo.removeProcessedMigration(key);
  config.log(`Completed rollback with ${key}`);
};
