// tslint:disable:no-class
import { BaseError } from 'make-error';

export default class UnprocessedMigrationError extends BaseError {
  constructor(public key: string) {
    super();
  }
}
