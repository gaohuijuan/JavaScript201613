// new Drag(div1);
function Drag(ele, range) {
    this.ele = ele;
    var maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.ele.offsetWidth;
    var maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.ele.offsetHeight;
    this.range = range || {left: maxL, top: maxT};
    this.l = null;
    this.t = null;
    var that = this;
    this.DOWN = function (e) {
        that.down(e);
    }
    this.MOVE = function (e) {
        that.move(e);
    }
    this.UP = function (e) {
        that.up(e);
    }
    on(this.ele, 'mousedown', this.DOWN);
}
Drag.prototype.down = function (e) {
    this.l = e.pageX - this.ele.offsetLeft;
    this.t = e.pageY - this.ele.offsetTop;
    if (this.ele.setCapture) {
        this.ele.setCapture();
        on(this.ele, 'mousemove', this.MOVE);
        on(this.ele, 'mouseup', this.UP);
    } else {
        on(document, 'mousemove', this.MOVE);
        on(document, 'mouseup', this.UP);
    }
    // 无论是谁绑定拖拽开始事件都在此刻执行
    selfrun.call(this.ele, 'selfdragstart', e);
}
Drag.prototype.move = function (e) {
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    var minL = 0;
    var minT = 0;
    var maxL = this.range.left;
    var maxT = this.range.top;
    l = l < minL ? minL : l > maxL ? maxL : l;
    t = t < minT ? minT : t > maxT ? maxT : t;
    this.ele.style.left = l + 'px';
    this.ele.style.top = t + 'px';
    e.preventDefault();
    // 无论是谁绑定拖拽中事件都在此刻执行
    selfrun.call(this.ele, 'selfdraging', e);
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
    // 无论是谁绑定拖拽结束事件都在此刻执行
    selfrun.call(this.ele, 'selfdragend', e);
}
