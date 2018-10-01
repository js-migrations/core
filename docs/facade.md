# Facade

The facade contains functions for managing and processing migrations.

- [clearMigrations](../src/factory.ts): 
  Deletes all logs of processed migrations.
- [getMigrations](../src/factory.ts):
  Returns all of the available migrations (not necessarily processed).
- [migrate](./src/migrate/index.ts):
  Runs the `up` function for all of the available migrations that haven't been processed.
- [migrateByKey](./src/migrateByKey/index.ts):
  Runs the `up` function for the migration with the given `key` if it hasn't been processed already (use the `force` option to run for processed migrations).
- [rollback](./src/rollback/index.ts):
  Runs the `down` function for all of the processed migrations in the last batch.
- [rollbackByKey](./src/rollbackByKey/index.ts):
  Runs the `down` function for the migration with the given `key` if it has been processed already (use the `force` option to run for unprocessed migrations).

This package also contains some types that you might find useful.

- [Migration](../src/types/Migration.ts):
  An object that represents an available migration, with a `key` to identify the migration, an `up` function for migrating, and a `down` function for rolling back.
- [ProcessedMigration](../src/types/ProcessedMigration.ts):
  An object that represents a migration for which the `up` function has been ran already.

This package also contains some error classes that you might want to use.

- [DuplicateKeyError](../src/utils/errors/DuplicateKeyError.ts):
  An error that is thrown when the same key has been used by two or more migrations.
- [FailingMigrationError](../src/utils/errors/FailingMigrationError.ts):
  An error that is thrown when a `up` or `down` function throws an error during processing.
- [LockedMigrationError](../src/utils/errors/LockedMigrationError.ts):
  An error that is thrown when another process is processing migrations.
- [MissingMigrationError](../src/utils/errors/MissingMigrationError.ts):
  An error that is thrown when migrating or rolling back with a key that doesn't exist for any migrations.
- [ProcessedMigrationError](../src/utils/errors/ProcessedMigrationError.ts):
  An error that is thrown when running the `up` function for a migration that has already been processed.
- [UnprocessedMigrationError](../src/utils/errors/UnprocessedMigrationError.ts):
  An error that is thrown when running the `down` function for a migration that hasn't been processed yet.

