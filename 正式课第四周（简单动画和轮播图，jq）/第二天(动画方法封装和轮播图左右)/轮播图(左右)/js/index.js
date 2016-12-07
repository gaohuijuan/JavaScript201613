// 1 获取元素
var banner = document.getElementById('banner'); //范围
var bannerInner = utils.getElesByClass('bannerInner', banner)[0];
var focusList = utils.getElesByClass('focusList', banner)[0];
var left = utils.getElesByClass('left', banner)[0]; //左
var right = utils.getElesByClass('right', banner)[0]; //右
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');
// 2 数据
;(function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.data = utils.jsonParse(xhr.responseText);
            //banner.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
// 3 绑定数据

;(function bindData() {
    if (window.data) {
        var str = ''; // img
        var strLi = ''; // li
        for (var i = 0; i < data.length; i++) {
            // <div><img src="" realSrc="images/2.jpg"></div>
            str += '<div><img src="" realSrc="' + data[i].src + '"></div>';
            strLi += i == 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        // 为了保证轮播是无缝连接，在最末尾拼接一个第一张图片
        str += '<div><img src="" realSrc="' + data[0].src + '"></div>';
        // 保证bannerInner的宽度足够排列这些图片。
        utils.css(bannerInner,'width',(data.length+1)*800);

        bannerInner.innerHTML = str;
        focusList.innerHTML = strLi;
    }
})();

// 4 验证图片有效性
;(function imgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        (function (i){ // 只要循环中嵌套事件那么就需要使用自定义属性或者闭包的方式来处理i的问题
            var curImg = imgs[i];
            //if(curImg.isLoaded){ continue }
            var tempImg = document.createElement('img');
            tempImg.src = curImg.getAttribute('realSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                animate({
                    ele : curImg,
                    target : {opacity : 1}
                });
            }
            //curImg.isLoaded = true;
        })(i);

        // 可以尝试使用自定义属性的方式
    }
})();

// 5 轮播图
var step = 0; // 这个step的值就是代表的是下一张即将出现的图片的索引
var timer = window.setInterval(autoMove,2000); // 2s更换一张图片
function autoMove() {
    if(step == /*4*/data.length){
        step = 0;
        utils.css(bannerInner,'left', -step*800);
    }

    step++; // ++之后的值才是我下一次的目的地。
    animate({
        ele : bannerInner,
        target : {left : -step*800},
        duration : 500
    });
    focusAlign();
}

function focusAlign(){
    // 如果step == 4的时候，那么li没有4这个索引。那么只能等于0
    var tempStep = step == /*4*/data.length ? 0 : step;
    for(var i=0; i<lis.length; i++){
        lis[i].className = i == tempStep ? 'selected' : "";
    }
}

banner.onmouseover = function (){
    // 鼠标悬停之后停止定时器，左右按钮出现
    window.clearInterval(timer);
    left.style.display = right.style.display = 'block';
}

banner.onmouseout = function (){
    // 鼠标离开之后启动定时器，继续轮播。然后按钮消失
    timer = window.setInterval(autoMove,2000);
    left.style.display = right.style.display = 'none';
}

right.onclick = autoMove; //点击右按钮和自动轮播是同一个效果。

left.onclick = function (){
    if(step == 0){
        step = data.length;
        utils.css(bannerInner,'left',-step*800);
    }
    step--;
    animate({
        ele : bannerInner,
        target : {left : -step * 800},
        duration : 500
    });
    focusAlign();
}

;(function bindEventForLis(){
    for(var i=0; i<lis.length; i++){
        lis[i].index = i;
        lis[i].onclick = function (){
            step = this.index; //给这个step重新赋值。
            // 所有的运动全部都已step为准
            animate({
                ele : bannerInner,
                target : {left : -step*800},
                duration : 500
            });
            focusAlign();
        }
    }
})();