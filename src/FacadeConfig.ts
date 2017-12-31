import Repo from './Repo';
import Migration from './utils/types/Migration';

export default interface FacadeConfig {
  readonly repo: Repo;
  readonly log: (message: string) => void;
  readonly migrations: { readonly [key: string]: Migration };
}
