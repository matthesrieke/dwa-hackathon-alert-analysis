var fs = require('fs');
var uuid = require('uuid/v1');

//read cached warnings
// var cachedWarnings = require('../cache/warnings-cache.json');
var cachedWarnings = {};

function loadNewWarnings(callback) {
  fs.readFile('./data/warnings.json', function(err, data) {
    if (err) {
      console.warn(err);
      return;
    }

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

  });
}

module.exports = {
  loadNewWarnings: loadNewWarnings
}
