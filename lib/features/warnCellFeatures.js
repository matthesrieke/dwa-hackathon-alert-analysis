var gdal = require('gdal');
var path = require('path');
var fs = require('fs');

function retrieveById(warnCellId) {
  if (fs.existsSync('./cache/'+warnCellId+'.json')) {
    return gdal.open('./cache/'+warnCellId+'.json');
  }

  return null;
}

// function extentValidation(getCapabilities, )

module.exports = {
  retrieveById: retrieveById
}
