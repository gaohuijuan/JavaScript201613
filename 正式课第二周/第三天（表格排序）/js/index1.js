/**
 * Created by lucky on 2016/11/24.
 */
// 1 获取元素
var tab = document.getElementById('tab'); // null
var ths = tab.tHead.rows[0].cells;
var tBody = tab.tBodies[0];
var tBodyRows = tBody.rows;
var data = null;

// 2 ajax 获取数据
;(function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt', false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
})();

// 3 数据绑定 把数据添加到页面中
console.log(data);
;(function bindData() {
    if (data && data.length) {
        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr');
            for (var key in data[i]) {
                var td = document.createElement('td');
                if (key === 'develop') {
                    td.innerHTML = data[i][key] == 0 ? '发展中' : '发达';
                } else {
                    td.innerHTML = data[i][key];
                }
                tr.appendChild(td);
            }
            tBody.appendChild(tr);
        }
    }
})();

// 4 隔行变色
function changeBg() {
    for (var i = 0; i < tBodyRows.length; i++) {
        tBodyRows[i].className = 'c' + i % 2;
    }
}
changeBg();

// 5 绑定事件(th)
;(function bindEvent() {
    for (var i = 0; i < ths.length; i++) {
        ths[i].index = i;
        ths[i].sortFlag = -1;
        if (ths[i].className == 'cursor') {
            ths[i].onclick = function () {
                tableSort.call(this, this.index);
                changeBg();
            }
        }
    }
})();

// 6 排序函数
function tableSort(n) {
    for (var i = 0; i < ths.length; i++) {
        if (ths[i] !== this) {
            ths[i].sortFlag = -1;
        }
    }
    var tBodyRowAry = /*Array.prototype*/[].slice.call(tBodyRows);
    this.sortFlag *= -1;
    var that = this;
    tBodyRowAry.sort(function (tr1, tr2) {
        var _a = tr1.cells[n].innerHTML;
        var _b = tr2.cells[n].innerHTML;
        if (isNaN(_a) || isNaN(_b)) {
            return (_a.localeCompare(_b)) * that.sortFlag;
        }
        return (_a - _b) * that.sortFlag;
    });
    for (var i = 0; i < tBodyRowAry.length; i++) {
        tBody.appendChild(tBodyRowAry[i]);
    }
}



