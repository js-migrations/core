import FacadeConfig from '../FacadeConfig';
import defaultLog from '../utils/defaultLog';
import UnprocessedMigrationError from '../utils/errors/UnprocessedMigrationError';
import handleLocks from '../utils/handleLocks';
import hasProcessedKey from '../utils/hasProcessedKey';
import rollbackKey from '../utils/rollbackKey';
import Signature from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ key, force = false, dryRun = false, log = defaultLog }) => {
    await handleLocks({ config, log }, async () => {
      const isProcessed = await hasProcessedKey(config, key);
      if (!isProcessed && !force) {
        throw new UnprocessedMigrationError(key);
      }

      await rollbackKey({ config, key, dryRun, log });
    });
  };
};
