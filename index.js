var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var clientapp = express();

mongoose.connect('mongodb://admin:pass@ds013221.mlab.com:13221/pchat',function(err) {
    if (err) {
      console.log('error connect');
    }
});

//.Server(app).listen(12000, function(){
//  console.log('start socket server');
//})
var io = require('socket.io')(http.Server(express()).listen(12000, function(){
  console.log('start socket server');
}), { serveClient: false });

mongoose.connection.once('open', function() {
  console.log('very nice!!!');
});

var draw = new mongoose.Schema({
  owner: 'string',
  items: [],
  lastopen: { type: Date, default: Date.now }
});

var draws = mongoose.model('tasks', draw );

//var io = require('socket.io')(http);

clientapp.use(express.static(__dirname  + '/static'));

clientapp.get('/:id', function(req, res, next){
  draws.findById( req.params.id  , function (err, adventure) {
    if(err){
      res.json({error:"somthing went wrong!!!"});
    }else{
      if(adventure){
        res.sendFile(__dirname + '/index.html');
      }else{
      	res.json({error: "not found"});
      }
    }
  });
});

clientapp.get('/', function(req, res, next){
  draws.create( {owner: 'test' , items: []} , function (err, adventure) {
    if(err){
      res.json({error:"somthing went wrong!!!"});
    }else{
      res.redirect('/'+adventure._id);
      console.log('new connect: '+ adventure._id);
    }
  });
});

////////// system ajax (don't breake socket)

clientapp.get('/admin/clear', function(req,res,next){
  draws.remove( {items: []} , function (err, adventure) {
    if(err){
      res.json({error:"somthing went wrong!!!"});
    }else{
      if(adventure){
        res.json({sucsess: 'clear'});
      }else{
      	res.json('null');
      }
    }
  });
});

clientapp.get('/admin/all', function(req, res, next){
  draws.find({}, function(err, data){
    if(err){
      res.json({err:"sww"});
    }else{
      res.json(data);
    }
  });
});

clientapp.get('/admin/admin', function(req, res, next){
  res.sendFile(__dirname + '/admin.html');
});

clientapp.get('/data/:id', function(req,res,next){
  draws.findById( req.params.id  , function (err, adventure) {
    if(err){
      res.json({error: "sww"});
    }else{
      if(adventure){
        console.log(JSON.stringify(adventure.items));
        res.json(adventure);
      }else{
      	res.json({error: "404"});
      }
    }
  });
});
////////////////////////////////////////////

clientapp.listen(12010, function () {
  console.log('Example app listening on port 3000!');
});


io.of('/chat').on('connection', function(socket){
  ///////// sys func //////////
  socket.on('client', function(msg){
    //socket.emit('log', getItems(msg));
    upTime(msg);
  });
  socket.on('drawend', function(msg){
    updateItems(msg);
  });
  /////////////////////////////
  socket.on('draw', function(msg){
    socket.broadcast.emit('draw', msg);
  });
  socket.on('color', function(msg){
    socket.broadcast.emit('color', msg);
  });
});

///////// monggose finc

function getItems(id){
  draws.findById( id  , function (err, adventure) {
    if(err){
      return 'error';
    }else{
      if(adventure){
        return adventure.items;
      }else{
      	return 'not found';
      }
    }
  });
}

function updateItems(data){
  draws.findById( data.draw  , function (err, adventure) {
    if(err){
      return false;
    }else{
      if(adventure){
        var findata = data;
        delete findata.draw;
        adventure.items.push(findata);
        adventure.save();
        return adventure;
      }else{
        return false;
      }
    }
  });
}

function upTime(id){
  draws.findById( id  , function (err, adventure) {
    if(err){
      return false;
    }else{
      if(adventure){
        adventure.lastopen = (new Date()).getTime();
        adventure.save();
        return adventure;
      }else{
        return false;
      }
    }
  });
}
