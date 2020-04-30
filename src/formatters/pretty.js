import isPlainObject from 'lodash/isPlainObject';

const INDENT_TYPE = ' ';
const INDENT_SIZE = 4;
const BASIC_INDENT_SIZE = 2;
const START_DEPTH_LEVEL = 0;
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
        `${currentIndent}${marks.removed} ${key}: ${stringify(value[0], depth + 1)}`,
        `${currentIndent}${marks.added} ${key}: ${stringify(value[1], depth + 1)}`,
      ].join('\n'));
    case 'nested':
      return ([
        `${currentIndent}${INDENT_TYPE} ${key}: {`,
        `${node.value.map((childNode) => formatNode(childNode, depth + 1)).join('\n')}`,
        `${currentIndent} ${INDENT_TYPE}}`,
      ].join('\n'));
    case 'unchanged':
      return `${currentIndent}${marks.unchanged} ${key}: ${stringify(value, depth + 1)}`;
    default:
      throw new Error(`Unknown state: ${state}`);
  }
};

const formatDiff = (rawDiff) => `{\n${rawDiff.map((node) => formatNode(node, START_DEPTH_LEVEL)).join('\n')}\n}`;

export default formatDiff;
