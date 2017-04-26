var gdal = require('gdal');
var path = require('path');
var fs = require('fs');
var analysis = require("./lib/analysis/geojson.js");
var warnings = require("./lib/warning-dao/warnings.js");
var features = require("./lib/features/warnCellFeatures.js");
var delivery = require("./lib/delivery/websockets.js");
var areasDao = require("./lib/dangerareas/areas.js");

/*
* the retrieval function
*/
var retrieveWarningsCyclic = function() {

  areasDao.retrieveGeometries(function (areas) {
    //we got the areas?
    if (!areas) {
      return;
    }

    warnings.loadNewWarnings(function(resultList) {
      console.info('Warning count: '+resultList.length);

      var warningGeoJson = [];
      var candidateCount = resultList.length;


      /*
      * helper method
      */
      var checkIterationFinished = function(candidateCount, warningGeoJson) {
        if (candidateCount === 0) {
          //last candidate, push data
          if (warningGeoJson.length > 0) {
            console.info('Sending danger area data.');
            delivery.deliver(warningGeoJson);
          }
          else {
            console.info('no danger areas identified...');
          }

          setTimeout(retrieveWarningsCyclic, 30000);
        }
      }

      resultList.forEach(function (w) {
        if (w.cell === '105374000') {
          console.info('OBERGERGISCH!');
        }
        if (!w.event || w.event.toLowerCase().indexOf('regen') === -1) {
          console.info('No rain event: '+w.event);
          candidateCount--;

          checkIterationFinished(candidateCount, warningGeoJson);
          return;
        }

        features.retrieveById(w.cell, function(cell) {
          candidateCount--;

          if (!cell) {
            console.info('Could not retrieve cell geometry');
            console.info('GEOM NOT RETRIEVED: '+candidateCount);
          }
          else {
            console.info('processing geometry...');

            var result = analysis.intersect(cell, areas);
            if (result && (result.geometries && result.geometries.length > 0) || (result.coordinates && result.coordinates.length > 0)) {
              result.properties = w;
              warningGeoJson.push(result);
            }
            else {
              console.info('no intersection result..');
            }
          }

          checkIterationFinished(candidateCount, warningGeoJson);
        });

      });


    });
  });

}

setTimeout(retrieveWarningsCyclic, 30000);
