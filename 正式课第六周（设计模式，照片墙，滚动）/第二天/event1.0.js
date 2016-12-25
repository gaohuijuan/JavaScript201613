
function on(ele,type,fn){
    if(/^self/.test(type)){ // type : 'selfdragstart'
        if(!ele[type]){
            ele[type] = [];
        }
        var a = ele[type];
        for(var i = 0; i < a.length; i++){
            if(a[i] === fn){
                return;
            }
        }
        a.push(fn);
        return;
    }
    // 以上的代码是给self开头的自定义事件准备的
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele['AAA' + type]){
        ele['AAA'+type] = [];
        ele.attachEvent( 'on' + type, function (){
            run.call(ele);
        });
    }
    var a = ele['AAA'+type];
    for(var i = 0 ; i < a.length; i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
}
function selfrun(/*ele,*/type,e){ // this e.type
    var a = /*ele*/this[type];
    if(a && a.length){
        for(var i = 0; i<a.length; i++){
            if(typeof a[i] === 'function'){
                a[i].call(/*ele*/this,e)
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}


function run(e){
    // this; ??  ele   e.type => 'click','keyup' ...
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
    var a = this['AAA'+e.type];
    if(a && a.length){
        for(var i = 0 ; i < a.length; i++){
            if(typeof a[i]  === 'function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }

        }
    }
}
function off(ele,type,fn){ // type : selfdragstart
    if(/^self/.test(type)){
        var a = ele[type]; // div1.selfdragstart
        if(a && a.length){
            for(var i = 0; i< a.length; i++){
                if(a[i] === fn){
                    a[i] = null;
                    break;
                }
            }
        }
        return;
    }
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a = ele['AAA'+type];
    if(a && a.length){
        for(var i = 0; i<a.length; i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
}

// 把run函数中的this => ele
// a = function (e){
//     run.call(ele);
// }
// processThis(run,ele);

function processThis(callback,that){ // 把run函数中的this处理成ele
    return function (e){
        callback.call(that,e);
    }
}
