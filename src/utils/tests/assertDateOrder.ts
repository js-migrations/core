import * as assert from 'assert';

export default (dates: Date[]) => {
  const expectedDates = dates.map((date) => {
    return date.toISOString();
  });
  const sortedDates = [...expectedDates].sort();
  assert.deepEqual(sortedDates, expectedDates);
};
