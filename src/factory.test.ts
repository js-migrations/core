import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import factoryTest from './factoryTest';
import LockedMigrationsError from './utils/errors/LockedMigrationsError';
import ProcessedMigration from './utils/types/ProcessedMigration';

let processedMigrations: ProcessedMigration[] = []; // tslint:disable-line:no-let
let hasLockedMigrations = false; // tslint:disable-line:no-let

factoryTest({
  clearMigrations: async () => {
    processedMigrations = [];
  },
  getProcessedMigrations: async () => {
    return processedMigrations;
  },
  lockMigrations: async () => {
    if (hasLockedMigrations) {
      throw new LockedMigrationsError();
    }
    hasLockedMigrations = true;
  },
  removeProcessedMigration: async (key) => {
    processedMigrations = processedMigrations.filter((processedMigration) => {
      return processedMigration.key !== key;
    });
  },
  unlockMigrations: async () => {
    hasLockedMigrations = false;
  },
  updateProcessedMigration: async (migration) => {
    const unmatchedMigrations = processedMigrations.filter((processedMigration) => {
      return processedMigration.key !== migration.key;
    });
    processedMigrations = [...unmatchedMigrations, migration];
  },
});
