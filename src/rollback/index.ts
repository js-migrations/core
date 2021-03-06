import FacadeConfig from '../FacadeConfig';
import defaultLog from '../utils/defaultLog';
import getLastBatchKeys from '../utils/getLastBatchKeys';
import handleLocks from '../utils/handleLocks';
import rollbackKey from '../utils/rollbackKey';
import Signature, { Opts } from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ dryRun = false, log = defaultLog }: Opts = {}) => {
    await handleLocks({ config, log }, async () => {
      const lastBatchKeys = (await getLastBatchKeys(config)).reverse();

      await lastBatchKeys.reduce((promiseChain, key) => {
        return promiseChain.then(() => {
          return rollbackKey({ config, key, dryRun, log });
        });
      }, Promise.resolve());
    });
  };
};
