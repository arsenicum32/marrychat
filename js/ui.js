var PICKER = 'black';
var FPICKER = 'black';
var CALLBACK = function(data){
  socket.emit('color', data.color);
};

(function () {
    var can, left, makec, svg, top;
    makec = function (x, y, w, h) {
        var hue, sat;
        hue = Math.floor(Math.max(0, x) / w * 360);
        sat = Math.floor(Math.max(0, y) / h * 100);
        if (sat < 50) {
            sat = 100 - sat;
        }
        return 'hsl(' + hue + ', 50%, ' + sat + '%)';
    };
    svg = d3.select('body').append('svg').attr({
        width: 100,
        height: 100,
        fill: 'red'
    });
    svg.append('circle').attr({
        cx: 50,
        cy: 50,
        r: 46,
        fill: 'black',
        stroke: '#eee',
        'stroke-width': 4
    }).on('mousemove', function () {
        var c, obj;
        obj = d3.select(this);
        c = d3.mouse(this);
        obj.attr('fill', makec(c[0], c[1], 100, 100));
        PICKER = makec(c[0], c[1], 100, 100);
        CALLBACK({color: makec(c[0], c[1], 100, 100)});
    });
    left = 0;
    top = 0;
    can = 1;
    $(window).on('mousemove', function (e) {
        if (can) {
            left = e.clientX;
            return top = e.clientY;
        }
    });
    $('body').on('keydown', function (e) {
        can = 0;
        if (e.keyCode === 32) {
            $('svg').show();
            $('svg').css('left', left - 50 + 'px');
            return $('svg').css('top', top - 50 + 'px');
        }
    });
    $('body').on('keyup', function (e) {
        $('svg').hide();
        return can = 1;
    });
}.call(this));
