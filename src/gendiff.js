import createDiff from './createDiff';
import getParser from './parsers';
import getFormat from './formatters';

const fs = require('fs');
const path = require('path');

const START_DEPTH_LEVEL = 0;

export default function genDiff(pathToFile1, pathToFile2, format) {
  const fullPathToFile1 = path.resolve(process.cwd(), pathToFile1);
  const fullPathToFile2 = path.resolve(process.cwd(), pathToFile2);
  const extNameFile1 = path.extname(fullPathToFile1);
  const extNameFile2 = path.extname(fullPathToFile2);
  const File1Data = fs.readFileSync(fullPathToFile1, 'utf-8');
  const File2Data = fs.readFileSync(fullPathToFile2, 'utf-8');
  const File1ParsedData = getParser(extNameFile1)(File1Data);
  const File2ParsedData = getParser(extNameFile2)(File2Data);
  const rawDiff = createDiff(File1ParsedData, File2ParsedData, START_DEPTH_LEVEL);
  return getFormat(format)(rawDiff);
}
