import RepoFacade from './RepoFacade';

export default interface FacadeConfig {
  readonly repo: RepoFacade;
  readonly log: (message: string) => void;
}
