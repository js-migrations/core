# core
> Provides a common service for migrations in JavaScript.

### Usage
1. Install it with `npm i @js-migrations/core`.
1. [Use the factory to create the service facade](#use-the-factory).

### Use the factory
```typescript
import migrationsServiceFactory from '@js-migrations/core/dist/factory';

const migrationsServiceFacade = migrationsServiceFactory({
  log: console.log.bind(console),
  repo: migrationsRepoFacade,
});
```
