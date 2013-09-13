
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , uuid = require('uuid')
  , exec = require("child_process").exec;

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

app.get('/', routes.index);

var server = require('http').createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, { log: false })

io.sockets.on("connection", function(socket) {
    var createContainer = "sudo docker run -t node-sci"
    exec(createContainer, function(err, stdout, stderr) {
        socket.id = stdout;
        console.log("the guys id is: " + socket.id);
    });    
    
    socket.on("hello", function(data) {
        console.log(data);
    });
    socket.on("disconnect", function() {
        var killContainer = "sudo docker kill " + socket.id;
        exec(killContainer, function(err, stdout, stderr) {
            if (err) {
                console.log("error killing container for: " + socket.id);
            } else {
                console.log(socket.id + " has left the building!");
            }
        });
    });
});

