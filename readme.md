# core
> Provides a common service for migrations in JavaScript.

### Usage
1. Install it with `npm i @js-migrations/core`.
1. [Create a repository facade](#create-a-repository-facade).
1. [Use the factory to create the service facade](#use-the-factory).

### Create a repository facade
This package contains the [RepoFacade TypeScript interface](./src/RepoFacade.ts). You can create a facade to match the interface using the factories below.

- [Knex](https://github.com/js-migrations/knex/blob/master/readme.md)
- [Mongo](https://github.com/js-migrations/mongo/blob/master/readme.md) - Coming Soon.

### Use the factory
```typescript
import migrationsServiceFactory from '@js-migrations/core/dist/factory';

const migrationsServiceFacade = migrationsServiceFactory({
  log: console.log.bind(console),
  repo: migrationsRepoFacade,
});
```

### Intentions
- Create an API for processing migrations in applications storing data in multiple ways (e.g. databases and files).
- Allow processed migrations to be recorded in a common format across databases.
- Focus on functions rather than files to improve type checking and composability.
- Focus on migrations being a function of the application more than a developer tool.

### Avoiding downtime
To avoid downtime caused by deleting columns in migrations it's recommended that you make two releases as explained below where the code changes are deployed before the migrations are processed.

- Initial release
  - Code change: Stop reading deleted columns.
  - Migration: Make columns to be deleted optional (if not already).
- Final release
  - Code change: Stop writing to deleted columns.
  - Migration: Delete the columns.
