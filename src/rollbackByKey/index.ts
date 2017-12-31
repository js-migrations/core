import FacadeConfig from '../FacadeConfig';
import UnprocessedMigrationError from '../utils/errors/UnprocessedMigrationError';
import hasProcessedKey from '../utils/hasProcessedKey';
import rollbackKey from '../utils/rollbackKey';
import Signature from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ key, force }) => {
    const isProcessed = await hasProcessedKey(config, key);
    if (!isProcessed && !force) {
      throw new UnprocessedMigrationError(key);
    }

    await rollbackKey({ config, key });
  };
};
