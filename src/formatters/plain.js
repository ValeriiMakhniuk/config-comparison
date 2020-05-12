import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';
import flattenDeep from 'lodash/flattenDeep';

const stringify = (value) => {
  if (Array.isArray(value)) return `[${value}]`;
  if (isPlainObject(value)) return '[complex value]';
  if (isString(value)) return `'${value}'`;

  return value;
};
const formatNode = (node, path) => {
  const {
    key, value, state,
  } = node;

  const currentPath = path ? `${path}.${key}` : key;

  switch (state) {
    case 'added':
      return `Property '${currentPath}' was added with value: ${stringify(value)}`;
    case 'removed':
      return `Property '${currentPath}' was deleted`;
    case 'changed':
      return `Property '${currentPath}' was changed from ${stringify(value.before)} to ${stringify(value.after)}`;
    case 'nested':
      return node.children.map((childNode) => formatNode(childNode, key));
    case 'unchanged':
    default:
      return '';
  }
};

const formatDiff = (rawDiff) => {
  const result = rawDiff.map((node) => formatNode(node, ''));
  return flattenDeep(result)
    .filter((line) => line !== '')
    .join('\n');
};

export default formatDiff;
