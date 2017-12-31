import { has } from 'lodash';
import MissingMigrationError from './errors/MissingMigrationError';
import Migration from './types/Migration';

export default (migrations: { readonly [key: string]: Migration }, key: string): Migration => {
  const migration = migrations[key];

  if (!has(migrations, key)) {
    throw new MissingMigrationError(key);
  }

  return migration;
};
