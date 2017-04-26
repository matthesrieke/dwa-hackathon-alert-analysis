var util = require('util');
const WebSocket = require('ws');

const wss = new WebSocket.Server({
  perMessageDeflate: true,
  port: 8090
});

var connection;

wss.on('connection', function connection(ws) {
  connection = ws;
});

var deliver = function(warningObject) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      // console.log("sending message to client: %s", util.inspect(client._socket.server._connectionKey, {showHidden: false, depth: 1}));
      console.log("sending message to client: %s", client._socket.server._connectionKey);
      client.send(JSON.stringify(warningObject));
    }
  });
}

module.exports = {
  deliver: deliver
}
