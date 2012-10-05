process.stdin.on('data', function (buf) {
    if (buf[0] === 3) {
        client.land();
        setTimeout(function () {
            process.exit();
        }, 250);
    }
    
    var s = String.fromCharCode(buf[0]);
    if (s === 'h') {
        client.counterClockwise(speed);
        setTimeout(function () { client.counterClockwise(0) }, 250);
    }
    if (s === 'j') {
        client.down(speed);
        setTimeout(function () { client.down(0) }, 250);
    }
    if (s === 'k') {
        client.up(speed);
        setTimeout(function () { client.up(0) }, 250);
    }
    if (s === 'l') {
        client.clockwise(speed);
        setTimeout(function () { client.clockwise(0) }, 250);
    }
    
    if (s === 'w') {
        client.front(speed);
        setTimeout(function () { client.front(0) }, 250);
    }
    if (s === 's') {
        client.back(speed);
        setTimeout(function () { client.back(0) }, 250);
    }
    
    if (s === ' ') {
        if (flying) client.land();
        else client.takeoff();
        flying = !flying;
    }
    if (s === 'x') client.stop();
    if (s === 'r') redMode = !redMode;
});
