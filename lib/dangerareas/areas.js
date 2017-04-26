var config = require('../../configuration.json');
var gdal = require('gdal');
var fs = require('fs');
var request = require('request-promise');
var turf = require('@turf/combine');

var retrieveGeometries = function(callback) {
  if (fs.existsSync('./cache/areas.json')) {
    var geom = gdal.open('./cache/areas.json');
    callback(geom);
    return;
  }

  request('http://'+config.geoserverHostPort+'/geoserver/dwa-hackathon/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dwa-hackathon:danger_areas&maxFeatures=500&outputFormat=application%2Fjson').then(function(data) {
    fs.writeFileSync('./cache/areas.json', JSON.stringify(turf(JSON.parse(data))));
    var geom = gdal.open('./cache/areas.json');
    callback(geom);
    console.info('storing GeoJSON in cache: areas.json');
  }).catch(function (err) {
    console.warn('Could not retrieve geom: '+ (err.error || 'n/a'));
    callback(null);
  });
}

module.exports = {
  retrieveGeometries: retrieveGeometries
}
