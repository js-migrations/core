import FacadeConfig from '../FacadeConfig';
import defaultLog from '../utils/defaultLog';
import ProcessedMigrationError from '../utils/errors/ProcessedMigrationError';
import handleLocks from '../utils/handleLocks';
import hasProcessedKey from '../utils/hasProcessedKey';
import migrateKey from '../utils/migrateKey';
import Signature from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ key, force = false, dryRun = false, log = defaultLog }) => {
    await handleLocks({ config, log }, async () => {
      const isProcessed = await hasProcessedKey(config, key);
      if (isProcessed && !force) {
        throw new ProcessedMigrationError(key);
      }

      await migrateKey({ config, key, dryRun, log });
    });
  };
};
