import Facade from '../../Facade';
import Migration from '../types/Migration';

type TestFactory = (serviceFactory: (migrations: Migration[]) => Facade) => void;

export default TestFactory;
