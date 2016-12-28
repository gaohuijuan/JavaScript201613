/*SERVER模块中都是JS在服务器端做的事情*/
var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    if (pathname === '/index.html') {
        var conFile = fs.readFileSync('./index.html', 'utf-8');
        response.end(conFile);
        return;
    }

    if (pathname === '/css/index.css') {
        conFile = fs.readFileSync('./css/index.css', 'utf-8');
        response.end(conFile);//->readFileSync获取的结果是一个字符串,我们返回给客户端的结果也是一个字符串
    }
});
server1.listen(81, function () {
    console.log('server is success,listening on 81 port!');
});