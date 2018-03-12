import Migration from '../types/Migration';

export default (process: Function = () => null): Migration => {
  return {
    down: async () => { return process(); },
    up: async () => { return; },
  };
};
