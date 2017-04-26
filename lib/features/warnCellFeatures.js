var gdal = require('gdal');
var path = require('path');
var fs = require('fs');
var request = require('request-promise');

function retrieveById(warnCellId, callback) {
  if (fs.existsSync('./cache/'+warnCellId+'.json')) {
    var geom = gdal.open('./cache/'+warnCellId+'.json');
    callback(geom);
    return;
  }

  request('http://ows.dev.52north.org:8080/dwd-harvester-webapp/api/v1/geometries/'+warnCellId).then(function(data) {
    fs.writeFileSync('./cache/'+warnCellId+'.json', data);
    var geom = gdal.open('./cache/'+warnCellId+'.json');
    callback(geom);
    console.info('storing GeoJSON in cache: '+warnCellId+'.json');
  }).catch(function (err) {
    console.warn('Could not retrieve geom: '+ (err.error || 'n/a'));
    callback(null);
  });
}

// function extentValidation(getCapabilities, )

module.exports = {
  retrieveById: retrieveById
}
