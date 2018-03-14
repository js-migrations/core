import { reduce } from 'bluebird';
import FacadeConfig from '../FacadeConfig';
import getLastBatchKeys from '../utils/getLastBatchKeys';
import handleLocks from '../utils/handleLocks';
import rollbackKey from '../utils/rollbackKey';
import Signature, { Opts } from './Signature';

export default (config: FacadeConfig): Signature => {
  return async ({ dryRun = false }: Opts = {}) => {
    await handleLocks(config, async () => {
      const lastBatchKeys = await getLastBatchKeys(config);

      await Promise.resolve(reduce(lastBatchKeys, async (_result, key) => {
        await rollbackKey({ config, key, dryRun });
      }, Promise.resolve()));
    });
  };
};
