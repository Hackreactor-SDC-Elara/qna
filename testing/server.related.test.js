const {formatPhotosArrayServer} = require('../controllers/helperFunctions.js');

describe('Helper functions', () => {
  it('Should be able to conver the string of photos to an array', () => {
    expect(formatPhotosArrayServer("['arr1', 'arr2', 'arr3']")).toEqual(["'arr1'", " 'arr2'", " 'arr3'"]);
    expect(formatPhotosArrayServer("['arr1']")).toEqual(["'arr1'"]);
    expect(formatPhotosArrayServer("[]")).toEqual([]);
  })
})