/*SERVER模块中都是JS在服务器端做的事情*/
var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->规律:只要保证我们的SERVER.JS在当前项目的根目录下,我们要读取哪个文件中的内容,其实就是<.+pathname>
    //=>以后只要客户端请求的是项目资源文件(HTML/CSS/JS/PNG...)我们就可以统一处理了,所有的项目资源文件都有一个特点:'有自己的后缀名'
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var conFile = 'not found!';
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
        } catch (e) {

        }
        response.end(conFile);
    }
    //->部分谷歌浏览器会默认的项我们的服务请求favicon.ico这个文件,我们的项目中没有这个文件,这样的话在执行fs.readFileSync的时候会因为找不到目标的文件而导致报错,把当前服务终止了 =>我们要进行处理：即使在找不到需要的资源文件的时候，服务不能报错，只需要给客户端返回结果是找不到文件即可
});
server1.listen(81, function () {
    console.log('server is success,listening on 81 port!');
});