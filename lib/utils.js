
function noDotFiles(x) {
    return x[0] !== '.' && x.split('.')[x.split('.').length - 1] === 'json';
}



function jsonExtension(x) {
  return x.split('.')[split('.').length - 1] === 'json';
}

module.exports = {
  noDotFiles: noDotFiles,
  jsonExtension: jsonExtension
};



