import createDiff from '../src/createDiff';

test('should return empty array if both objects empty', () => {
  const before = {};
  const after = {};
  expect(createDiff(before, after)).toEqual([]);
});

test('should return old and new field if the field value is changed', () => {
  const before = {
    key1: 1,
  };
  const after = {
    key1: 2,
  };
  const expected = [
    ['+', { key1: 2 }],
    ['-', { key1: 1 }],
  ];
  expect(createDiff(before, after)).toEqual(expected);
});

test('should return old field with REMOVED mark if the field is removed', () => {
  const before = {
    key1: 1,
  };
  const after = {};
  const expected = [
    ['-', { key1: 1 }],
  ];
  expect(createDiff(before, after)).toEqual(expected);
});

test('should return field with UNCHANGED mark if the field is not changed', () => {
  const before = {
    key1: 1,
  };
  const after = {
    key1: 1,
  };
  const expected = [
    [' ', { key1: 1 }],
  ];
  expect(createDiff(before, after)).toEqual(expected);
});

test('basic functionality', () => {
  const before = {
    key1: 1,
  };
  const after = {
    key2: 1,
    key3: 1,
  };
  const expected = [
    ['-', { key1: 1 }],
    ['+', { key2: 1 }],
    ['+', { key3: 1 }],
  ];
  expect(createDiff(before, after)).toEqual(expected);
});
