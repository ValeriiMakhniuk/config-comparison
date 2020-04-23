import createDiff from './createDiff';
import stringify from './stringify';

const fs = require('fs');
const path = require('path');

export default function genDiff(pathToFile1, pathToFile2) {
  const actualPathToFirstFile = path.resolve(process.cwd(), pathToFile1);
  const actualPathToSecondFile = path.resolve(process.cwd(), pathToFile2);
  const firstFileData = fs.readFileSync(actualPathToFirstFile, 'utf-8');
  const secondFileData = fs.readFileSync(actualPathToSecondFile, 'utf-8');
  const firstJSON = JSON.parse(firstFileData);
  const secondJSON = JSON.parse(secondFileData);
  const rawDiff = createDiff(firstJSON, secondJSON);
  return stringify(rawDiff);
}
