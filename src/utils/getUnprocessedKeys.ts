import { difference } from 'lodash';
import FacadeConfig from '../FacadeConfig';

export default async (config: FacadeConfig) => {
  const processedMigrations = await config.repo.getProcessedMigrations();
  const migrations = await config.repo.getMigrations();
  const processedKeys = processedMigrations.map(({ key }) => key);
  const migrationKeys = Object.keys(migrations);
  return difference(migrationKeys, processedKeys);
};
