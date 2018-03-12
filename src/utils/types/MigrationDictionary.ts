import Migration from './Migration';

export default interface MigrationDictionary {
  readonly [key: string]: Migration;
}
