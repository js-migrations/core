import { includes } from 'lodash';
import FacadeConfig from '../FacadeConfig';

export default async (config: FacadeConfig, key: string) => {
  const processedMigrations = await config.repo.getProcessedMigrations();
  const processedKeys = processedMigrations.map((migration) => migration.key);
  return includes(processedKeys, key);
};
