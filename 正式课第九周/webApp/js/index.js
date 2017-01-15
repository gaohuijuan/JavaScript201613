~function (pro) {
    function myFormatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var _this = this,
            ary = _this.match(/\d+/g);
        template = template.replace(/\{(\d)\}/g, function () {
            return (ary[arguments[1]] || '00').length < 2 ? '0' + ary[arguments[1]] : ary[arguments[1]];
        });
        return template;
    }

    pro.myFormatTime = myFormatTime;
}(String.prototype);

/*
 * 头部MENU区域的相关操作
 *  - 点击MENU按钮控制NAV的显示隐藏
 */
var menuRender = (function () {
    var $menu = $('#menu'),
        $nav = $('#nav');

    return {
        init: function () {
            $menu.tap(function () {
                if ($nav.attr('isBlock') === 'true') {
                    //->当前是展开的,我们让NAV收起即可
                    $nav.css({
                        padding: 0,
                        height: 0
                    }).attr('isBlock', false);
                    return;
                }

                //->控制NAV展示:改变高度和PADDING值即可(动画使用TRANSITION)
                $nav.css({
                    padding: '.1rem 0',
                    height: '2.22rem'
                }).attr('isBlock', true);
            });
        }
    }
})();
menuRender.init();

/*
 * MATCH区域的相关操作
 *  - 通过JSONP从服务器端获取数据
 */
var matchRender = (function () {
    var $matchPlan = $.Callbacks(),
        $match = $('#match');
    var $progress = null,
        $supportLeft = null,
        $supportRight = null;
    var isTap = false;

    //->实现数据绑定
    $matchPlan.add(function (matchInfo) {
        var $matchTemplate = $('#matchTemplate'),
            template = $matchTemplate.html();
        var result = ejs.render(template, {matchInfo: matchInfo});
        $match.html(result);

        $progress = $('#progress');
        $supportLeft = $('#supportLeft');
        $supportRight = $('#supportRight');
    });

    //->计算支持数的比例
    $matchPlan.add(computed);
    function computed(matchInfo) {
        var n = parseFloat($supportLeft.html()),
            m = parseFloat($supportRight.html());
        $progress.css('width', (n / (n + m)) * 100 + '%');
    }

    //->支持处理
    $matchPlan.add(function (matchInfo) {
        //->验证本地是否有支持存储的信息,有的话就不能在支持了
        var support = localStorage.getItem('support');
        if (support) {
            support = JSON.parse(support);
            support.type == 1 ? $supportLeft.addClass('bg') : $supportRight.addClass('bg');
            return;
        }

        //->相当于分被给左右两个按钮绑定同一个方法
        $supportLeft.add($supportRight).tap(function () {
            if (isTap) return;

            var type = $(this).hasClass('left') ? 1 : 2,
                that = this;
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=8:855375&type=' + type,
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result.code == 0) {
                        //->支持成功
                        $(that).addClass('bg')
                            .html($(that).html() * 1 + 1);
                        isTap = true;
                        computed();

                        //->本地存储
                        localStorage.setItem('support', JSON.stringify({
                            isTap: true,
                            type: type
                        }));
                    }
                }
            });
        });
    });

    return {
        init: function () {
            //->GET DATA
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=8:855375',
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    //->真实项目中,我们从服务器端获取的数据并不一定是我们想要的格式,我们还需要自己进行进一步的加工处理,把其变为自己所需要的=>"数据的格式化"
                    if (result && result[0] == 0) {
                        result = result[1];
                        var matchInfo = result['matchInfo'];
                        matchInfo.leftSupport = result['leftSupport'];
                        matchInfo.rightSupport = result['rightSupport'];

                        //->通知计划中的方法执行:并且把获取的数据传递给每一个方法
                        $matchPlan.fire(matchInfo);
                    }
                }
            });
        }
    }
})();
matchRender.init();

/*
 * 视频集锦区域的处理
 *  - 数据绑定
 *  - 局部滚动
 */
var playRender = (function () {
    var $playPlan = $.Callbacks(),
        $player = $('#player'),
        $wrapper = $player.find('.wrapper');

    //->数据绑定
    $playPlan.add(function (playList) {
        var template = $('#playTemplate').html(),
            result = ejs.render(template, {playList: playList});
        $wrapper.html(result).css('width', playList.length * 2.4 + 0.3 + 'rem');
    });

    //->实现局部滚动
    $playPlan.add(function () {
        new IScroll('#player', {
            scrollX: true,
            scrollY: false
        });
    });

    return {
        init: function () {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchStatV37?mid=8:855375',
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1];
                        result = result['stats'];

                        var playList = null;
                        $.each(result, function (index, item) {
                            if (item.type == 9) {//->集锦
                                playList = item.list;
                                return false;//->结束EACH循环
                            }
                        });

                        $playPlan.fire(playList);
                    }
                }
            });
        }
    }
})();
playRender.init();