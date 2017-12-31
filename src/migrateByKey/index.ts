import FacadeConfig from '../FacadeConfig';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import hasProcessedKey from '../utils/hasProcessedKey';
import migrateKey from '../utils/migrateKey';
import Signature from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ key, force }) => {
    const hasRunBefore = await hasProcessedKey(config, key);
    if (hasRunBefore && !force) {
      throw new ProcessedMigrationError(key);
    }

    await migrateKey({ config, key });
  };
};
