var gdal = require('gdal');
var path = require('path');
var fs = require('fs');
var analysis = require("./lib/analysis/geojson.js");
var warnings = require("./lib/warning-dao/localFile.js");
var features = require("./lib/features/warnCellFeatures.js");

var testPointsFile = './data/areas.json';
var testPoints = gdal.open(testPointsFile);

warnings.loadNewWarnings(function(resultList) {
  console.info('Warning count: '+resultList.length);

  var warningGeoJson = [];
  resultList.forEach(function (w) {
    if (!w.event || w.event.toLowerCase().indexOf('regen') === -1) {
      console.info('No rain event: '+w.event);
      return;
    }

    var cell = features.retrieveById(w.cell);

    if (!cell) {
      console.info('Could not retrieve cell geometry');
      return;
    }

    var result = analysis.intersect(cell, testPoints);
    if (result) {
      result.properties = w;
      console.info(JSON.stringify(result, null, 4));
    }
    else {
      console.info('no result');
    }

  });
});
