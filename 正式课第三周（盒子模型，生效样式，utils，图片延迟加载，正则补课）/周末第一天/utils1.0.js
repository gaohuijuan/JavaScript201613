var utils = {
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
    getCss :  function (ele,attr){
        var val = null;
        if('getComputedStyle' in window){
            val = window.getComputedStyle(ele)[attr];
        }else{
            if(attr == 'opacity'){
                val = ele.currentStyle['filter']; // alpha(opacity=50.5)
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        var reg = /^-?\d+(\.\d+)?(px|em|deg|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }
};


var utils = (function (){
    function getCss(){}
    function setCss(){}
    function win(){}
    function listToArray(){}
    function jsonParse(){}
    function offset(){

    }
    function getRandom(){
        offset();
        /*this.*/offset();
    }
    function setGroupCss(){

    }
    // ...
    return {
        getCss : getCss,
        //setCss : setCss,
        win : win,
        getRandom : getRandom,
        offset : offset
        // ...
    };
    //return getCss;
    //return setCss;
})();
utils.getRandom();


(function (){
     function getCss(){}
     function setCss(){}
    var utils = {getCss : getCss, setCss:setCss};
    window.utils = utils;
})();

// 作业

