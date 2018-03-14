import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import factoryTest from './factoryTest';
import testRepoFactory from './utils/tests/testRepoFactory';

factoryTest(testRepoFactory);
