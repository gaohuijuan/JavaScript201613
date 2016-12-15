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
    if (!ele['zw' + type]) {
        // 如果这个自定义属性不存在那么我就创建一个数组
        ele['zw' + type] = []; // 同一个ele的同一个事件只执行一次
        // div1.zwclick = [];
        // div1.zwkeyup = [];
        // div2.zwclick = [fn1,fn2....click事件发生的时候要执行的函数];
        ele.attachEvent('on' + type, function () {
            run.call(ele); // 把run中的this修改成ele eg: 把run中的this修改成div1
        });
    }
    var a = ele['zw' + type]; //让代码看起来简洁 => a ： div1.zwclick = [fn1]
    // on(ele, type,   fn);
    // on(div1,'click',fn1);
    for (var i = 0; i < a.length; i++) {
        // 这个循环处理的就是重复绑定的问题。在给自定义属性数组添加fn之前要循环判断数组中是否存在这个函数。如果存在那么就不用push进去了
        if (a[i] === fn) {
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
function run(e) {
    // this应该是ele => window
    // run先去找到对应事件类型的数组  比如: div1.zwclick : [fn1,fn2...fn10]
    // ele['zw'+type];  => this['zw'+type]; => this['zw'+e.type]
    // run中的this已经从widnow修改成了ele。
    // 在on函数中ele.attachEvent('on'+type, function (){ run.call(ele) });
    // div1.zwclick : div1???  'zw'+click???
    e = window.event; // 事件类型click在e这个事件对象的type属性上
    // e.target
    var a = this['zw' + e.type];  // div1.zwclick;
    // a : [fn1,fn2,fn3,fn4...fn10];
    // 按照顺序执行a数组中的所有的函数
    if (a && a.length) { //保证数组存在并且这个数组的长度不是0
        for (var i = 0; i < a.length; i++) {
            // a[i] => fn1, fn2 ....
            a[i].call(this); // [0:fn1,1:fn2....]
        }
    }
}
//on(div1,'click',fn1);
//on(div1,'click',fn1);
//on(div1,'keyup',fn1);

// div1.AAAclick = [fn1]
// div1.AAAkeyup = [fn2,fn3...]

// 1 在对应的事件类型上添加一个自定义属性数组
// 2 在数组中添加绑定的函数
// 3 需要绑定run方法，负责顺序执行数组中的函数。这个run只能绑定一次

function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
        return;
    }
    if (!ele['AAA' + type]) {
        ele['AAA' + type] = [];
        ele.attachEvent('on'+type,function (){
            run.call(ele);
        });
    }
    var a = ele['AAA' + type];
    for(var i=0; i<a.length; i++){
        if(a[i] == fn){
            return;
        }
    }
    a.push(fn);
}
// run函数是负责执行数组中的方法
// 1 先获取到这个数组  this['AAA'+e.type];
// 2 循环执行数组中的函数，并且在执行的过程中修改下this

function run(e){
    e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function (){
        e.returnValue = false;
    }
    e.stopPropagation = function (){
        e.cancelBubble = true;
    }
    var a = this['AAA'+e.type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(typeof a[i] == 'function'){
                // 为什么有些这个判断，由于使用off移除事件的过程中，我们为了避免数组的塌陷问题，我们直接赋值null。那么在这个数组中就会出现不是函数的null项。那么就需要判断是不是函数
                a[i].call(this,e); // fn1(e)   div1.onclick = fn1;
            }else{ //如果不是函数那么就是null
                //[null,null,fn3,fn4,fn5....]
                // 再按照顺序执行的过程中可能会遇到null的项目。那么就可以删除，然后这次删除需要处理数组的塌陷问题。不处理就会漏掉执行
                a.splice(i,1);
                i--;
            }
        }
    }
}

// 移除事件
//off(ele,type,fn);
//off(div1,'click',fn1);
// 1 先获取到这个对应事件类型的自定义属性数组
// 2 然后循环数组和fn做比较
// 3 如果相同直接删除掉就可以
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a = ele['AAA'+type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(a[i] === fn){
                // 循环这个自定义属性数组，只要和fn相同那么就从数组中删除。
                // a.splice(i,1);
                a[i] = null; // 数组塌陷
                // 如果单纯移除事件没有问题，但是如果在run方法在按照顺序执行这些函数的过程中，如果off移除事件就会形成数组塌陷，导致漏掉数组项没有执行。所以我们移除事件使用赋值null
                break;
            }
        }
    }
}
//div1.addEventListener('click',fn1,false);
//div1.removeEventListener('click',fn1,false);
// 这个就是在ie6-8中dom2移除事件方法
//div1.attachEvent('onclick',fn1);
//div1.detachEvent('onclick',fn1);






