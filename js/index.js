var socket = io.connect('http://localhost:3000/chat');
var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  context = canvas.getContext('2d');
window.addEventListener('resize', renderpage, false);
window.onload = renderpage;


function renderpage() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
}

socket.on('load', function(msg){
  renderLine(msg);
})

function render(){
  renderLine(dataob);
  renderLine(friendobj);
}

var stringi = '';
var stringifr = '';

var friendobj = [];
var friendobjindex = -1;
socket.on('draw', function(msg){
  console.log(msg);
  stringifr +=msg;
  if(msg.indexOf('m')!=-1){
    friendobjindex++;
    friendobj[friendobjindex] = {d: msg, color: FPICKER};
  }else{
    friendobj[friendobjindex].d+=msg;
  }
  renderLine(friendobj);
});
socket.on('color', function(msg){
  FPICKER = msg;
  // friendobj[friendobjindex].color = FPICKER;
  // renderLine(friendobj);
});

function renderLine(dat){
  for(var a in dat){
    var data = dat[a];
    ctx.lineWidth = data.s || 2;
    ctx.strokeStyle = data.color || '#000000';
    var el = data.d.split('m');
    for(var n in el){
      var cur = el[n].split('l');
      ctx.beginPath();
      ctx.moveTo(cur[0].split(',')[0], cur[0].split(',')[1] );
      for(var i in cur){
        ctx.lineTo(cur[i].split(',')[0], cur[i].split(',')[1]);
      }
      ctx.stroke();
    }
  }
}
var go = false;
var indexd = -1;
var dataob = [];
var tempstring = '';
var me = {
  start: function(e) {
    go = 1;
    indexd++;
    stringi +='m'+e.clientX+','+e.clientY;
    tempstring+='m'+e.clientX+','+e.clientY;
    socket.emit('draw', 'm'+e.clientX+','+e.clientY );
  },
  move: function(e) {
    if (go) {
      stringi +='l'+e.clientX+','+e.clientY;
      tempstring+='l'+e.clientX+','+e.clientY;
      dataob[indexd] = {d: tempstring, color: PICKER};
      socket.emit('draw', 'l'+e.clientX+','+e.clientY );
      //context.clearRect(0, 0,  canvas.width, canvas.height);
      renderLine(dataob); // {d: stringi, color: PICKER}
    }
  },
  end: function(e) {
    go = 0;
    tempstring = '';
  }
}
window.addEventListener('mousedown', me.start, false);
window.addEventListener('mousemove', me.move, false);
window.addEventListener('mouseup', me.end, false);
