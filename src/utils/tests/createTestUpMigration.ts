import Migration from '../types/Migration';

export const testMigrationKey = 'testMigration';

export default (process: Function = () => null, key = testMigrationKey): Migration => {
  const down = async () => { /* istanbul ignore next */ };
  const up = async () => { return process(); };
  return { down, key, up };
};
