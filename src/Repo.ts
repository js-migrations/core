import ProcessedMigration from './utils/types/ProcessedMigration';

export default interface Repo {
  readonly getProcessedMigrations: () => Promise<ProcessedMigration[]>;
  readonly updateProcessedMigration: (migration: ProcessedMigration) => Promise<void>;
  readonly removeProcessedMigration: (key: string) => Promise<void>;
}
