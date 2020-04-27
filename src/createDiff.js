import hasIn from 'lodash/hasIn';
import isPlainObject from 'lodash/isPlainObject';
import union from 'lodash/union';

const createDiff = (before, after, level) => {
  const uniqKeys = union([...Object.keys(before), ...Object.keys(after)]);
  return uniqKeys.reduce((acc, key) => {
    if (!hasIn(before, key)) {
      const diffNode = {
        key,
        state: 'added',
        value: after[key],
        level,
      };

      return [...acc, diffNode];
    }
    if (!hasIn(after, key)) {
      const diffNode = {
        key,
        state: 'removed',
        value: before[key],
        level,
      };

      return [...acc, diffNode];
    }
    if (isPlainObject(before[key]) && isPlainObject(after[key])) {
      const diffNode = {
        key,
        state: 'nested',
        value: createDiff(before[key], after[key], level + 1),
        level,
      };

      return [...acc, diffNode];
    }
    if (Array.isArray(before[key]) && Array.isArray(after[key])) {
      const isChanged = JSON.stringify(before[key]) !== JSON.stringify(after[key]);
      const diffNode = {
        key,
        state: isChanged ? 'changed' : 'unchanged',
        value: isChanged ? [before[key], after[key]] : before[key],
        level,
      };

      return [...acc, diffNode];
    }
    if (before[key] !== after[key]) {
      const diffNode = {
        key,
        state: 'changed',
        value: [before[key], after[key]],
        level,
      };

      return [...acc, diffNode];
    }

    const diffNode = {
      key,
      state: 'unchanged',
      value: before[key],
      level,
    };

    return [...acc, diffNode];
  }, []);
};

export default createDiff;
