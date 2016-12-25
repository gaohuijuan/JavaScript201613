
function on(ele,type,fn){
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
function off(ele,type,fn){
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
