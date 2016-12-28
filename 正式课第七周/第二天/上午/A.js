/*
方法一:
function sum() {
    var total = null;
    [].forEach.call(arguments, function (item, index) {
        item = Number(item);
        !isNaN(item) ? total += item : null;
    });
    return total;
}*/
function sum() {
    var total = null;
    arguments.__proto__ = Array.prototype;
    arguments.forEach(function(item,index){
        item = Number(item);
        !isNaN(item) ? total += item : null;
    });
    return total;
}
module.exports = {
    sum: sum
};