;(function (){
    function Emitter(){}

    Emitter.prototype.on = function (/*ele,*/type,fn){
        if(!/*ele*/this.ele[type]){
            /*ele*/this.ele[type] = [];
        }
        var a = /*ele*/this.ele[type];
        for(var i = 0; i < a.length; i++){
            if(a[i] === fn){
                return;
            }
        }
        a.push(fn);
        return this; // 保证链式写法  返回一个实例，保证继续调用原型方法
    }
    Emitter.prototype.run = function (/*ele,*/type,e){
        var a = /*ele*/this.ele[type];
        if(a && a.length){
            for(var i = 0; i<a.length; i++){
                if(typeof a[i] === 'function'){
                    a[i].call(this.ele);
                }else{
                    a.splice(i,1);
                    i--;
                }
            }
        }
    }
    Emitter.prototype.off = function (/*ele,*/type,fn){
        var a = /*ele*/this[type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i] === fn){
                    a[i] = null;
                    break;
                }
            }
        }
    }
    window.Emitter = Emitter;
})();
