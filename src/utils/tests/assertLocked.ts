import * as assert from 'assert';
import LockedMigrationsError from '../errors/LockedMigrationsError';

const assertLockError = (promise: Promise<void>) => {
  return promise.then(() => {
    return true;
  }).catch((err: any) => {
    assert(err instanceof LockedMigrationsError);
    return false;
  });
};

export default async (promises: Promise<void>[]) => {
  const results = await Promise.all(promises.map(assertLockError));
  const successes = results.filter((result) => result).length;
  const failures = results.filter((result) => !result).length;
  assert.equal(successes, 1);
  assert.equal(failures, 1);
};
