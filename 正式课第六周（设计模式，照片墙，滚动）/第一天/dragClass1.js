function Drag(ele){
    this.ele = ele;
    this.ele.l = null;
    this.ele.t = null;
    var that = this;
    this.DOWN = function (e){
        that.down(e);
    }
    this.MOVE = function (e){
        that.move.call(that,e);
    }
    this.UP = processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN);
}
Drag.prototype.down = function (e){
    // this => div1
    this.ele.l = e.pageX - this.ele.offsetLeft;
    this.ele.t = e.pageY - this.ele.offsetTop;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
}
Drag.prototype.move = function (e){
    var l = e.pageX - this.ele.l;
    var t = e.pageY - this.ele.t;
    this.ele.style.left = l + 'px';
    this.ele.style.top = t + 'px';
    e.preventDefault();
}
Drag.prototype.up = function (e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
}

function processThis(callback,that){ // 把run函数中的this处理成ele
    return function (e){
        callback.call(that,e);
    }
}





