export interface Opts {
  readonly dryRun?: boolean;
}

type Signature = (opts?: Opts) => Promise<void>;

export default Signature;
