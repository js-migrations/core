import Status from '../utils/statuses/Status';

export interface Opts {
  readonly dryRun?: boolean;
  readonly log?: (status: Status) => void;
}

type Signature = (opts?: Opts) => Promise<void>;

export default Signature;
