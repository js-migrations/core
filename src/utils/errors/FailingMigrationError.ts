// tslint:disable:no-class
import { BaseError } from 'make-error';

export default class FailingMigrationError extends BaseError {
  constructor(public key: string, public error: any) {
    super();
  }
}
