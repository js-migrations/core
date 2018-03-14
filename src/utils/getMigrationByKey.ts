import DuplicateKeyError from './errors/DuplicateKeyError';
import MissingMigrationError from './errors/MissingMigrationError';
import Migration from './types/Migration';

export default (migrations: Migration[], key: string): Migration => {
  const matchingMigrations = migrations.filter((migration) => {
    return migration.key === key;
  });

  if (matchingMigrations.length === 0) {
    throw new MissingMigrationError(key);
  }
  if (matchingMigrations.length > 1) {
    throw new DuplicateKeyError(key);
  }

  return matchingMigrations[0];
};
