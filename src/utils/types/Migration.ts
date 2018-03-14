export default interface Migration {
  readonly key: string;
  readonly up: () => Promise<void>;
  readonly down: () => Promise<void>;
}
