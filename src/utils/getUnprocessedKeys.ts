import { difference } from 'lodash';
import FacadeConfig from '../FacadeConfig';

export default async (config: FacadeConfig) => {
  const [migrations, processedMigrations] = await Promise.all([
    config.repo.getMigrations(),
    config.repo.getProcessedMigrations(),
  ]);
  const processedKeys = processedMigrations.map(({ key }) => key);
  const migrationKeys = migrations.map(({ key }) => key);
  return difference(migrationKeys, processedKeys);
};
