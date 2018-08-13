import FacadeConfig from '../FacadeConfig';
import defaultLog from '../utils/defaultLog';
import getUnprocessedKeys from '../utils/getUnprocessedKeys';
import handleLocks from '../utils/handleLocks';
import migrateKey from '../utils/migrateKey';
import Signature, { Opts } from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ dryRun = false, log = defaultLog }: Opts = {}) => {
    await handleLocks({ config, log }, async () => {
      const unprocessedKeys = await getUnprocessedKeys(config);
      const batchStart = new Date();

      await unprocessedKeys.reduce((promiseChain, key) => {
        return promiseChain.then(() => {
          return migrateKey({ config, key, batchStart, dryRun, log });
        });
      }, Promise.resolve());
    });
  };
};
