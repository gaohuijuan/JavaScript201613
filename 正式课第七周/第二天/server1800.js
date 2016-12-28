/*SERVER模块中都是JS在服务器端做的事情*/
var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function (request, response) {
    /*
     * 客户端每发送一次请求都会触发这个回调函数执行一次,不仅被执行,而且还会给这个回调函数默认传递两个参数值
     * request:存储了客户端传递过来的全部请求信息
     *    request.url:存储的是客户端请求的URL地址,但是这个地址不全,只能包含客户端请求的资源文件的路径和名称以及问号传递的参数值,URL的其余部分没有
     *
     * response:提供了一系列的方法供服务器端把内容返回给客户端
     *    response.write([value]):把value内容返回给客户端,response.write可以执行很多次,返回的内容一般都是字符串
     *    response.end([value]):和write一样也可以把内容返回,但是它还有结束返回的意思,遇到end当前返回内容的操作就结束了,我们在返回的时候,如果不需要在返回了,必须要使用end结束才可以
     */
    //console.log(request.url);
    /*
     * request.url中存储了两部分内容(路径+问号传参),我们在项目中最好把两部分分别的解析出来,以后想用哪部分就用哪部分
     * '/index.html?name=zf&age=8'
     * '/index.html'
     * {name:'zf',age:8}
     */
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    //->如果请求的是index.html,我们就把这个文件中的原代码获取到,然后返回给客户端的浏览器即可
    if (pathname === '/index.html') {
        var conFile = fs.readFileSync('./index.html', 'utf-8');
        response.end(conFile);
    }

    //response.write('hello world!');
    //response.end('my name is HA-HA');
});
server1.listen(81, function () {
    console.log('server is success,listening on 81 port!');
});