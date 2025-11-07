// tests/unit/fragment.branch.final.test.js
const Fragment = require('../../src/model/fragment');
const data = require('../../src/model/data');

describe('Fragment final branch coverage', () => {
  test('isSupportedType handles uppercase and extra spaces', () => {
    expect(Fragment.isSupportedType(' Text/Plain ')).toBe(true);
    expect(Fragment.isSupportedType('TEXT/PLAIN; charset=utf-8')).toBe(true);
  });

  test('byUser calls different data listing functions correctly', async () => {
    // mock readFragmentList path
    data.readFragmentList = jest.fn().mockResolvedValue(['r1']);
    const res1 = await Fragment.byUser('A');
    expect(res1).toEqual(['r1']);

    // mock listFragments path
    delete data.readFragmentList;
    data.listFragments = jest.fn().mockResolvedValue(['r2']);
    const res2 = await Fragment.byUser('B');
    expect(res2).toEqual(['r2']);

    // mock list path
    delete data.listFragments;
    data.list = jest.fn().mockResolvedValue(['r3']);
    const res3 = await Fragment.byUser('C');
    expect(res3).toEqual(['r3']);

    // mock none available → should throw
    delete data.list;
    await expect(Fragment.byUser('D')).rejects.toThrow('No list function available');
  });
});
