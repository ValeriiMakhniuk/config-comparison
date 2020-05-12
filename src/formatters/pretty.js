import isPlainObject from 'lodash/isPlainObject';

const INDENT_TYPE = ' ';
const INDENT_SIZE = 4;
const BASIC_INDENT_SIZE = 2;
const marks = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const stringify = (value, depth) => {
  if (!isPlainObject(value)) {
    return Array.isArray(value) ? `[${value}]` : value;
  }

  const currentIndent = INDENT_TYPE.repeat(depth * INDENT_SIZE + BASIC_INDENT_SIZE);
  const closeBracketIndent = INDENT_TYPE.repeat(depth * INDENT_SIZE);

  return Object
    .keys(value)
    .map((key) => ([
      '{',
      `${currentIndent}${INDENT_TYPE} ${key}: ${stringify(value[key], depth + 1)}`,
      `${closeBracketIndent}}`,
    ].join('\n')))
    .join('\n');
};

const formatDiff = (rawDiff, startDepth) => {
  const formatNode = (node, depth) => {
    const {
      key, value, state,
    } = node;

    const currentIndent = INDENT_TYPE.repeat(depth * INDENT_SIZE + BASIC_INDENT_SIZE);

    switch (state) {
      case 'added':
        return `${currentIndent}${marks.added} ${key}: ${stringify(value, depth + 1)}`;
      case 'removed':
        return `${currentIndent}${marks.removed} ${key}: ${stringify(value, depth + 1)}`;
      case 'changed':
        return ([
          `${currentIndent}${marks.removed} ${key}: ${stringify(value.before, depth + 1)}`,
          `${currentIndent}${marks.added} ${key}: ${stringify(value.after, depth + 1)}`,
        ].join('\n'));
      case 'nested': return `${currentIndent}${INDENT_TYPE} ${key}: ${formatDiff(node.children, depth + 1)}`;
      case 'unchanged':
        return `${currentIndent}${marks.unchanged} ${key}: ${stringify(value, depth + 1)}`;
      default:
        throw new Error(`Unknown state: ${state}`);
    }
  };

  return [
    '{',
    `${rawDiff.map((node) => formatNode(node, startDepth)).join('\n')}`,
    `${INDENT_TYPE.repeat(startDepth * INDENT_SIZE)}}`,
  ].join('\n');
};

export default (rawDiff) => formatDiff(rawDiff, 0);
