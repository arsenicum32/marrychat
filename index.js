var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname  + '/'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.of('/chat').on('connection', function(socket){
  socket.on('draw', function(msg){
    socket.broadcast.emit('draw', msg);
  });
  socket.on('color', function(msg){
    socket.broadcast.emit('color', msg);
  });
});

http.listen(12000, function(){
  console.log('listening on *:3000');
});
