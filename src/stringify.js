const INDENT_SIZE = 1;
const INDENT_STYLE = '';

const formatDiffElement = (element) => {
  const mark = element[0];
  const [key, val] = Object.entries(element[1])[0];

  return `${INDENT_STYLE.repeat(INDENT_SIZE)} ${mark} ${key}: ${val}`;
};

export default function stringify(rawDiff) {
  return `{\n${rawDiff.map(formatDiffElement).join('\n')}\n}`;
}
