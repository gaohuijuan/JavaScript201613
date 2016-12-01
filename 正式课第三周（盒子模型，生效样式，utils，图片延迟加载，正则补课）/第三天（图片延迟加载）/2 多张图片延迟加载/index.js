//1 先获取元素 ul
var ul = document.querySelectorAll('.newsList')[0];
var imgs = ul.getElementsByTagName('img');

// 2 获取数据
;(function getData(){
    var xhr = new XMLHttpRequest();
    //'data.txt?set=girl&marry=false'
    xhr.open('get','data.txt?_='+/*Math.random()*/new Date().getTime(),false); // 这个url保证每次请求都不同的，所以在末尾拼接了时间戳
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            // 404, 304???? 本地缓存  cache
            window.data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
// 3 绑定数据(把数据添加到页面中)
console.log(window.data);
;(function bindData(){
    if(window.data){
        var str = '';
        for(var i=0; i<data.length; i++){
            var curDataObj = data[i];  // {src:"",title:"",desc:""}
            str += '<li>';
            str += '<div><img src="" zhangwen="'+ curDataObj.src +'"></div>';
            str += '<div><h2>'+ curDataObj.title +'</h2><p>'+ curDataObj.desc +'</p></div>';
            str += '</li>';
        }
        ul.innerHTML = str;
    }
})();
// 4 图片延迟加载

function allImgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        var curImg = imgs[i]; // 每一张图片
        if(curImg.isLoaded){
            continue; // 如果当前这张图片加载过，那么就不用再加载了。但是下一张图片还要继续。所以使用continue
        }
        var _a = utils.win('clientHeight') + utils.win('scrollTop');
        var _b = curImg.parentNode.offsetHeight + utils.offset(curImg.parentNode).top;
        if(_a > _b){ // 当前正在循环到的图片已经完全进入到浏览器窗口内
            // 执行单张图片延迟加载

            singleImgDelayLoad(curImg); //把符合条件的图片做延迟加载有效性验证
            fadeIn(curImg); // 这个函数就是负责去把图片的透明度从0运动到1.  淡入

        }
    }
}
function fadeIn(img){
    // var speed = 0.01;
    img.timer = window.setInterval(function (){
        var opacity = utils.getCss(img,'opacity'); // 获取已经生效的透明度的值
        if(opacity >= 1){ // 当透明度运动到1的时候定时器就可以清除了
            window.clearInterval(img.timer);
            return;
        }
        opacity += 0.01;
        img.style.opacity = opacity;
    },20);
}

function singleImgDelayLoad(img){
    var tempImg = document.createElement('img');
    //var tempImg = new Image(); //也能创建一个新图片
    tempImg.src = img.getAttribute('zhangwen'); // 这行代码就是让tempImg去加载参数img的图片资源
    tempImg.onload = function (){
        img.src = this.src; // 加载成功之后真实图片再去加载，由于tempImg已经加载过这个图片资源。真实图片再去加载的时候，从本地缓存304获取。
    }
    img.isLoaded = true; //只要加载过就添加一个自定义属性用来记录是否加载过
}

allImgsDelayLoad(); // 刷新网页就要立刻执行这个多张图片延迟加载
window.onscroll = allImgsDelayLoad; // 滚动条滚动也要执行多张图片延迟加载


