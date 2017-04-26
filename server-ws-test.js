var path = require('path');
var fs = require('fs');
var delivery = require("./lib/delivery/websockets.js");
var sampleData = require('./example-websocket-output.json');

setInterval(function() {
  delivery.deliver(sampleData);
}, 2000);
