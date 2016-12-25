;(function (){
    function addWheelEventListener(ele,callback){ // foo
        if(window.navigator.userAgent.indexOf('Firefox') === -1){
            ele.onmousewheel = fn;
        }else{
            ele.addEventListener('DOMMouseScroll',fn);
        }
        function fn(e){
            e = e ||window.event;

            var isDown = null;
            if(e.wheelDelta){
                isDown = e.wheelDelta < 0;
            }else{
                isDown = e.detail > 0;
            }
            callback.call(ele,isDown,e);
            e.preventDefault ? e.preventDefault() : e.returnValue = false; // 不会触发在body上滚动的同时还出发onscroll事件
        }
    }
    window.addWheelEventListener = addWheelEventListener;
})();

