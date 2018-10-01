# core
Provides a database agnostic service for processing migrations in JavaScript.

### Introduction
The service makes use of database adapters (repository facades) to log the processed migrations in a database of your choice. Whilst the service logs the processed migrations to a configured database, the `up` and `down` functions can be used to migrate any storage service. For example, you could log the processed migrations to an SQL database, but the migrations themselves can migrate Mongo databases, S3 storage, etc.

The service and database adapters allow migrations to be recorded in a common format across databases to provide the same functionality regardless of the configured database. By utilising migration functions instead of migration files, it's easy to type check and compose migrations in different ways.

To allow multiple servers to run the migrations on startup, the service will lock and unlock migrations to ensure that your migrations only run once. To avoid downtime caused by deleting columns in migrations it's recommended that you make two releases as explained below where the code changes are deployed before the migrations are processed.

- Initial release
  - Code change: Stop reading deleted columns.
  - Migration: Make columns to be deleted optional (if not already).
- Final release
  - Code change: Stop writing to deleted columns.
  - Migration: Delete the columns.

### Usage
1. Install it with `npm i @js-migrations/core`.
1. [Create a repository facade](#create-a-repository-facade).
1. [Use the factory to create the service facade](#use-the-factory).

#### Create a repository facade
This package contains the [RepoFacade TypeScript interface](./src/RepoFacade.ts). You can create a facade to match the interface using the factories below.

- [Knex](https://github.com/js-migrations/knex/blob/master/readme.md)
- [Mongo](https://github.com/js-migrations/mongo/blob/master/readme.md)

#### Use the factory
```typescript
import migrationsServiceFactory from '@js-migrations/core/dist/factory';

const migrationsServiceFacade = migrationsServiceFactory({
  repo: migrationsRepoFacade,
});
```
