import Migration from '../types/Migration';

export default (process: Function = () => null): Migration => {
  return {
    down: async () => {
      /* istanbul ignore next */
      return;
    },
    up: async () => { return process(); },
  };
};
