var drone = require('ar-drone');
var client = drone.createClient();
client.disableEmergency();

var shoe = require('shoe');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter;

var http = require('http');
var ecstatic = require('ecstatic');
var emitStream = require('emit-stream');

var server = http.createServer(ecstatic(__dirname + '/static'));
server.listen(8000);

var MuxDemux = require('mux-demux');
var dnode = require('dnode');
var methods = [
    'after', 'disableEmergency', 'takeoff', 'land', 'stop', 'animate',
    'animateLeds', 'up', 'down', 'left', 'right', 'front', 'back',
    'clockwise', 'counterClockwise',
];

var sock = shoe(function (stream) {
    var mdm = MuxDemux();
    mdm.pipe(stream).pipe(mdm);
    
    var d = dnode(methods.reduce(function (acc, key) {
        acc[key] = client[key].bind(client);
        return methods;
    }, {
        setRedMode : function (x) { redMode = x }
    }));
    d.pipe(mdm.createStream('dnode')).pipe(d);
    
    emitStream(emitter)
        .pipe(mdm.createWriteStream('emit'))
    ;
});
sock.install(server, '/sock');

var flying = false;
var redMode = true;
var speed = 1;

var detect = require('./lib/detect');

var png = client.createPngStream({ log : process.stderr });
png.on('error', function (err) {
    console.error('caught error ' + err);
});

var last = 0;
var detected = false;

png.on('data', function (buf) {
    if (Date.now() - last < 1000) return;
    last = Date.now();
    
    emitter.emit('image', buf.toString('base64'));
    
    if (!redMode) return;
    if (detected) return;
    
    if (detect(640, 360, buf)) {
        detected = true;
        emitter.emit('red');
        
        console.log(Date.now());
        client.front(1);
        
        setTimeout(function () {
            client.stop();
            client.front(0);
            
            client.clockwise(1);
        }, 1000);
        
        setTimeout(function () {
            client.clockwise(0);
        }, 4000);
        
        setTimeout(function () {
            detected = false;
            emitter.emit('unred');
        }, 5000);
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();
