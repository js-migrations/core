import RepoFacade from '../../RepoFacade';
import Migration from '../types/Migration';

type TestFactory = (repoFactory: (migrations: Migration[]) => RepoFacade) => void;

export default TestFactory;
