var WebSocket = require('ws');

export.modules = function(ip) {
  var ws = new WebSocket('ws://' + ip);
  ws.on('open', function() {
        ws.send('something');
  });
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });
};

