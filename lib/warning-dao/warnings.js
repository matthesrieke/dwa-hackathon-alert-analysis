var fs = require('fs');
var request = require('request-promise');
var uuid = require('uuid/v1');

//read cached warnings
// var cachedWarnings = require('../cache/warnings-cache.json');
var cachedWarnings = {};

function loadNewWarnings(callback) {
  request('http://dwd.de/DWD/warnungen/warnapp/json/warnings.json').then(function(jsonp) {
    var data = jsonp.substring('warnWetter.loadWarnings('.length, jsonp.length-2);

    var json = JSON.parse(data);
    var newWarnings = [];

    Object.keys(json.warnings).forEach(function(cellId) {
      var warningData = json.warnings[cellId];

      warningData.forEach(function(w) {
        if (!cachedWarnings[cellId+'_'+w.start+'_'+w.end+'_'+w.type]) {
          //its not cached, push it
          w.uuid = uuid();
          w.cell = cellId;
          newWarnings.push(w);
          cachedWarnings[cellId+'_'+w.start+'_'+w.end+'_'+w.type] = true;
        }
      });

    });

    //call the callback function
    callback(newWarnings);

    if (newWarnings.length > 0) {
      //update cache
      fs.writeFile('./cache/warnings-cache.json', JSON.stringify(cachedWarnings));
    }

  })
  .catch(function(err) {
    console.warn('could not retrieve warnings from DWD: '+err);
  });
}

module.exports = {
  loadNewWarnings: loadNewWarnings
}
