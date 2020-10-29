// image-decode to get pixel array
let decode = require('image-decode');
const PNG = require('pngjs');

// class for parsing base64 images.
module.exports = class {
    constructor(base64) {
        // decode the image
        let decoded = decode(base64);
        this.width = decoded.width;
        this.height = decoded.height;
        this.data = decoded.data;
    }

    // returns the color at a specific coordinate
    getColorAtPoint(x, y) {
        // get the rgba
        let index = (x + y * this.width) * 4;
        const red = this.data[index];
        const green = this.data[index + 1];
        const blue = this.data[index + 2];
        const alpha = this.data[index + 3];

        return rgbToHex(red, green, blue);
    }

    // useful for finding certain shapes, and scouting for players
    getEveryPixelWithColor(hex) {
        // make it lowercase
        hex = hex.toLowerCase();
        // add every instance of the hex to matches and return matches
        let matches = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let color = this.getColorAtPoint(x, y);
                if (color === hex) matches.push([x, y]);
            }
        }
        return matches;

    }
}

// utility to convert rgb to hex
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// convert hex to rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }