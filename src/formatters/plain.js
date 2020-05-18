import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import flattenDeep from 'lodash/flattenDeep';
import compact from 'lodash/compact';

const stringify = (value) => {
  if (Array.isArray(value)) return `[${value}]`;
  if (isPlainObject(value)) return '[complex value]';
  if (isString(value)) return `'${value}'`;

  return value;
};

const formatDiff = (rawDiff, path) => {
  const formatNode = (node) => {
    const { key, value, state } = node;

    const currentPath = path ? `${path}.${key}` : key;

    switch (state) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${stringify(
          value,
        )}`;
      case 'removed':
        return `Property '${currentPath}' was deleted`;
      case 'changed':
        return `Property '${currentPath}' was changed from ${stringify(
          value.before,
        )} to ${stringify(value.after)}`;
      case 'nested':
        return formatDiff(node.children, currentPath);
      case 'unchanged':
        return null;
      default:
        throw new Error(`Unknown state: ${state}`);
    }
  };
  const result = rawDiff.map(formatNode);
  return compact(flattenDeep(result)).join('\n');
};

export default (rawDiff) => formatDiff(rawDiff, '');
