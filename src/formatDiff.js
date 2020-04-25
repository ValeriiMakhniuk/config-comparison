import isPlainObject from 'lodash/isPlainObject';
import chalk from 'chalk';

const INDENT_SIZE = 1;
const INDENT_TYPE = '  ';
const marks = {
  added: '+',
  removed: '-',
  unchanged: ' ',
};

const stringify = (value, depth) => {
  if (!isPlainObject(value)) {
    return Array.isArray(value) ? `[${value}]` : value;
  }

  return Object
    .keys(value)
    .map((key) => (
      '{\n'
      + `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${marks.unchanged} ${key}: ${stringify(value[key], depth + 2)}`
      + '\n'
      + `${INDENT_TYPE.repeat(INDENT_SIZE * depth - 2)}${marks.unchanged} }`
    ))
    .join('\n');
};

const formatNode = (node, depth) => {
  const {
    key, value, before = '', after = '',
  } = node;

  switch (node.state) {
    case 'added':
      return `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${chalk.green(`${marks.added} ${key}: ${stringify(value, depth + 2)}`)}`;
    case 'removed':
      return `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${chalk.red(`${marks.removed} ${key}: ${stringify(value, depth + 2)}`)}`;
    case 'changed':
      return (
        `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${chalk.redBright(`${marks.removed} ${key}: ${stringify(before, depth + 2)}`)}\n`
        + `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${chalk.greenBright(`${marks.added} ${key}: ${stringify(after, depth + 2)}`)}`
      );
    case 'nested':
      return (
        `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${marks.unchanged} ${key}: {\n`
        + `${node.children.map((childNode) => formatNode(childNode, depth + 2)).join('\n')}`
        + '\n'
        + `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${marks.unchanged} }`
      );
    case 'unchanged':
      return `${INDENT_TYPE.repeat(INDENT_SIZE * depth)}${marks.unchanged} ${key}: ${stringify(value, depth + 2)}`;
    default:
      return '';
  }
};

const formatDiff = (rawDiff) => {
  let result = '{\n';
  result += rawDiff.map((node) => formatNode(node, 1)).join('\n');
  result += '\n}';

  return result;
};

export default formatDiff;
