var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    //->req:request  res:response
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    /*
     * 如果客户端请求的是项目资源文件(HTML/CSS/JS/IMG..),我们都走以下的流程
     * 1、首先判断客户端的请求是否为资源文件:看请求的地址中是否包含后缀名,如果有的话我们就认为请求的是资源文件,如果没有我们认为请求的是数据接口;
     * 2、在服务器上通过请求的路径名称(PATHNAME)找到对应的资源文件,把资源文件中的原代码获取到
     *  问题:如果客户端请求的文件在服务器上不存在,我们在读取的时候会出现错误,从而导致服务崩溃,针对于这种情况我们需要做异常捕获
     * 3、把找到的源代码返回给客户端
     *  问题:我们返回给客户端的内容其实都是字符串,客户端非IE浏览器虽然我们返回的是字符串,但是它可以自我识别成为对应的原代码并且进行渲染；部分IE浏览器，我们返回的如果是字符串的话，它不能智能识别是什么语言的代码，导致显示的都是字符串而不是进行渲染；=>解决办法：服务器端在返回内容的时候不仅仅把字符串返回，而且还告诉客户端的浏览器返回内容的‘MIME类型’(重写响应头信息)
     */
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var conFile = 'sorry,the requested resource file does not exist!';
        try {
            conFile = fs.readFileSync('.' + pathname);//->读取出来的内容全部的都是字符串格式的数据或者Buffer格式的数据
        } catch (e) {
        }
        //->重写响应头信息:指定返回内容的MIME类型
        //res.writeHead([HTTP STATUS],[OPT])
        //我们需要根据当前请求资源文件的后缀名判断出对应的MIME类型
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
            //->当前项目都请求了哪些资源文件,我们每一种都需要在这里处理
        }
        res.writeHead(200, {
            'content-type': suffixMIME
        });
        res.end(conFile);
    }

});
server1.listen(80);