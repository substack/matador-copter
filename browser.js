var shoe = require('shoe');
var emitStream = require('emit-stream');
var MuxDemux = require('mux-demux');
var dnode = require('dnode');

var img = document.querySelector('#viewer');
var crosshairs = document.querySelector('#crosshairs');
var control = require('./browser/control');

var mdm = MuxDemux();
mdm.on('connection', function (c) {
    if (c.meta === 'emit') {
        var emitter = emitStream(c);
        
        emitter.on('image', function (data) {
            img.setAttribute('src', 'data:image/png;base64,' + data);
        });
        
        emitter.on('red', function () {
            crosshairs.className = 'active';
            setTimeout(function () {
                crosshairs.className = '';
            }, 500);
        });
    }
    else if (c.meta === 'dnode') {
        var d = dnode();
        d.on('remote', control);
        c.pipe(d).pipe(c);
    }
});
mdm.pipe(shoe('/sock')).pipe(mdm);
