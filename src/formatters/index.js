import pretty from './pretty';
import plain from './plain';
import json from './json';

const getFormat = (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'json':
      return json;
    case 'pretty':
    default:
      return pretty;
  }
};

export default getFormat;
