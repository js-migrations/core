import { defaultTo } from 'lodash';
import FacadeConfig from '../FacadeConfig';
import FailingMigrationError from './errors/FailingMigrationError';
import getMigrationByKey from './getMigrationByKey';
import MigrationEndStatus from './statuses/MigrationEndStatus';
import MigrationStartStatus from './statuses/MigrationStartStatus';
import Status from './statuses/Status';

export interface Opts {
  readonly config: FacadeConfig;
  readonly key: string;
  readonly batchStart?: Date;
  readonly dryRun: boolean;
  readonly log: (status: Status) => void;
}

export default async ({ config, key, batchStart, dryRun, log }: Opts) => {
  const migrations = await config.repo.getMigrations();
  const selectedMigration = getMigrationByKey(migrations, key);
  log(new MigrationStartStatus(key));
  if (!dryRun) {
    const processStart = new Date();
    try {
      await selectedMigration.up();
    } catch (err) {
      throw new FailingMigrationError(key, err);
    }
    const processEnd = new Date();
    await config.repo.recordProcessedMigration({
      batchStart: defaultTo(batchStart, processStart),
      key,
      processEnd,
      processStart,
    });
  }
  log(new MigrationEndStatus(key));
};
