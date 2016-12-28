var url = require('url');
var res = url.parse('http://www.zhufengpeixun.cn:80/work/index.html?name=zxt&age=30#play', true);
console.log(res);
/*
 Url {
 protocol: 'http:', ->协议
 slashes: true, ->是否有斜线
 auth: null,
 host: 'www.zhufengpeixun.cn:80', ->域名(IP)+端口
 port: '80', ->端口
 hostname: 'www.zhufengpeixun.cn', ->域名
 hash: '#play', ->HASH值
 search: '?name=zxt&age=30', ->问号传参
 query: { name: 'zxt', age: '30' }, ->问号传参的值都以对象键值对的方式存储起来了
 pathname: '/work/index.html', ->请求资源文件的目录和名称(在地址前面默认有一个斜杠)
 path: '/work/index.html?name=zxt&age=30',
 href: 'http://www.zhufengpeixun.cn:80/work/index.html?name=zxt&age=30#play' }
 */
