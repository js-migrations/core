export default () => {
  let processed = false; // tslint:disable-line:no-let
  const process = () => {
    processed = true;
  };
  return { processed, process };
};
