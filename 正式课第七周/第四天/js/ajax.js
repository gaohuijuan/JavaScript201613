/*--封装属于我们自己的AJAX方法库--*/
/*function ajax(type, url, async, data, error, header, success, dataType, cache) {
 var xhr = new XMLHttpRequest;
 xhr.open('', '', true);
 xhr.onreadystatechange = function () {
 if (/^(?:2|3)\d{2}$/.test(xhr.status)) {
 if (xhr.readyState === 2) {
 var time = new Date(xhr.getResponseHeader('Date'));
 header(time);
 }
 if (xhr.readyState === 4) {
 var val = xhr.responseText;
 success(val);
 }
 return;
 }
 //->失败

 };
 xhr.send();
 }*/

/*用形参的方式定义方法库是非常不明智的选择*/
//->这样定义形参的话,不能出现任何不传递的,只要有一个不传递,后面的都要往前错一位
//->顺序不能变
//->以后升级加参数,我们在函数体中还需要在去处理
//....
/*
 ajax('get', 'temp.xml', {});*/

/*以对象的方式定义*/
//->传递顺序随意而且可以给一些属性设定默认值,如果需要使用默认值的话,我们可以不传
/*ajax({
 url: 'xxx.txt',
 type: 'get',
 async: true
 });*/

/*
 * initDefaultParameter:初始化默认的参数信息,用最新传递进来的值覆盖原有的默认值
 * @parameter:
 *    newOption:[obj] 新传递过来的参数集合
 *    defaultOption:[obj] 原来默认的参数集合
 * @return:
 *    [obj]替换后的最新的参数集合
 */
function initDefaultParameter(newOption, defaultOption) {
    for (var key in newOption) {
        if (newOption.hasOwnProperty(key)) {
            defaultOption[key] = newOption[key];
        }
    }
    return defaultOption;
}

function ajax(option) {
    //->init parameter
    option = initDefaultParameter(option, {
        url: null,
        type: 'get',
        dataType: 'text',//->text、json、xml
        data: null,
        async: true,
        cache: true,
        //->后面的三个都是回调函数：成功、失败、响应头已经接收
        success: null,
        error: null,
        header: null
    });

    //->send ajax
    var xhr = new XMLHttpRequest;
    xhr.open(option.type, option.url, option.async);
    xhr.onreadystatechange = function () {
        if (/^(?:2|3)\d{2}$/.test(xhr.status)) {
            if (xhr.readyState === 2) {
                var time = new Date(xhr.getResponseHeader('Date'));
                typeof option.header === 'function' ? option.header.call(xhr, time) : null;
            }
            if (xhr.readyState === 4) {
                var val = xhr.responseText;
                option.success && option.success.call(xhr, val);//->这样写需要保证使用者要不然不传,传递的话一定需要是一个回调函数才可以
            }
            return;
        }
        //->ERROR
        option.error && option.error.call(xhr, {
            status: xhr.status,
            statusText: xhr.statusText
        });
    };
    xhr.send();
}

ajax({
    header: function (time) {
        //->this=xhr this.getResponseHeader
        //->time:从服务器返回的响应头中获取的时间(北京时间)
    },
    error: function (msg) {
        //->msg.status
        //->msg.statusText
    }
});


