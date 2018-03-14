import { defaultTo } from 'lodash';
import FacadeConfig from '../FacadeConfig';
import FailingMigrationError from './errors/FailingMigrationError';
import getMigrationByKey from './getMigrationByKey';

export interface Opts {
  readonly config: FacadeConfig;
  readonly key: string;
  readonly batchStart?: Date;
  readonly dryRun: boolean;
}

export default async ({ config, key, batchStart, dryRun }: Opts) => {
  const migrations = await config.repo.getMigrations();
  const selectedMigration = getMigrationByKey(migrations, key);
  config.log(`Starting to migrate with ${key}`);
  if (!dryRun) {
    const migrationStart = new Date();
    try {
      await selectedMigration.up();
    } catch (err) {
      throw new FailingMigrationError(key, err);
    }
    await config.repo.updateProcessedMigration({
      key,
      lastBatch: defaultTo(batchStart, migrationStart),
      lastStart: migrationStart,
    });
  }
  config.log(`Completed migration with ${key}`);
};
