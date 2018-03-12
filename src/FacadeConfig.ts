import RepoFacade from './RepoFacade';
import MigrationDictionary from './utils/types/MigrationDictionary';

export default interface FacadeConfig {
  readonly repo: RepoFacade;
  readonly log: (message: string) => void;
  readonly migrations: MigrationDictionary;
}
