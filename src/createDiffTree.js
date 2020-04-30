import hasIn from 'lodash/hasIn';
import isPlainObject from 'lodash/isPlainObject';
import union from 'lodash/union';

const createDiffTree = (before, after) => {
  const uniqKeys = union(Object.keys(before), Object.keys(after));
  return uniqKeys.map((key) => {
    if (!hasIn(before, key)) {
      const diffNode = {
        key,
        state: 'added',
        value: after[key],
      };

      return diffNode;
    }
    if (!hasIn(after, key)) {
      const diffNode = {
        key,
        state: 'removed',
        value: before[key],
      };

      return diffNode;
    }
    if (isPlainObject(before[key]) && isPlainObject(after[key])) {
      const diffNode = {
        key,
        state: 'nested',
        value: createDiffTree(before[key], after[key]),
      };

      return diffNode;
    }
    if (Array.isArray(before[key]) && Array.isArray(after[key])) {
      const isChanged = JSON.stringify(before[key]) !== JSON.stringify(after[key]);
      const diffNode = {
        key,
        state: isChanged ? 'changed' : 'unchanged',
        value: isChanged ? [before[key], after[key]] : before[key],
      };

      return diffNode;
    }
    if (before[key] !== after[key]) {
      const diffNode = {
        key,
        state: 'changed',
        value: [before[key], after[key]],
      };

      return diffNode;
    }

    const diffNode = {
      key,
      state: 'unchanged',
      value: before[key],
    };

    return diffNode;
  });
};

export default createDiffTree;
