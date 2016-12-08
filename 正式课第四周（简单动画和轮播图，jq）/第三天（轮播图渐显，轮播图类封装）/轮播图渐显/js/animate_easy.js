//animate(div1,{},1000);
(function (){
    // getCss setCss setGroupCss css =>这几个方法就是服务animate这个函数的。我们可以不使用utils的时候，那么直接把函数定义在这个闭包里。并不用暴露在全局下。
    // function getCss.....
    function animate(opt){ // ele,target,duration,callback
        var time = 0;
        var duration = opt.duration || 1000; //可选
        var begin = {};
        var change = {};
        var target = opt.target; //必选
        var ele = opt.ele; //必选
        var callback = opt.callback; // 回调
        //var effect = opt.effect; //效果
        var zhufengEffect = {
            Linear : function (t,b,c,d){
                return b + t/d*c;
            }
        };
        for(var key in target){
            begin[key] = utils.css(ele,key);
            change[key] = target[key] - begin[key];
        }
        window.clearInterval(ele.timer);
        ele.timer = window.setInterval(function (){
            time += 10;
            if(time >= duration){
                window.clearInterval(ele.timer);
                utils.css(ele,target);
                if(typeof callback == 'function'){
                    callback.call(ele);
                }
                return;
            }
            for(var key in change){
                var value = zhufengEffect.Linear(time,begin[key],change[key],duration);
                utils.css(ele,key,value);
            }
        },10);
    }
    window.animate = animate; //主动把这个方法暴露到全局
})();

/*
*   1 t b c d准备
*   2 根据target来给begin和change添加属性
*   3 清定时器(上一次)
*   4 启动定时器
*       time += 10
*       到达终点要清定时器
*       for in
*       由于time增加重新计算位置  Linear .....
*       把计算好的位置设置生效
* */
// 如何把这个ele的参数换成this   animate({ele:div1})
// div1.animate({target : {left:100}}) => ele用this来替代
// div1.animate ???? animate方法必须是div1家族的原型上的方法
// Element