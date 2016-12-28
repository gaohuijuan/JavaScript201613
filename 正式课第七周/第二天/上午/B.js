var A = require('./A');
function avg() {
    arguments.__proto__ = Array.prototype;
    arguments.sort(function (a, b) {
        return a - b;
    });
    arguments.shift();
    arguments.pop();
    return (A.sum.apply(null, arguments) / arguments.length).toFixed(2);
}
module.exports = {
    avg: avg
};