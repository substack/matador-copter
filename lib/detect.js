var fs = require('fs');
var Canvas = require('canvas');
var Image = Canvas.Image;
var rgb2hsl = require('color-convert').rgb2hsl;

module.exports = function (w, h, buf) {
    var canvas = new Canvas(w / 4, h / 4);
    var ctx = canvas.getContext('2d');
    
    var img = new Image();
    img.src = buf;
    ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
    
    var data = ctx.getImageData(0, 0, img.width / 4, img.height / 4).data;
    
    var matches = 0;
    for (var i = 0; i < data.length; i += 4) {
        var hsl = rgb2hsl(data[i], data[i + 1], data[i + 2]);
        var h = hsl[0], s = hsl[1], l = hsl[2];
        
        if ((h < 15 || h > (360 - 15)) && s > 30 && l > 25 && l < 150) {
            matches ++;
        }
    }
    return matches > 400;
};
