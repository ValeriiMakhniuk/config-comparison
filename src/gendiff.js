import { hasIn } from 'lodash';
import stringify from './stringify';

const fs = require('fs');
const path = require('path');

const marks = {
  CHANGED: '+',
  REMOVED: '-',
  UNCHANGED: ' ',
};


const createDiff = (before, after) => {
  const uniqKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return Array.from(uniqKeys).reduce((acc, key) => {
    if (!hasIn(before, key)) {
      return [...acc, [marks.CHANGED, { [key]: after[key] }]];
    }
    if (!hasIn(after, key)) {
      return [...acc, [marks.REMOVED, { [key]: before[key] }]];
    }
    if (before[key] !== after[key]) {
      return [
        ...acc, [marks.CHANGED, { [key]: after[key] }], [marks.REMOVED, { [key]: before[key] }],
      ];
    }
    return [...acc, [marks.UNCHANGED, { [key]: before[key] }]];
  }, []);
};

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
