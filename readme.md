# core
> Provides a database agnostic service for processing migrations in JavaScript. [Read the docs for more information](./docs/readme.md).

### Usage
1. Install it with `npm i @js-migrations/core`.
1. [Create a repository facade](#create-a-repository-facade).
1. [Use the factory to create the service facade](#use-the-factory).
1. [Use the service facade by understanding the docs](./docs/facade.md) or trying one of [the supported presenters](#use-a-supported-presenter).

#### Create a repository facade
This package contains the [RepoFacade TypeScript interface](./src/RepoFacade.ts). You can create a facade to match the interface using the factories below.

- [Knex for SQL](https://github.com/js-migrations/knex/blob/master/readme.md)
- [Mongo](https://github.com/js-migrations/mongo/blob/master/readme.md)

#### Use the factory
```typescript
import migrationsServiceFactory from '@js-migrations/core/dist/factory';

const migrationsServiceFacade = migrationsServiceFactory({
  repo: migrationsRepoFacade,
});
```

#### Use a supported presenter
The service facade is used by the following packages that provide a presentation layer to the service.

- [Commander for CLI](https://github.com/js-migrations/commander/blob/master/readme.md)
