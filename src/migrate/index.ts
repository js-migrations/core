import { reduce } from 'bluebird';
import FacadeConfig from '../FacadeConfig';
import getUnprocessedKeys from '../utils/getUnprocessedKeys';
import handleLocks from '../utils/handleLocks';
import migrateKey from '../utils/migrateKey';
import Signature from './Signature';

export default (config: FacadeConfig): Signature => {
  return async () => {
    await handleLocks(config, async () => {
      const unprocessedKeys = await getUnprocessedKeys(config);
      const batchStart = new Date();

      await Promise.resolve(reduce(unprocessedKeys, async (_result, key) => {
        await migrateKey({ config, key, batchStart });
      }, Promise.resolve()));
    });
  };
};
