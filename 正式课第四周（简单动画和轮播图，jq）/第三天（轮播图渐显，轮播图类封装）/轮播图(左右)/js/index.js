// 1 获取元素
var banner = document.getElementById('banner');
var bannerInner = utils.getElesByClass('bannerInner', banner)[0];
var focusList = utils.getElesByClass('focusList', banner)[0];
var left = utils.children(banner, 'a')[0];
var right = utils.children(banner, 'a')[1];
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');
// 2 获取数据
var xhr = new XMLHttpRequest();
xhr.open('get', 'data.txt?_=' + Math.random(), false);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
        window.data = utils.jsonParse(xhr.responseText);
    }
}
xhr.send(null);
console.log(window.data);
// 3 数据绑定
if (window.data) {
    var str = '';
    var str1 = '';
    for (var i = 0; i < data.length; i++) {
        var curData = data[i]; // { src : "images/1.jpg"}
        str += '<div><img src="" realSrc="'+curData.src+'"></div>';
        str1 += i === 0 ? '<li class="selected"></li>' : '<li></li>';
    }
    // 最后添加一张和第一张相同的图片，并且修改bannerInner的宽度
    str += '<div><img src="" realSrc="'+ data[0].src+'"></div>';
    utils.css(bannerInner,{width : (data.length+1)*800 });
    bannerInner.innerHTML = str;
    focusList.innerHTML = str1;
}
// 4 验证图片有效性
for(var i=0; i<imgs.length; i++){
    var curImg = imgs[i]; // 页面中的四个img标签
    //if(curImg.isLoaded){ continue };
    var tempImg = document.createElement('img');
    tempImg.index = i;
    tempImg.src = curImg.getAttribute('realSrc');
    tempImg.onload = function (){
        //curImg.src = this.src; // curImg = imgs[i] => this.index
        // 自定义属性一般配合this一起使用，this必然事件中的this。所以自定义属性必然添加到绑定事件的元素上。
        this.index; // 0 1 2 3
        imgs[this.index].src = this.src;
        animate({
            ele : imgs[this.index],
            target : {opacity : 1},
            duration : 500
        });
    }
    //tempImg.isLoaded = true;
}
// 5 轮播
var step = 0; // 全局变量就是用来保存当前应该那一张图片显示
var timer = window.setInterval(autoMove,2000);
function autoMove(){
    if(step == data.length){
        step = 0;
        utils.css(bannerInner,{left : -step * 800});
    }
    step++; // 累加之后的值就是我马上要运动到的终点
    // 每次运动的终点的值都是根据这个step的值来计算的
    animate({
        ele : bannerInner,
        target : {left: -step*800},
        duration : 500
    });
    focusAlign();
}
// 6 焦点对齐
function focusAlign(){
    // 处理最后一个焦点不存在的问题
    var tempStep = step === data.length ? 0 : step;
    for(var i=0; i<lis.length; i++){
        lis[i].className = i === tempStep ? "selected" : "";
    }
}
// 7 绑定鼠标悬停事件
banner.onmouseover = function (){
    window.clearInterval(timer);
    utils.css(left,'display','block');
    utils.css(right,'display','block');
}
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,2000);
    utils.css(left,'display','none');
    utils.css(right,'display','none');
}
// 8 左右按钮点击事件
right.onclick = autoMove;
left.onclick = function (){
    if(step == 0){
        step = data.length;
        utils.css(bannerInner,{left : -step * 800});
    }
    step--;
    animate({
        ele : bannerInner,
        target : {left: -step*800},
        duration : 500
    });
    focusAlign();
}
// 9 焦点点击事件
for(var i=0; i<lis.length; i++){
    lis[i].index = i;
    lis[i].onclick = function (){
        step = this.index;
        animate({
            ele : bannerInner,
            target : {left : -step*800},
            duration : 500
        });
        focusAlign();
    }
}



