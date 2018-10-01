# Introduction

The service makes use of database adapters (repository facades) to log the processed migrations in a database of your choice. Whilst the service logs the processed migrations to a configured database, the `up` and `down` functions can be used to migrate any storage service. For example, you could log the processed migrations to an SQL database, but the migrations themselves can migrate Mongo databases, S3 storage, etc.

The service and database adapters allow migrations to be recorded in a common format across databases to provide the same functionality regardless of the configured database. By utilising migration functions instead of migration files, it's easy to type check and compose migrations in different ways.

To allow multiple servers to run the migrations on startup, the service will lock and unlock migrations to ensure that your migrations only run once. To avoid downtime, you can checkout the database refactoring recommendations listed below.

- [Deleting a column](./refactors/delete-column.md)
- [Renaming a column](./refactors/rename-column.md)
