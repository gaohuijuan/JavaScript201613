/*window.banner = */(function (){
    function banner(/*$banner,*/url,duration){
        duration = duration || 2000;
        // 1 获取元素
        //var $banner = $('#banner');
        var $bannerInner = /*$banner*/this.children('.bannerInner');
        var $focusList = /*$banner*/this.find('.focusList');
        var $left = /*$banner*/this.find('a:first');
        var $right = /*$banner*/this.find('a:last');
// 以上都是存在的
// 对于使用jQuery获取不存在的dom结构,那么需要在dom结构发生改变的时刻重新获取
//var $imgs = $bannerInner.find('img');
        var $imgs = null;
//var $lis = $focusList.find('li');
        var $lis = null;
// 2 获取数据
        ;(function (){
            $.ajax({
                type : 'get',
                url : url/*'data.txt'*/+'?_='+Math.random(),
                dataType : 'json',
                //data : {},
                async : false,
                // cache : true,
                success : function (data) {
                    window.data = data;
                }
            });
        })();
        console.log(data); // [obj,obj...]
// 3 绑定数据
        ;(function bindData(){
            if(window.data){
                var str = ''; //图片
                var str1 = ''; //焦点
                $.each(data,function (index, item) {
                    // index : 0,1,2,3
                    // item : {"src":"images/1.jpg"} ...
                    str += '<div><img src="" realSrc="'+ item.src +'"></div>';
                    str1 += index == 0 ? '<li class="selected"></li>' : '<li></li>';
                });
                $bannerInner.html(str);
                $focusList.html(str1);
            }
        })();
// 4 图片有效验证

        ;(function imgsLazyLoad(){
            $imgs = $bannerInner.find('img');
            $lis = $focusList.find('li');
            //console.log($imgs);
            $imgs.each(function (index,item){
                // index : 0 1 2 3
                // item : img,img,img,img
                //var $tempImg = $('<img>');
                var tempImg = new Image();
                // attr prop
                $(tempImg).prop('src',$(item).attr('realSrc')).on('load',function (){
                    $(item).prop('src',$(this).prop('src'));
                    if(index == 0){
                        $(item).parent().css('zIndex',1).stop().animate({opacity:1},500);
                    }
                });
            });
        })();

// 5 轮播图
        var step = 0; // 用来记录当前哪一张图片应该显示
        var timer = window.setInterval(autoMove,/*2000*/duration);
        function autoMove(){
            step++; // 累加之后的值就是要显示的那一张图片
            if(step == /*4*/data.length){
                step = 0;
            }
            setImgFadeIn(); // 根据step的值来设置图片
        }
        function setImgFadeIn(){
            $imgs.each(function (index,item){
                if(step == index){ // step和索引值相等的那一张出现
                    $(item).parent().css('zIndex',1).stop().animate({opacity : 1},500,function () {
                        // 运动结束之后 => 透明度从0运动到1之后
                        // 回调函数中的this就是运动的那个元素
                        // 虽然获取的相邻的兄弟节点，可以不用循环设置样式。
                        $(this).siblings('div')/*3个div*/.css('opacity',0);
                    });
                }else{
                    $(item).parent().css('zIndex',0);
                }
            });

            $lis.each(function (index,item){
                index == step ? $(item).addClass('selected') : $(item).removeClass('selected');
            });
        }

        /*$banner*/this.on('mouseover',function (){
            $left.show();
            $right.show();
            window.clearInterval(timer);
        }).on('mouseout',function (){
            $left.hide();
            $right.hide();
            timer = window.setInterval(autoMove,/*2000*/duration);
        });

        $left.on('click',function (){
            step--; // --之后的值就是要显示的那一张图片
            if(step == -1){
                step = data.length-1;
            }
            setImgFadeIn(); // 根据step的值来设置图片
        });
        $right.on('click',autoMove);

        $lis.each(function (index,item){
            // item : li  li li li  $(this) $(item)
            item.index = index; // lis[i].index = i
            $(this).on('click',function (){
                step = this.index; //点击的时刻修改step的值修改成当前焦点的索引值
                setImgFadeIn(); //根据刚刚点击的那个焦点的索引值来设置图片
            });
        });



    }
    //return banner;
    //window.banner = banner;
    $.extend({
        banner : banner
    });

    $.fn.extend({
       banner : banner
    });


})();








