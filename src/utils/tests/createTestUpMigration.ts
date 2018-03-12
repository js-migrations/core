import Migration from '../types/Migration';

export default (process: Function = () => null): Migration => {
  return {
    down: async () => { return; },
    up: async () => { return process(); },
  };
};
