var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;//->以对象键值对的方式存储了客户端通过问号传参的方式传递过来的参数信息
    /*
     * 请求的是当前项目的静态资源文件:HTML/CSS/JS/IMG...
     * 1、所有的资源文件都有对应的后缀名,我们根据这个特点验证是否为资源文件
     * 2、读取资源文件中的内容(字符串或者BUFFER格式的数据)->容错处理
     * 3、通过文件的后缀名获取对应的MIME类型,以重写响应头的方法告诉IE对应的类型
     * 4、把读取到的内容返回给客户端的浏览器
     */
    var regFile = /\.([a-zA-Z0-9]+)/i;
    if (regFile.test(pathname)) {
        var conFile = 'not found!',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname);
            status = 200;
        } catch (e) {
        }
        var suffix = regFile.exec(pathname)[1].toUpperCase(),
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
        }
        res.writeHead(status, {'content-type': suffixMIME});
        res.end(conFile);
        return;
    }

    /*
     * 实现API接口对应的功能
     * 1、真实项目中,我们的数据内容都存储在数据库中;本次案例我们把数据临时存储在本地项目的一个JSON文件中:json/custom.json
     * 2、不管是增加还是获取等操作,都需要先把文件中所有的客户信息获取到,然后在进行后续的操作,这样的话我们第一步就先获取所有的客户信息
     * 3、先初始化服务器返回的内容格式
     */
    var customData = fs.readFileSync('./json/custom.json'),
        result = {code: 1, msg: 'ERROR', data: null};
    customData = JSON.parse(customData);

    /*获取所有的客户信息*/
    if (pathname === '/getAllList') {
        if (customData.length > 0) {
            result = {
                code: 0,
                msg: 'SUCCESS',
                data: customData
            };
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});//->返回的数据格式是JSON的MIME,而且还设定了数据的编码格式是UTF-8的编码格式(防止乱码)
        res.end(JSON.stringify(result));//->服务器返回的一般都是JSON字符串或者BUFFER格式数据
        return;
    }

    /*
     * 获取指定的客户信息
     * 1、接收客户端传递进来的ID(问号传参传递的),在query中存储着呢
     */
    if (pathname === '/getInfo') {
        var customId = query['id'];
        customData.forEach(function (item, index) {
            if (item.id == customId) {
                result = {
                    code: 0,
                    msg: 'SUCCESS',
                    data: item
                };
            }
        });
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    /*
     * 删除客户信息
     * 1、获取客户端传递进来的ID
     * 2、循环所有的客户信息,把和传递进来ID相同的那一项在数组中移除
     * 3、把最新的数组中的客户信息重新的写入到文件中
     * 4、返回给客户端成功还是失败
     */
    if (pathname === '/removeInfo') {
        customId = query['id'];
        customData.forEach(function (item, index) {
            if (item.id == customId) {
                customData.splice(index, 1);
                result = {code: 0, msg: 'success'};
            }
        });
        fs.writeFileSync('./json/custom.json', JSON.stringify(customData));
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    /*
     * 增加客户信息
     * 1、获取客户端通过请求主体传递进来的客户信息 req.on('data') req.on('end') 使用这两个事件来处理
     * 2、传递进来的数据缺少客户ID(唯一并且自增长的),我们需要获取最后一项的ID,在原来的基础上加一,就是我们需要新增加这一项的ID
     * 3、把新增这一项放在数组的末尾,然后把最新的结果写入文件中
     */
    if (pathname === '/addInfo') {
        var passData = '';
        req.on('data', function (chunk) {//->正在接收请求主体的内容
            passData += chunk;
        });
        req.on('end', function () {//->请求主体内容已经接收完成
            passData = JSON.parse(passData);//->客户端通过请求主体传递过来的数据是JSON字符串,我们需要把其转换为JSON对象使用=>{name:'xxx'}
            passData['id'] = customData.length === 0 ? 1 : parseFloat(customData[customData.length - 1]['id']) + 1;
            customData.push(passData);
            fs.writeFileSync('./json/custom.json', JSON.stringify(customData));
            result = {code: 0, msg: 'success'};

            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));
        });
        return;
    }

    if (pathname === '/updateInfo') {
        passData = '';
        req.on('data', function (chunk) {
            passData += chunk;
        });
        req.on('end', function () {
            passData = JSON.parse(passData);
            customData.forEach(function (item, index) {
                if (item.id == passData.id) {
                    customData[index] = passData;
                    result = {code: 0, msg: 'success'};
                }
            });
            fs.writeFileSync('./json/custom.json', JSON.stringify(customData));
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));
        });
        return;
    }

    //->请求的API接口地址并没有在服务器上进行处理,说明请求的地址错误
    res.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
    res.end('API ERROR!');
});
server1.listen(90, function () {
    console.log('server running,listening on 90 port!');
});