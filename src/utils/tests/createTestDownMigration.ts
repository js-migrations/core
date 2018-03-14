import Migration from '../types/Migration';

export default (process: Function = () => null, key = 'testMigration'): Migration => {
  const down = async () => { return process(); };
  const up = async () => { /* istanbul ignore next */ };
  return { down, key, up };
};
