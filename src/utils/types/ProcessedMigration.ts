export default interface ProcessedMigration {
  readonly key: string;
  readonly processStart: Date;
  readonly processEnd: Date;
  readonly batchStart: Date;
}
