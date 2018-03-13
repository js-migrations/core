import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import factoryTest from './factoryTest';
import ProcessedMigration from './utils/types/ProcessedMigration';

// tslint:disable-next-line:no-let
let processedMigrations: ProcessedMigration[] = [];

factoryTest({
  clearMigrations: async () => {
    processedMigrations = [];
  },
  getProcessedMigrations: async () => {
    return processedMigrations;
  },
  removeProcessedMigration: async (key) => {
    processedMigrations = processedMigrations.filter((processedMigration) => {
      return processedMigration.key !== key;
    });
  },
  updateProcessedMigration: async (migration) => {
    const unmatchedMigrations = processedMigrations.filter((processedMigration) => {
      return processedMigration.key !== migration.key;
    });
    processedMigrations = [...unmatchedMigrations, migration];
  },
});
