import ProcessedMigration from './utils/types/ProcessedMigration';

export default interface RepoFacade {
  readonly getProcessedMigrations: () => Promise<ProcessedMigration[]>;
  readonly updateProcessedMigration: (migration: ProcessedMigration) => Promise<void>;
  readonly removeProcessedMigration: (key: string) => Promise<void>;
  readonly clearMigrations: () => Promise<void>;
  readonly lockMigrations: () => Promise<void>;
  readonly unlockMigrations: () => Promise<void>;
}
