function fn() {
    console.log('public');
}

var utils = require('./m/utils');//->导入自己编写的模块需要加'./',然后在按照目录去查找(不加的话默认是去node_modules中查找)
utils.fn();
