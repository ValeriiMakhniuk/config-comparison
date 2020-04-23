import { hasIn } from 'lodash';

const marks = {
  CHANGED: '+',
  REMOVED: '-',
  UNCHANGED: ' ',
};

const createDiff = (before, after) => {
  const uniqKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return Array.from(uniqKeys).reduce((acc, key) => {
    if (!hasIn(before, key)) {
      return [...acc, [marks.CHANGED, { [key]: after[key] }]];
    }
    if (!hasIn(after, key)) {
      return [...acc, [marks.REMOVED, { [key]: before[key] }]];
    }
    if (before[key] !== after[key]) {
      return [
        ...acc, [marks.CHANGED, { [key]: after[key] }], [marks.REMOVED, { [key]: before[key] }],
      ];
    }
    return [...acc, [marks.UNCHANGED, { [key]: before[key] }]];
  }, []);
};

export default createDiff;
