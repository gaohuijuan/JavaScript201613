var utils = {
    win: function (attr, val) {
        if (typeof val !== 'undefined') { // scrollTop scrollLeft
            document.documentElement[attr] = val;
            document.body[attr] = val;
            return;
        }
        return document.documentElement[attr] || document.body[attr];
    },
    offset: function (element) {
        var l = null;
        var t = null;
        var parent = element.offsetParent;
        l += element.offsetLeft;
        t += element.offsetTop;
        while (parent) {
            if (window.navigator.userAgent.indexOf('MSIE 8') == -1) {
                l += parent.clientLeft;
                t += parent.clientTop;
            }
            l += parent.offsetLeft;
            t += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {left: l, top: t};
    },
    listToArray: function (likeAry) {
        try {
            return Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
            return ary;
        }
    },
    jsonParse: function (jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    },
    getRandom: function (n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var temp = n;
            n = m;
            m = temp;
            temp = null;
        }
        return Math.round(Math.random() * (m - n) + n);
    },
    getCss: function (ele, attr) {
        var val = null;
        if (window.getComputedStyle) {
            val = window.getComputedStyle(ele, null)[attr];
        } else { // for ie6-8
            if (attr == 'opacity') {
                val = ele.currentStyle.filter; // alpha(opacity=50.5)
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = ele.currentStyle[attr];
            }
        }
        // 200px -59.45px  0.9 ....   block
        var reg = /^-?\d+(\.\d+)?(px|pt|em|rem|deg)?$/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    },
    setCss: function (ele, attr, val) {
        if (attr === 'opacity') {
            ele.style.opacity = val;
            ele.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr === 'float') {
            ele.style.cssFloat = val; // 标准
            ele.style.styleFloat = val; // IE6-8
        }
        var reg = /^(width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?)$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        ele.style[attr] = val;
    },
    setGroupCss: function (ele, obj) {
        obj = obj || []; // 保证toString不报错
        if (obj.toString() == '[object Object]') {
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                setCss(ele, key, obj[key]);
            }
        }
    },
    getElesByClass : function (className,context){ // 'c1 c2'
        context = context || document;
        if(document.getElementsByClassName){
            return this.listToArray(context.getElementsByClassName(className));
        }
        //forie
        var ary = [];
        var classNameAry = className.replace(/(^ +| +$)/g,"").split(/ +/); // ['c1','c2']
        var eles = context.getElementsByTagName('*');
        for(var i=0; i<eles.length; i++){
            var curEle = eles[i]; // 每一个元素
            var isGoodEle = true;
            for(var j=0; j<classNameAry.length; j++){
                var curClass = classNameAry[j]; // 'c1'/'c2'...
                var reg = new RegExp("(^| +)"+curClass+"( +|$)");
                if(!reg.test(curEle.className)){
                    isGoodEle = false;
                    break; //只要有一个类名字验证没有通过,那么后面的其他类名字就没有必要继续验证了。
                }
            }
            if(isGoodEle){
                ary.push(curEle);
            }
        }
        return ary;
    }
};


