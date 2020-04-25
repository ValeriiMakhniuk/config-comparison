import hasIn from 'lodash/hasIn';
import isPlainObject from 'lodash/isPlainObject';
import union from 'lodash/union';

const createDiff = (before, after) => {
  const uniqKeys = union([...Object.keys(before), ...Object.keys(after)]);
  return uniqKeys.reduce((acc, key) => {
    if (!hasIn(before, key)) {
      const diffNode = {
        key,
        state: 'added',
        value: after[key],
      };

      return [...acc, diffNode];
    }
    if (!hasIn(after, key)) {
      const diffNode = {
        key,
        state: 'removed',
        value: before[key],
      };

      return [...acc, diffNode];
    }
    if (isPlainObject(before[key]) && isPlainObject(after[key])) {
      const diffNode = {
        key,
        state: 'nested',
        value: null,
        children: createDiff(before[key], after[key]),
      };

      return [...acc, diffNode];
    }
    if (Array.isArray(before[key]) && Array.isArray(after[key])) {
      const isChanged = JSON.stringify(before[key]) !== JSON.stringify(after[key]);
      const diffNode = isChanged ? {
        key,
        state: 'changed',
        before: before[key],
        after: after[key],
      } : {
        key,
        state: 'unchanged',
        value: before[key],
      };

      return [...acc, diffNode];
    }
    if (before[key] !== after[key]) {
      const diffNode = {
        key,
        state: 'changed',
        before: before[key],
        after: after[key],
      };

      return [...acc, diffNode];
    }

    const diffNode = {
      key,
      state: 'unchanged',
      value: before[key],
    };

    return [...acc, diffNode];
  }, []);
};

export default createDiff;
