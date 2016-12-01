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
// 3
console.log(window.data);
