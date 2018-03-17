import { delay } from 'bluebird';

export default () => {
  let processed: Date | undefined; // tslint:disable-line:no-let
  const process = async () => {
    await delay(1);
    processed = new Date();
  };
  const getProcessed = () => {
    return processed;
  };
  return { getProcessed, process };
};
