import has from 'lodash/has';
import isPlainObject from 'lodash/isPlainObject';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';

const createDiffTree = (before, after) => {
  const uniqKeys = union(Object.keys(before), Object.keys(after));
  return uniqKeys.map((key) => {
    if (!has(before, key)) {
      return {
        key,
        state: 'added',
        value: after[key],
      };
    }
    if (!has(after, key)) {
      return {
        key,
        state: 'removed',
        value: before[key],
      };
    }
    if (isPlainObject(before[key]) && isPlainObject(after[key])) {
      return {
        key,
        state: 'nested',
        children: createDiffTree(before[key], after[key]),
      };
    }
    if (!isEqual(before[key], after[key])) {
      return {
        key,
        state: 'changed',
        value: {
          before: before[key],
          after: after[key],
        },
      };
    }

    return {
      key,
      state: 'unchanged',
      value: before[key],
    };
  });
};

export default createDiffTree;
