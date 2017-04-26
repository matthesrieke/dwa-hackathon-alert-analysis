var gdal = require('gdal');
var path = require('path');
var fs = require('fs');
var analysis = require("./lib/analysis/geojson.js");
var warnings = require("./lib/warning-dao/localFile.js");
var features = require("./lib/features/warnCellFeatures.js");
var delivery = require("./lib/delivery/websockets.js");

var testPointsFile = './data/areas.json';
var testPoints = gdal.open(testPointsFile);

/*
* the retrieval function
*/
var retrieveWarningsCyclic = function() {

  warnings.loadNewWarnings(function(resultList) {
    console.info('Warning count: '+resultList.length);

    var warningGeoJson = [];
    var candidateCount = resultList.length;
    resultList.forEach(function (w) {
      if (!w.event || w.event.toLowerCase().indexOf('regen') === -1) {
        console.info('No rain event: '+w.event);
        candidateCount--;
        return;
      }

      features.retrieveById(w.cell, function(cell) {
        candidateCount--;

        if (!cell) {
          console.info('Could not retrieve cell geometry');
          return;
        }
        else {
          console.info('processing geometry...');
        }

        var result = analysis.intersect(cell, testPoints);
        if (result) {
          result.properties = w;
          warningGeoJson.push(result);
        }
        else {
          console.info('no result');
        }

        if (candidateCount === 0 && warningGeoJson.length > 0) {
          //last candidate, push data
          delivery.deliver(warningGeoJson);
        }
      });

    });
  });
}

setInterval(retrieveWarningsCyclic, 30000);
