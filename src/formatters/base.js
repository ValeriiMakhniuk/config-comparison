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
    .map((key) => (
      '{\n'
      + `${currentIndent}${INDENT_TYPE} ${key}: ${stringify(value[key], depth + 1)}`
      + '\n'
      + `${closeBracketIndent}}`
    ))
    .join('\n');
};

const formatNode = (node) => {
  const {
    key, value, state, level,
  } = node;

  const currentIndent = INDENT_TYPE.repeat(level * INDENT_SIZE + BASIC_INDENT_SIZE);

  switch (state) {
    case 'added':
      return `${currentIndent}${marks.added} ${key}: ${stringify(value, level + 1)}`;
    case 'removed':
      return `${currentIndent}${marks.removed} ${key}: ${stringify(value, level + 1)}`;
    case 'changed':
      return (
        `${currentIndent}${marks.removed} ${key}: ${stringify(value[0], level + 1)}\n`
        + `${currentIndent}${marks.added} ${key}: ${stringify(value[1], level + 1)}`
      );
    case 'nested':
      return (
        `${currentIndent}${INDENT_TYPE} ${key}: {\n`
        + `${node.value.map((childNode) => formatNode(childNode)).join('\n')}`
        + '\n'
        + `${currentIndent} ${INDENT_TYPE}}`
      );
    case 'unchanged':
      return `${currentIndent}${marks.unchanged} ${key}: ${stringify(value, level + 1)}`;
    default:
      return '';
  }
};

const formatDiff = (rawDiff) => {
  let result = '{\n';
  result += rawDiff.map((node) => formatNode(node)).join('\n');
  result += '\n}';

  return result;
};

export default formatDiff;
