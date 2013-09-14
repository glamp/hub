
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
require("shellscript").globalize();

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

app.get('/', function(req, res) {
    res.render("terminal");
});

var server = require('http').createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, { log: false })

io.sockets.on("connection", function(socket) {
    port += 1;
    socket.port = port;
    var createContainer = "sudo docker run -p " + port + ":3000 -d pythonenv"
    socket.id = $(createContainer);

    socket.emit('ready', { id: socket.id, status: "provisioned" }) ;
    
    console.log(socket.id);
    
    socket.on("code", function(data) {
        console.log(data);
        var payload = JSON.stringify(data);
        var options = {
            host: 'localhost',
            port: socket.port,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };
        var req = http.request(options, function(res) {
            res.setEncoding('utf-8');
            var responseString = '';
             res.on('data', function(data) {
                 responseString += data;
             });
             res.on('end', function() {
                 var result = JSON.parse(responseString);
                 console.log(result);
                 console.log("why is this not emitting?");
                 socket.emit("result", result);
             });
        });
        req.write(payload);
        req.end();
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

