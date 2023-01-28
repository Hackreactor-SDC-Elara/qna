let formatPhotos = (answerId, arr) => {
  return arr.map((val) => {
    return `(${answerId}, '${val}')`;
  }).join(', ');
}

module.exports = {
  formatPhotos: formatPhotos
}