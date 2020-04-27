import { join } from 'path';
import { readFileSync } from 'fs';

import genDiff from '../src/gendiff';

const getFixturePath = (filename) => join(__dirname, '/fixtures', filename);

const formats = ['yml', 'json', 'ini'];

const testCases = formats.map((format) => {
  const pathBefore = getFixturePath(`before.${format}`);
  const pathAfter = getFixturePath(`after.${format}`);

  return [pathBefore, pathAfter];
});

describe('Gendiff tests', () => {
  const expectedJSON = readFileSync(getFixturePath('diff.json'), 'utf-8');
  const expectedPlain = readFileSync(getFixturePath('diff.plain'), 'utf-8');
  const expectedBase = readFileSync(getFixturePath('diff.base'), 'utf-8');

  test.each(testCases)('%p without format param', (beforePath, afterPath) => {
    expect(genDiff(beforePath, afterPath)).toEqual(expectedBase);
  });

  test.each(testCases)('%p base format', (beforePath, afterPath) => {
    expect(genDiff(beforePath, afterPath, 'base')).toEqual(expectedBase);
  });

  test.each(testCases)('%p plain format', (beforePath, afterPath) => {
    expect(genDiff(beforePath, afterPath, 'plain')).toEqual(expectedPlain);
  });

  test.each(testCases)('%p JSON format', (beforePath, afterPath) => {
    expect(genDiff(beforePath, afterPath, 'json')).toEqual(expectedJSON);
  });
});
