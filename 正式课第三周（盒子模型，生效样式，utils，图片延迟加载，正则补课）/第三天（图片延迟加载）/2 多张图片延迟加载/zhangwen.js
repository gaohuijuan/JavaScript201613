// 1
var ul = document.querySelectorAll('.newsList')[0];
var imgs = ul.getElementsByTagName('img');

// 2
var xhr = new XMLHttpRequest();
xhr.open('GET','data.txt?_='+Math.random(),false);
xhr.onreadystatechange = function (){
    if(xhr.readyState == 4 && /*xhr.status == 200*/ /^2\d{2}$/.test(xhr.status)){
        window.data = JSON.parse(xhr.responseText);
    }
}
xhr.send(null);

// 3
//console.log(window.data);
if(window.data && data.length){
    var str = '';
    for(var i=0; i<data.length; i++){
        var curDataObj = data[i];
        str += '<li>';
        str += '<div><img src="" trueSrc="'+ curDataObj.src +'"></div>';
        str += '<div><h2>'+ curDataObj.title +'</h2><p>'+ curDataObj.desc+'</p></div>';
        str += '</li>';
    }
    ul.innerHTML = str;
}
// 4
function allImgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        var curImg = imgs[i];
        if(curImg.isLoaded){
            continue;
        }
        var _a = utils.win('clientHeight') + utils.win('scrollTop');
        var _b = curImg.parentNode.offsetHeight + utils.offset(curImg.parentNode).top;
        if(_a > _b){
            singleImgDelayLoad(curImg);
            fadeIn(curImg);
        }
    }
}
function singleImgDelayLoad(img){
    var tempImg = document.createElement('img');
    tempImg.src = img.getAttribute('trueSrc');
    tempImg.onload = function (){
        img.src = this.src;
    }
    img.isLoaded = true;
    tempImg = null;
}
function fadeIn(img){
    img.timer = window.setInterval(function (){
        //var opacity = window.getComputedStyle(img,null).opacity/1;
        var opacity = utils.getCss(img,'opacity');
        if(opacity >= 1){
            window.clearInterval(img.timer);
            img.style.opacity = 1;
            return;
        }
        opacity += 0.01; //
        img.style.opacity = opacity;
        //console.log(opacity);
    },20);

}
allImgsDelayLoad();
window.onscroll = allImgsDelayLoad;
