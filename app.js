/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , uuid = require('uuid')
  , WebSocket = require('ws')
  , exec = require("child_process").exec;

require("shellscript").globalize();
$("sudo docker kill `sudo docker ps | awk '{print $1}'`")

var port = 80;

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

app.get('/test', function(req, res) {
    res.render("test");
});

var server = require('http').createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, { log: false });

io.sockets.on("connection", function(socket) {
  socket.on("setupenv", function(data) {
    
    if (socket.containerid!=undefined) {
      $("sudo docker kill " + socket.containerid);
    }

    var startShell = "sudo docker run -p 3000 -d -t glamp/shellington shellington " + data.lang;
    var cid = $(startShell).trim();
    var containerIP = $("sudo docker port " + cid + " 3000").trim();
    socket.containerid = cid;
    socket.containerIP = containerIP;

    // wait until the app is up
    var isup = path.join(__dirname, "system", "is-up");
    isup = isup + " " + containerIP;
    exec(isup, function(err, stdout, stderr) {
      // open the socket connection
      socket.ws = new WebSocket("ws://" + containerIP);
      socket.ws.on('open', function() {
        console.log("socket connection to " + containerIP + " is open");
      });
      socket.ws.on('message', function(message) {
        socket.emit("result", message);
      });
      socket.emit('ready', { id: socket.containerid, status: "provisioned", lang: data.lang }) ;
      console.log("container started: id=" + cid.slice(0, 7) +"; ip: " + containerIP);
    });
  });
  
  socket.on("code", function(data) {
    var payload = JSON.stringify(data);
    if (socket.ws.OPEN) {
      socket.ws.send(payload);
    } else {
      console.log("socket is closed");
    }
  });
  socket.on("disconnect", function() {
    if (socket.ws != undefined) {
      socket.ws.close();
      socket.ws = null;
    }
    var killContainer = "sudo docker kill " + socket.containerid;
    console.log("--->" + killContainer);
    exec(killContainer, function(err, stdout, stderr) {
      if (err) {
        console.log("error killing container for: " + socket.containerid);
      } else {
        console.log(socket.containerid + " has left the building!");
      }
    });
  });
});

