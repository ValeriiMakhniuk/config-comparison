import yaml from 'js-yaml';

const getParser = (extName) => {
  switch (extName) {
    case '.yml':
      return yaml.safeLoad;
    case '.json':
      return JSON.parse;
    default:
      throw new Error('bad extension name');
  }
};

export default getParser;
