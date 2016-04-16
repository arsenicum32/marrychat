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

function render(){

}

var stringi = '';

function renderLine(data){
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
var go = false;
var me = {
  start: function(e) {
    go = 1;
    stringi +='m'+e.clientX+','+e.clientY;
  },
  move: function(e) {
    if (go) {
      stringi +='l'+e.clientX+','+e.clientY;
      renderLine({d: stringi});
    }
  },
  end: function(e) {
    go = 0;
  }
}
window.addEventListener('mousedown', me.start, false);
window.addEventListener('mousemove', me.move, false);
window.addEventListener('mouseup', me.end, false);
