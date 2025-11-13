const Fragment = require('../../src/model/fragment');
const data = require('../../src/model/data');

describe('Fragment.byUser missing branch coverage', () => {
  afterEach(() => jest.restoreAllMocks());

  test('prefers readFragmentList when available', async () => {
    data.readFragmentList = jest.fn().mockResolvedValue(['f1']);
    data.listFragments = jest.fn();
    data.list = jest.fn();

    const result = await Fragment.byUser('u1');
    expect(result).toEqual(['f1']);
    expect(data.readFragmentList).toHaveBeenCalled();
  });

  test('throws when all data functions missing', async () => {
    delete data.readFragmentList;
    delete data.listFragments;
    delete data.list;

    await expect(Fragment.byUser('u1')).rejects.toThrow(
      'No list function available'
    );
  });
});
