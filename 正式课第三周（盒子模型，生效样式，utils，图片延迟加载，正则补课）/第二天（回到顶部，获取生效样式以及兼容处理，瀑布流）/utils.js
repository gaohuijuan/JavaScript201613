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
    getCss : function (ele,attr){
        var val = null;
        if(window.getComputedStyle){
            val =  window.getComputedStyle(ele,null)[attr];
        }else{ // for ie6-8
            if(attr == 'opacity'){
                val = ele.currentStyle.filter; // alpha(opacity=50.5)
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        // 200px -59.45px  0.9 ....   block
        var reg = /^-?\d+(\.\d+)?(px|pt|em|rem|deg)?$/;
        if(reg.test(val)){
            val = parseFloat(val);
        }
        return val;
    }
};
// clientWidth, clientHeight, offsetWidth, offsetHeight
// clientLeft, clientTop
// offsetWidth-clientWidth-clientLeft
// scrollWidth scrollHeight scrollTop scrollLeft
