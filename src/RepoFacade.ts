import Migration from './utils/types/Migration';
import ProcessedMigration from './utils/types/ProcessedMigration';

export default interface RepoFacade {
  readonly getMigrations: () => Promise<Migration[]>;
  readonly getProcessedMigrations: () => Promise<ProcessedMigration[]>;
  readonly recordProcessedMigration: (migration: ProcessedMigration) => Promise<void>;
  readonly removeProcessedMigration: (key: string) => Promise<void>;
  readonly clearMigrations: () => Promise<void>;
  readonly lockMigrations: () => Promise<void>;
  readonly unlockMigrations: () => Promise<void>;
}
