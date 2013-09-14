
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , Buffer = require('buffer').Buffer
  , path = require('path')
  , uuid = require('uuid')
  , exec = require("child_process").exec;
// require("shellscript").globalize();

var port = 5555;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/chat', function(req, res) {
    res.render("index");
});

app.get('/', function(req, res) {
    res.render("terminal");
});

var server = require('http').createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    port += 1;
    socket.port = port;
    var createContainer = "sudo docker run -p " + port + ":3000 -d pythonenv"
    socket.containerid = uuid.v4();
    socket.emit('ready', { id: socket.id });
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log(data);
    });
});
// io.sockets.on("connection", function(socket) {    
//     socket.on("code", function(data) {
//       console.log(data);
//       socket.emit("result", data);
//     });

//     socket.on("disconnect", function() {
//       console.log(socket.id + " has left the building!");
//     });
// });

