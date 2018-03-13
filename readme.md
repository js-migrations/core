# core
> Provides a common service for migrations in JavaScript.

### Usage
1. Install it with `npm i @js-migrations/core`.
1. [Create a repository facade](#create-a-repository-facade).
1. [Use the factory to create the service facade](#use-the-factory).

### Create a repository facade
This package contains the [RepoFacade TypeScript interface](./src/RepoFacade.ts). You can create a facade to match the interface using the factories below.

- [Knex](https://github.com/js-migrations/knex)
- [Mongo](https://github.com/js-migrations/mongo) - Coming Soon.

### Use the factory
```typescript
import migrationsServiceFactory from '@js-migrations/core/dist/factory';

const migrationsServiceFacade = migrationsServiceFactory({
  log: console.log.bind(console),
  repo: migrationsRepoFacade,
});
```
