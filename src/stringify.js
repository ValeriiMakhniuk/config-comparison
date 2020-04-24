const INDENT_SIZE = 1;
const INDENT_TYPE = ' ';

const formatDiffElement = (element) => {
  const mark = element[0];
  const fieldObject = element[1];
  const [key, val] = Object.entries(fieldObject)[0];
  return `${INDENT_TYPE.repeat(INDENT_SIZE)} ${mark} ${key}: ${val}`;
};

export default function stringify(rawDiff) {
  return `{\n${rawDiff.map(formatDiffElement).join('\n')}\n}`;
}
