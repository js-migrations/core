import FacadeConfig from '../FacadeConfig';

export default async (config: FacadeConfig, handler: () => Promise<void>) => {
  await config.repo.lockMigrations();
  config.log('Locked migrations');
  try {
    await handler();
    config.log('Unlocked migrations after completion');
    await config.repo.unlockMigrations();
  } catch (err) {
    config.log('Unlocked migrations after error');
    await config.repo.unlockMigrations();
    throw err;
  }
};
