export default interface ProcessedMigration {
  readonly key: string;
  readonly lastStart: Date;
  readonly lastBatch: Date;
}
