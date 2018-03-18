import Status from './Status';

// tslint:disable-next-line:no-class
export default class RollbackStartStatus extends Status {
  constructor(public key: string) {
    super();
  }
}
