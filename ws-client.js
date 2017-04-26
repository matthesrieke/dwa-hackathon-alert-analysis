const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8090', {
  perMessageDeflate: true
});

ws.on('message', function incoming(data, flags) {
  console.info(JSON.stringify(JSON.parse(data), null, 4));
});

// var turf = require('@turf/combine');
// var fs = require('fs');
//
// var points = JSON.parse(fs.readFileSync('./data/randompoints/test.json'));
//
// console.info(JSON.stringify(turf(points), null, 4));
