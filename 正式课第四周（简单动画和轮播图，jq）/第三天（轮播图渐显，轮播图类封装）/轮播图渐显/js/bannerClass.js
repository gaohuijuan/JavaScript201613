// 容器: container  接口: url=> data.txt
// 利用公有方法去操作私有属性

function Banner(container,url,interval){
    this.banner = container; // container => banner
    this.bannerInner = utils.getElesByClass('bannerInner', this.banner)[0];
    this.focusList = utils.getElesByClass('focusList', this.banner)[0];
    this.left = utils.children(this.banner, 'a')[0];
    this.right = utils.children(this.banner, 'a')[1];
    this.imgs = this.bannerInner.getElementsByTagName('img');
    this.lis = this.focusList.getElementsByTagName('li');
    this.url = url;
    this.data = null;
    this.step = 0;
    this.timer = null;
    this.isOkClick = true;
    this.interval = interval || 2000;
    this.init(); // 只有这个函数执行结束之后才有轮播图呢
}
Banner.prototype.getData = function (){
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.url + '?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
           that.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
}
Banner.prototype.bindData = function (){
    if (this.data) {
        var str = '';
        var str1 = '';
        for (var i = 0; i < this.data.length; i++) {
            str += '<div><img src="" realSrc="'+ this.data[i].src +'"></div>';
            str1 += i == 0 ? '<li class="selected"></li>' : '<li></li>';
        }
        this.bannerInner.innerHTML = str;
        this.focusList.innerHTML = str1;
    }
}
Banner.prototype.imgsDelayLoad = function (){
    var that = this;
    for(var i=0; i<this.imgs.length; i++){
        var tempImg = document.createElement('img');
        tempImg.index = i;
        tempImg.src = this.imgs[i].getAttribute('realSrc');
        tempImg.onload = function (){
            that.imgs[this.index].src = this.src;
            if(this.index == 0 ){
                utils.css(that.imgs[0].parentNode,'zIndex',1);
                animate({
                    ele : that.imgs[0].parentNode,
                    target : {opacity : 1},
                    duration : 500
                });
            }
        }
    }
}
Banner.prototype.autoMove = function (){
    this.step++;
    if(this.step == this.data.length){
        this.step = 0;
    }
    this.setImg();
}
Banner.prototype.setImg = function (){
    var that = this;
    for(var i=0; i<this.imgs.length; i++){
        if(i === this.step){
            utils.css(this.imgs[i].parentNode,'zIndex',1);
            animate({
                ele :  this.imgs[i].parentNode,
                target : { opacity : 1 },
                duration : 500,
                callback : function (){
                    var otherDivs = utils.siblings(this);

                    for(var i=0; i<otherDivs.length; i++){
                        utils.css(otherDivs[i],'opacity',0);
                    }
                    that.isOkClick = true;
                }
            });
        }else{
            utils.css(this.imgs[i].parentNode,'zIndex',0);
        }
    }
    for(var i=0; i<this.lis.length; i++){
        this.lis[i].className = i == this.step ? 'selected' : '';
    }
}
Banner.prototype.mouseEvent = function (){
    var that = this;
    this.banner.onmouseover = function (){
        window.clearInterval(that.timer);
        that.left.style.display = that.right.style.display = 'block';
    }
    this.banner.onmouseout = function (){
        // 这个定时器中this是window。然后我们必须保证autoMove方法中的this是实例。所以我们给autoMove方法包装了一个匿名函数。然后匿名函数中的this是window。但是在匿名函数中执行 实例.autoMove , autoMove方法中的this就是实例啦。
        that.timer = window.setInterval(function (){
            // this => window
            that.autoMove();
        },2000);
        that.left.style.display = that.right.style.display = 'none';
    }
}
Banner.prototype.buttonClick = function (){
    var that = this;
    this.right.onclick = function (){
        if(that.isOkClick){
            that.autoMove();
            that.isOkClick = false;
        }
    };
    this.left.onclick = function (){
        if(that.isOkClick){
            that.step--;
            if(that.step == -1){
                that.step = that.data.length-1;
            }
            that.setImg();
            that.isOkClick = false;
        }
    };
}
Banner.prototype.focusClick = function (){
    var that = this;
    for(var i=0; i<this.lis.length; i++){
        this.lis[i].index = i;
        this.lis[i].onclick = function (){
            that.step = this.index;
            that.setImg();
        }
    }
}
Banner.prototype.init = function (){
    // 初始化 => 负责按照顺序执行这些函数
    var that = this;
    this.getData();
    this.bindData();
    this.imgsDelayLoad();
    this.timer = window.setInterval(function (){
        that.autoMove();
    },this.interval);
    this.mouseEvent();
    this.buttonClick();
    this.focusClick();
}





















