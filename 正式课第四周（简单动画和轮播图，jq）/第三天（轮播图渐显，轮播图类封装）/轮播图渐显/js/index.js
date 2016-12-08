// 1
var banner = document.getElementById('banner');
var bannerInner = utils.getElesByClass('bannerInner', banner)[0];
var focusList = utils.getElesByClass('focusList', banner)[0];
var left = utils.children(banner, 'a')[0];
var right = utils.children(banner, 'a')[1];
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusList.getElementsByTagName('li');

// 2
;(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(window.data);


// 3 绑定数据
;(function () {
    if (window.data) {
        var str = '';
        var str1 = '';
        for (var i = 0; i < data.length; i++) {
            str += '<div><img src="" realSrc="'+ data[i].src +'"></div>';
            str1 += i == 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str;
        focusList.innerHTML = str1;
    }
})();

// 4
;(function (){
    for(var i=0; i<imgs.length; i++){
        var tempImg = document.createElement('img');
        tempImg.index = i; //给每一个临时的图片添加一个自定义属性，用来保存这个临时图片是帮助哪一张真实图片去加载资源的。
        tempImg.src = imgs[i].getAttribute('realSrc');
        tempImg.onload = function (){
            // 如果图片资源没有问题，那么这个事件会被触发imgs.length次
            imgs[this.index].src = this.src;
            // 如果是第一张图片，那么需要把层级提高，并且把透明度运动到1
            if(this.index == 0 ){
                // 由于zIndex和opacity样式全部设置img.parentNode那个div上了。
                utils.css(imgs[0].parentNode,'zIndex',1);
                animate({
                    ele : imgs[0].parentNode,
                    target : {opacity : 1},
                    duration : 500
                });
            }
        }
    }
})();

// 5
var step = 0; //step仍然记录应该显示的图片的索引值
var timer = window.setInterval(autoMove,2000);
function autoMove(){
    step++;
    if(step == /*4*/data.length){
        step = 0;
    }
    setImg();
}

function setImg(){
    //负责循环所有的图片，然后比对哪一张图片的索引值和step的值相等。索引和step相等的那一张图片的zIndex的值提高。除了这一张的其他图片的zIndex设置成初始状态0。
    // 设置图片的zIndex的值之后，虽然层级提高然后需要把它的透明度从0运动到1.并且透明度运动到达1之后（之后）把其他图片的的透明度设置成0
    for(var i=0; i<imgs.length; i++){
        if(i === step){
            utils.css(imgs[i].parentNode,'zIndex',1);
            animate({
                ele :  imgs[i].parentNode,
                target : { opacity : 1 },
                duration : 500,
                callback : function (){
                    var otherDivs = utils.siblings(this);
                    // [div,div,div]
                    for(var i=0; i<otherDivs.length; i++){
                        utils.css(otherDivs[i],'opacity',0);
                    }
                    isOkClick = true;
                }
            });
        }else{
            utils.css(imgs[i].parentNode,'zIndex',0);
        }
    }
    // 焦点对齐
    for(var i=0; i<lis.length; i++){
        lis[i].className = i == step ? 'selected' : '';
    }
}

// 6 左右按钮
banner.onmouseover = function (){
    window.clearInterval(timer);
    left.style.display = right.style.display = 'block';
}
banner.onmouseout = function (){
    timer = window.setInterval(autoMove,2000);
    left.style.display = right.style.display = 'none';
}
// 7 按钮点击
var isOkClick = true; //false

right.onclick = function (){
    if(isOkClick){
        autoMove();
        isOkClick = false;
    }
};

left.onclick = function (){
    if(isOkClick){
        step--;
        if(step == -1){
            step = /*3*/data.length-1;
        }
        setImg();
        isOkClick = false;
    }
};




// 8 焦点点击
;(function (){
    for(var i=0; i<lis.length; i++){
        lis[i].index = i;
        lis[i].onclick = function (){
            step = this.index;
            setImg();
        }
    }
})();