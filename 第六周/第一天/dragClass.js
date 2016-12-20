// new Drag(div1);
// new Drag(div2); => 如果这行代码执行完div2可以拖拽，那么必然mousedown这个事件已经绑定过了
function Drag(ele){
    // 实例.ele => div1
    this.ele = ele; //把要拖拽的元素添加给实例当作私有属性
    this.l = null; // 这个值在鼠标按下的那一刻才会计算出来
    this.t = null; // 对于这种必须要赋值，暂时不知道值的情况下先赋值null
    // 如果让ele可以拖拽，那么必须保证mousedown事件已经绑定
    var that = this; // => 实例
    this.DOWN = function (e){
        // this; div1
        that.down(e);
        //that.down.call(that,e);
    }
    this.MOVE = function (e){
        that.move(e);
    }
    this.UP = function (e){
        that.up(e);
    }
    on(this.ele/*div1*/,'mousedown',/*this.down*/this.DOWN/*down*/);
}
// down move up方法 => 每个拖拽的元素都要执行的方法。放在原型上
// new Drag().down();
Drag.prototype.down = function (e){
    // 当mousedown事件触发执行函数
    // 由于这个down方法是使用on事件绑定的。那么这个函数在执行的时候（mousedown事件触发的时候执行），这个函数中的this就是on的第一个参数，而on的第一个参数是 实例.ele，所以这个方法中的this就被修改成了元素div1，那么我们还需要通过实例来调用定义在Drag.prototype上的move方法。所以我们要保证this是实例。而不是元素。
    // 如何保证？ 函数中的this只有执行的那一刻才知道。=> 无论这个方法在哪里执行的，都保证这个方法中的this实例
    this; // div1 => 实例
    this.l = e.pageX - this.ele/*元素*/.offsetLeft; // 原来是null，鼠标按下重新赋值
    this.t = e.pageY - this.ele.offsetTop;
    if(this.ele.setCapture){
        this.ele.setCapture();
        // 保证move和up方法中的this也是实例
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
}
Drag.prototype.move = function (e){
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
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

