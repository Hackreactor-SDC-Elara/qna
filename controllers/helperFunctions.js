let formatPhotos = (answerId, arr) => {
  return arr.map((val) => {
    return `(${answerId}, ${val.trim()})`;
  }).join(', ');
}

let formatPhotosArrayServer = (photosString) => {

  photosString = photosString.slice(1, photosString.length - 1);
  let photosArr = photosString.split(',');

  if (photosArr.length === 1 && photosArr[0] === '') {
    photosArr = [];
  }
  return photosArr;
}

module.exports = {
  formatPhotos: formatPhotos,
  formatPhotosArrayServer: formatPhotosArrayServer
}