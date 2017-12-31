export default interface Migration {
  readonly up: () => Promise<void>;
  readonly down: () => Promise<void>;
}
