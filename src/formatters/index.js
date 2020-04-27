import base from './base';
import plain from './plain';
import json from './json';

const getFormat = (format) => {
  switch (format) {
    case 'plain':
      return plain;
    case 'json':
      return json;
    case 'base':
    default:
      return base;
  }
};

export default getFormat;
