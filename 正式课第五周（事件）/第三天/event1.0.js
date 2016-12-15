// 处理ie6-8中的DOM2事件绑定的兼容性问题
// div1.attachEvent('onclick',fn);
// div1.addEventListener('click',fn);
function on(ele, type, fn) {
    // addEventListener
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
        return;
    }
    // for IE6-8
    if(!ele['zw'+type]){
        // 如果这个自定义属性不存在那么我就创建一个数组
        ele['zw'+type] = []; // 同一个ele的同一个事件只执行一次
        // div1.zwclick = [];
        // div1.zwkeyup = [];
        // div2.zwclick = [fn1,fn2....click事件发生的时候要执行的函数];
        ele.attachEvent('on'+type,function (){
            run.call(ele); // 把run中的this修改成ele eg: 把run中的this修改成div1
        });
    }
    var a = ele['zw'+type]; //让代码看起来简洁 => a ： div1.zwclick = [fn1]
    // on(ele, type,   fn);
    // on(div1,'click',fn1);
    for(var i=0; i<a.length; i++){
        // 这个循环处理的就是重复绑定的问题。在给自定义属性数组添加fn之前要循环判断数组中是否存在这个函数。如果存在那么就不用push进去了
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn); // 把fn这个函数添加到对应事件类型的数组中
    // window.setInterval(function (){
    //     // this => window
    //     that.autoMove();
    // },1000)
    // ele.attachEvent('on'+type,run); // 这个run函数才是真正绑定给ele的type事件。当事件被触发的时刻真正执行的函数其实是run。然后run负责找到对应type事件类型的自定义属性数组，并且把数组中的函数按照顺序执行。
    // ele.attachEvent('on'+type,function (){
    //     run.call(ele); // 把run中的this修改成ele eg: 把run中的this修改成div1
    // });
    //div1.attachEvent('onclick',run); // run中的this是window => this改div1
    //div1.attachEvent('onclick',fn1); // fn1中的this是window
}

function run(e){
    // this应该是ele => window
    // run先去找到对应事件类型的数组  比如: div1.zwclick : [fn1,fn2...fn10]
    // ele['zw'+type];  => this['zw'+type]; => this['zw'+e.type]
    // run中的this已经从widnow修改成了ele。
    // 在on函数中ele.attachEvent('on'+type, function (){ run.call(ele) });
    // div1.zwclick : div1???  'zw'+click???
    e = window.event; // 事件类型click在e这个事件对象的type属性上
    // e.target
    var a = this['zw'+e.type];  // div1.zwclick;
    // a : [fn1,fn2,fn3,fn4...fn10];
    // 按照顺序执行a数组中的所有的函数
    if(a && a.length){ //保证数组存在并且这个数组的长度不是0
        for(var i=0; i<a.length; i++){
            // a[i] => fn1, fn2 ....
            a[i].call(this); // [0:fn1,1:fn2....]
        }
    }
}