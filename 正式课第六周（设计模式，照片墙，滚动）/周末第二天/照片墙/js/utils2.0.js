var utils = (function () {
    var isStanderBrowser = !!document.getElementsByClassName;

    function listToArray(likeAry) {
        try {
            return Array.prototype.slice.call(likeAry);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < ary.length; i++) {
                ary.push(likeAry[i]);
            }
            return ary;
        }
    }

    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
    }

    function getRandom(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();
        }
        if (n > m) {
            var temp = m;
            m = n;
            n = temp;
        }
        return Math.round(Math.random(m - n) + n);
    }

    function offset(ele) {
        var l = null;
        var t = null;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while (par) {
            if (window.navigator.userAgent.indexOf('MSIE 8') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }

    function win(attr, val) {
        if (typeof val !== 'undefined') {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    function children(ele, tagName) {
        // chrome
        var ary = [];
        if (!/MSIE (6|7|8)/.test(window.navigator.userAgent)) {
            ary = listToArray(ele.children);
        } else {
            // ie6-8
            var childNodes = ele.childNodes; //ele的所有子节点。comment text  element   [text,comment,element...]
            for (var i = 0; i < childNodes.length; i++) {
                var curNode = childNodes[i];
                if (curNode.nodeType == 1) { // 1
                    ary.push(curNode);
                }
            }
        }
        if (typeof tagName == 'string') { // 在所有的元素子节点中过滤出tagName标签
            for (var i = 0; i < ary.length; i++) {
                //在所有的元素子节点中过滤标签名字是tagName的
                // [p,ul]   p
                if (ary[i].nodeName !== tagName.toUpperCase()) {
                    ary.splice(i, 1);
                    i--; //数组塌陷
                }
            }
        }
        return ary;
    }

    function prev(ele) {
        // 获取上一个哥哥元素节点
        if (ele.previousElementSibling) {
            return ele.previousElementSibling;
        }
        // previousSibling => 上一个哥哥节点，但是不一定是元素
        // 如果不是元素
        var prev = ele.previousSibling; //
        while (prev && prev.nodeType != 1) {
            prev = prev.previousSibling;
        }
        return prev;
    }

    function next(ele) {
        // 回去自己实现
    }

    function prevAll(ele) { // 获取所有的元素哥哥节点
        var ary = [];
        var pre = prev(ele); //先获取到一个元素哥哥节点 1 存在 2 null
        while (pre) {
            ary.unshift(pre); //保证顺序不乱
            pre = prev(pre);
        }
        return ary;

    }

    function nextAll(ele) {
        // 自己实现
    }

    function firstEleChild(ele) {
        // 先获取所有的元素子节点，那么所有元素子节点中索引0
        // 一个子节点都没有？？  null
    }

    function lastEleChild(ele) {
        //
    }

    function siblings(ele) {
        // 除了自己之外的所有兄弟元素 prevAll + nextAll
    }

    function sibling(ele) {
        // 获取相邻的两个元素 prev + next
        // prev 没有 ,next 没有
        // [null,null]
    }

    function index(ele) {
        // 获取ele的索引值
        return prevAll(ele).length;
    }

    function insertAfter(oldEle, newEle) {
        // 先获取弟弟
        // 如果弟弟存在那么直接插入到弟弟前面 => 都需要父级元素  parentNode
        // 如果弟弟不存在，说明你就是最后一个。appendChild =>
    }

    function hasClass(ele, strClass) {
        var reg = new RegExp('(^| +)' + strClass + '( +|$)');
        return reg.test(ele.className); // true/false
    }

    function addClass(ele, strClass) {
        var strClassAry = strClass.replace(/^ +| +$/g, '').split(/ +/);

        for (var i = 0; i < strClassAry.length; i++) {
            var curClass = strClassAry[i];
            if (!this.hasClass(ele, curClass)) {
                ele.className += ' ' + curClass;
            }
        }
    }

    function removeClass(ele, strClass) {
        var strClassAry = strClass.replace(/^ +| +$/g, '').split(/ +/);
        for (var i = 0; i < strClassAry.length; i++) {
            var curClass = strClassAry[i];
            while (this.hasClass(ele, curClass)) {
                var reg = new RegExp('(^| +?)' + curClass + '( +?|$)', 'g');
                ele.className = ele.className.replace(reg, '  ');
            }
        }
    }

    function getElesByClass(strClass, context) {
        context = context || document;
        var strClassAry = strClass.replace(/^ +| +$/g, '').split(/ +/);
        var tags = context.getElementsByTagName('*');
        var ary = [];
        for (var i = 0; i < tags.length; i++) {
            var curTag = tags[i];
            var curTagIsOk = true;
            for (var j = 0; j < strClassAry.length; j++) {
                var curClass = strClassAry[j];
                var reg = new RegExp('(^| +)' + curClass + ('( +|$)'));
                if (!reg.test(curTag.className)) {
                    curTagIsOk = false;
                    break;
                }
            }
            if (curTagIsOk) {
                ary.push(curTag);
            }
        }
        return ary;
    }

    function getCss(/*ele,*/ attr) {

        var val = null;
        if (window.getComputedStyle) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr == 'opacity') {
                var reg = /alpha\(opacity=(\d+(\.\d+)?)\)/;
                val = this.currentStyle.filter;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        var reg = /-?\d+(\.\d+)?(px|pt|em|rem|deg)?/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    }

    function setCss(/*ele,*/ attr, val) {
        if (attr == 'opacity') {
            this.style.opacity = val;
            this.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr == 'float') {
            this.style.cssFloat = val;
            this.style.styleFloat = val;
            return;
        }
        var reg = /width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        this.style[attr] = val;
    }

    function setGroupCss(/*ele,*/ obj) {
        obj = obj || [];
        if ((obj).toString() == '[object Object]') {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) { //保证是私有属性
                    setCss.call(this, key, obj[key]); // this=> ele
                }
            }
        }
    }

    function css(ele) { //根据参数的不同来调用不同的方法
        var secondParam = arguments[1]; // 第二个参数
        var thirdParam = arguments[2]; //第三个参数
        //var argumentsAry = listToArray(arguments).slice(1);
        if (typeof secondParam == 'string') { // setCss getCss
            if (typeof thirdParam == 'undefined') { //第三个参数没传
                //return getCss.apply(ele, argumentsAry);
                //return getCss.apply(ele, [secondParam]);
                return getCss.call(ele, secondParam);
                // arguments: [ele,'width']
            }
            //setCss.apply(ele, argumentsAry);
            //setCss.apply(ele, [secondParam, thirdParam]);
            setCss.call(ele, secondParam, thirdParam);
            // arguments : [ele,'width'300]
            return;
        }
        secondParam = secondParam || [];
        if(secondParam.toString() == '[object Object]'){
            //setGroupCss.apply(ele,argumentsAry);
            //setGroupCss.apply(ele,[secondParam]);
            setGroupCss.call(ele,secondParam);
            // arguments : [ele,{}]
        }
    }
    function css(ele){
        var secondParam = arguments[1];
        var thirdParam = arguments[2];
        if(typeof secondParam == 'string'){
            if(typeof thirdParam == 'undefined'){
                return getCss.call(ele,secondParam);
            }
            setCss.call(ele,secondParam,thirdParam);
        }
        secondParam = secondParam || [];
        if(secondParam.toString() == '[object Object]'){
            setGroupCss.call(ele,secondParam);
        }
    }




    return {
        listToArray: listToArray, // *
        win: win, // *
        jsonParse: jsonParse,
        getRandom: getRandom, // *
        offset: offset, // *
        //getCss: getCss, // *
        //setCss: setCss, // *
        //setGroupCss: setGroupCss, // *
        getElesByClass: getElesByClass, // *
        children: children, // *
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        firstEleChild: firstEleChild,
        lastEleChild: lastEleChild,
        sibling: sibling,
        siblings: siblings,
        index: index,
        hasClass: hasClass, // *
        addClass: addClass, // *
        removeClass: removeClass, // *
        insertAfter: insertAfter,
        css : css
    }
})();






