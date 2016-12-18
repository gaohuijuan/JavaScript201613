/**
 * 负责处理IE6-8dom2事件绑定的兼容性问题
 * 121170784 18800019819
 */
// div1.addEventListener('click',fn,false);
function on(ele, type, fn) {
    if (ele.addEventListener) { // function /undefined
        ele.addEventListener(type, fn, false);
        return;
    }
    // for IE6-8
    // div1.AAAclick = [];
    // 添加一个自定义属性数组
    if (!ele['AAA' + type]) { // 同一个事件类型，这个判断只能成立一次
        ele['AAA' + type] = [];
        // 负责执行数组中的函数的run方法，同一个事件也只能绑定一次
        ele.attachEvent('on' + type, run); // 这个才是真正绑定的事件
    }
    var a = ele['AAA' + type]; // 为了操作简便
    // 把要绑定的fn函数添加到刚刚获取到的数组中
    a.push(fn);
}

// 这个run方法负责找到先获取到这个对应事件类型的自定义属性数组
// div1.AAAclick  click事件
// div1.AAAkeyup  keyup事件
// div1.AAAmouseover mouseover事件
function run(e) {
    e = window.event;
    e.target = e.srcElement;
    // div1.AAAclick => e.target['AAA'+e.type];
    e.type; // 'click' 'keyup' 'mouseover'
    e.target; // div1
    var a = e.target['AAA' + e.type]; // [fn1,fn2...]
    for (var i = 0; i < a.length; i++) {
        a[i]();
    }
}

function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
        return;
    }
    if (!ele['AAA' + type]) {
        ele['AAA' + type] = [];
        ele.attachEvent('on' + type, function () {
            this;// window
            run.call(ele);
        });
    }
    var a = ele['AAA' + type];
    // 重复绑定问题，只要这个自定义属性数组中存在fn，说明这个函数已经绑定过了。那么就没有必要再次添加到数组中
    for (var i = 0; i < a.length; i++) {
        if (a[i] === fn) {
            return;
        }
    }
    a.push(fn);
}

function run(e) {
    // this => ele
    e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function (){
        e.returnValue = false;
    }
    e.stopPropagation = function (){
        e.cancelBubble = true;
    }
    var a = this['AAA' + e.type];
    for (var i = 0; i < a.length; i++) {
        if(typeof a[i] == 'function'){
            a[i].call(this,e); // fn1....fn10()
        }else{ // null => 一定是off移除事件的时候添加进来的
            a.splice(i,1);
            i--;
        }
    }
}
// on(div1, 'click', fn1);
// div1.removeEventListener('click', fn1, false);
// div1.attachEvent('click', fn1);
// div1.detachEvent('click', fn1);

function off(ele, type, fn) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn, false);
        return;
    }
    var a = ele['AAA' + type];
    // can not read property length of undefined
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === fn) {
                // a.splice(i,1); //就会存在数组塌陷问题
                a[i] = null;
                // 在事件触发执行run的过程中如果off事件就会存在塌陷问题
                break;
            }
        }
    }
}


















