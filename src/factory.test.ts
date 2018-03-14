import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import factory from './factory';
import factoryTest from './factoryTest';
import testRepoFactory from './utils/tests/testRepoFactory';

factoryTest((migrations) => {
  const log = () => null;
  return factory({ log, repo: testRepoFactory(migrations) });
});
