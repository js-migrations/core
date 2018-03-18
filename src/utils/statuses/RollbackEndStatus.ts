import Status from './Status';

// tslint:disable-next-line:no-class
export default class RollbackEndStatus extends Status {
  constructor(public key: string) {
    super();
  }
}
