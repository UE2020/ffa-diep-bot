// utilities

// point distance
module.exports.distance = function (a, b) {
    const x = a[0] - a[0];
    const y = a[1] - b[1];

    return Math.sqrt(x * x + y * y);
};