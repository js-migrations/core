export interface Opts {
  readonly key: string;
  readonly force?: boolean;
  readonly dryRun?: boolean;
}

type Signature = (opts: Opts) => Promise<void>;

export default Signature;
