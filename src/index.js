import { resolve, extname } from 'path';
import { readFileSync } from 'fs';

import createDiffTree from './createDiffTree';
import getParser from './parsers';
import getFormat from './formatters';


const START_DEPTH_LEVEL = 0;

export default function genDiff(pathToFile1, pathToFile2, format) {
  const fullPathToFile1 = resolve(process.cwd(), pathToFile1);
  const fullPathToFile2 = resolve(process.cwd(), pathToFile2);
  const extNameFile1 = extname(fullPathToFile1).slice(1);
  const extNameFile2 = extname(fullPathToFile2).slice(1);
  const File1Data = readFileSync(fullPathToFile1, 'utf-8');
  const File2Data = readFileSync(fullPathToFile2, 'utf-8');
  const File1ParsedData = getParser(extNameFile1)(File1Data);
  const File2ParsedData = getParser(extNameFile2)(File2Data);
  const diffTree = createDiffTree(File1ParsedData, File2ParsedData, START_DEPTH_LEVEL);
  return getFormat(format)(diffTree);
}
