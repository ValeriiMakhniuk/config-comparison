import yaml from 'js-yaml';
import ini from 'ini';

const getParser = (extName) => {
  switch (extName) {
    case 'yml':
      return yaml.safeLoad;
    case 'json':
      return JSON.parse;
    case 'ini':
      return ini.parse;
    default:
      throw new Error(`extension name ${extName} does not support yet`);
  }
};

export default getParser;
