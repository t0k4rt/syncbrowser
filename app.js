var port = process.env.PORT || 3000;

var express = require("express");
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(port);

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    socket.on('event', function (data) {
        data.id = socket.id;
        console.log(data);
        socket.broadcast.emit('event', data);
    });

    socket.on('signaling', function (data) {
        console.log(data);
        socket.broadcast.emit('signaling', data);
    });
});