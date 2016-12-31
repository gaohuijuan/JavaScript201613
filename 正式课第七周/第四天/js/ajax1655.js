function ajax(options) {
    //->init parameter
    var _default = {
        url: null,
        type: 'get',
        dataType: 'text',
        data: null,
        async: true,
        cache: true,
        success: null,
        error: null,
        header: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->send ajax
    var xhr = new XMLHttpRequest;
    /*
     * 处理DATA
     * 1、判断之前的URL中是否存在问号,从而判断出连在URL末尾的符号
     * 2、处理GET请求和POST请求的区别
     */
    var isMark = _default.url.indexOf('?') >= 0 ? true : false,
        mark = isMark ? '&' : '?';
    var regGet = /^(get|delete|head)$/i;
    if (_default.data) {
        if (regGet.test(_default.type)) {//->GET
            _default.data = formatData(_default.data);
            _default.url += mark + _default.data;
            _default.data = null;
        } else {//->POST
            _default.data = JSON.stringify(_default.data);//->JSON.stringify这个方法不兼容,所以我们自己还需要写一个方法实现这个处理(思考题)
        }
    }

    /*
     * 处理缓存问题(GET+CACHE为FALSE)
     */
    if (regGet.test(_default.type) && _default.cache === false) {
        isMark = _default.url.indexOf('?') >= 0 ? true : false;
        mark = isMark ? '&' : '?';
        _default.url += mark + '_=' + Math.random();
    }
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (/^(?:2|3)\d{2}$/.test(xhr.status)) {
            //->GET RESPONSE HEADER
            if (xhr.readyState === 2) {
                var serverTime = xhr.getResponseHeader('Date');
                serverTime = new Date(serverTime);
                _default.header && _default.header.call(xhr, serverTime);
            }

            //->GET RESPONSE BODY
            if (xhr.readyState === 4) {
                //->通过responseText从服务器端获取的数据都是字符串的格式的,而且服务器一般给我们客户端返回的数据也都是字符串格式的(JSON字符串/XML字符串);而我们预设的DATA TYPE其实就是为了把从服务器获取的字符串转换解析为有助于开发的JSON格式的对象或者XML格式的对象(TEXT、JSON、XML);
                //->面试题:
                //JQ中AJAX配置的dataType属性是控制服务器返回的数据类型吗?
                //通过AJAX在服务器端获取的数据都有哪些格式?
                _default.dataType = _default.dataType.toUpperCase();
                var val = xhr.responseText;
                switch (_default.dataType) {
                    case 'JSON':
                        val = 'JSON' in window ? JSON.parse(val) : eval('(' + val + ')');
                        break;
                    case 'XML':
                        val = xhr.responseXML;
                        break;
                }
                _default.success && _default.success.call(xhr, val);
            }
            return;
        }
        //->ERROR
        _default.error && _default.error.call(xhr, {
            status: xhr.status,
            statusText: xhr.statusText
        });
    };
    xhr.send(_default.data);//->我们在请求主体中传递给服务的数据内容一般都是JSON格式的字符串
}


//->把一个对象中的属性名和属性值最后变为一个用&连接的字符串,例如:{name:'zf',age:8,teacher:'zxt'} => 'name=zf&age=8&teacher=zxt'
function formatData(obj) {
    if (({}).toString.call(obj) !== '[object Object]') {
        return;
    }
    var result = '';
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result += key + '=' + obj[key];
            result += '&';
        }
    }
    result = result.substr(0, result.length - 1);//->去掉最后一个多余的&
    return result;
}