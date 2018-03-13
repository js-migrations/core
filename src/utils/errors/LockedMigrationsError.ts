// tslint:disable:no-class
import { BaseError } from 'make-error';

export default class LockedMigrationsError extends BaseError {
  constructor() {
    super();
  }
}
