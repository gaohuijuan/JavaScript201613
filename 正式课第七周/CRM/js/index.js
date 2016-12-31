var content = document.getElementById('content');
ajax({
    url: '/getAllList',
    type: 'get',
    dataType: 'json',
    cache: false,
    async: true,
    success: function (result) {
        if (result && result.code == 0) {
            var data = result['data'];

            //->数据绑定
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var cur = data[i];
                str += '<li>';
                str += '<span>' + cur.id + '</span>';
                str += '<span>' + cur.name + '</span>';
                str += '<span>';
                str += '<a href="">修改</a>';
                str += '<a href="">删除</a>';
                str += '</span>';
                str += '</li>';
            }
            content.innerHTML = str;
        }
    }
});