export default () => {
  let processed = false; // tslint:disable-line:no-let
  const process = () => {
    processed = true;
  };
  const getProcessed = () => {
    return processed;
  };
  return { getProcessed, process };
};
