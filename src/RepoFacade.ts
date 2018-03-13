import MigrationDictionary from './utils/types/MigrationDictionary';
import ProcessedMigration from './utils/types/ProcessedMigration';

export default interface RepoFacade {
  readonly getMigrations: () => Promise<MigrationDictionary>;
  readonly getProcessedMigrations: () => Promise<ProcessedMigration[]>;
  readonly updateProcessedMigration: (migration: ProcessedMigration) => Promise<void>;
  readonly removeProcessedMigration: (key: string) => Promise<void>;
  readonly clearMigrations: () => Promise<void>;
  readonly lockMigrations: () => Promise<void>;
  readonly unlockMigrations: () => Promise<void>;
}
