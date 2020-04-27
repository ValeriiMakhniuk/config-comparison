import base from './base';
import plain from './plain';

const getFormat = (format) => {
  switch (format) {
    case 'plain':
      return base;
    case 'base':
    default:
      return base;
  }
};

export default getFormat;
