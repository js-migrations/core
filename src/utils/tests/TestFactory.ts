import RepoFacade from '../../RepoFacade';
import MigrationDictionary from '../types/MigrationDictionary';

type TestFactory = (repoFactory: (migrations: MigrationDictionary) => RepoFacade) => void;

export default TestFactory;
