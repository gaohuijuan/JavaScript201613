function fn() {
    console.log('utils hello world');
}
//->把当前模块中需要供别的模块调取使用的方法暴露出来
//module是NODE环境中自带的属性,用来管理模块的；exports是module对象中的属性，它也是一个对象数据类型，需要暴露哪些方法就放在这个对象中即可
module.exports = {
    fn: fn
};