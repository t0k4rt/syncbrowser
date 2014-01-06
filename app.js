var express = require("express");
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3000);

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