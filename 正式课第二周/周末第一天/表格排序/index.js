// 1 获取元素
var table = document.getElementById('table');
var thead = table.tHead; // 获取thead，这是js给表格提供的特殊的获取方式
var theadtr = table.rows[0]; // rows获取行,如果具体到某一行需要通过索引值
var ths = theadtr.cells; // cells就是获取所有的列
var tbody = table.tBodies[0]; // tBodies获取所有的tbody
var tbodytrs = tbody.rows; // tbody下所有的行



// 2 ajax : 负责发送一个请求到后台，后台负责把请求需要的数据准备好，并且返回

//var xhr1 = new XMLHttpRequest();
// get: 请求的方式,除了get和post。这是有区别的。后台提供
// data.txt: url 请求的路径(接口),请求的数据的位置。 后台提供
// false :  true 同步还是异步。异步居多。
// responseText : 响应文本，存放的就是获取回来的数据 => 这个数据也许需要再加工
var xhr = new XMLHttpRequest(); // xhr就是负责去后台获取数据的载体
xhr.open('get','data.txt',false);
xhr.onreadystatechange = function (){
    // 这是一个事件，只要有状态改变就会触发这个事件
    // console.log(xhr.readyState); //代表的xhr的状态，出发，到达，返回...
    if(xhr.readyState == 4 && xhr.status == 200){
        window.data = JSON.parse(xhr.responseText);
    }
}
xhr.send(null);
console.log(data); // [obj,obj,obj,obj]


// 3 获取到data之后我们就可以把data里的数据添加到页面中了
if(window.data){
    for(var i=0; i<data.length; i++){ //[obj,obj,obj,obj]
        var tr = document.createElement('tr');
        for(var key in data[i]){ // data[i]就是对象{country....}
            var td = document.createElement('td');
            if(key ==='developed'){
                td.innerHTML = data[i][key] == 0 ? '发展中' : '发达';
            }else{
                td.innerHTML = data[i]/*obj*/[key];
            }

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}
// 4隔行变色

function changeBg(){
    for(var i=0; i<tbodytrs.length; i++){
        tbodytrs[i].className = 'c' + i%2;
    }
}
changeBg();

// 5 排序
for(var i=0; i<ths.length; i++){
    ths[i].index = i; // 利用自定义属性把索引值保存下来
    ths[i].sortFlag = -1; // 给每个li添加一个自定义属性-1.
    if(ths[i].className == 'cursor'){
        ths[i].onclick = function (){
            this; // 点击的表头
            console.log(this.index);
            tablesort.call(this,this.index); // 把tablesort函数中的this修改成你点击的那个表头
            changeBg(); // 需要重新执行隔行变色
        }
    }
}

function tablesort(n){
    for(var i=0; i<ths.length; i++){
        if(ths[i] !== this){ // 点击的时候把不是this(点击的哪一个)的sortFlag全部设置成-1
            ths[i].sortFlag = -1;
        }
    }
    // 不许写循环，利用保存上一次的方式来处理这个问题
    console.log(this); // window 通过call => th(点击那个)
    var tbodytrsAry =  Array.prototype.slice.call(tbodytrs);
    // tbodytrsAry : [tr,tr,tr,tr,tr]
    this.sortFlag *= -1;
    var _this = this; // 把这个this保存下来，是给sort方法使用的。
    tbodytrsAry.sort(function (tr1,tr2){
        var _a = tr1.cells[n].innerHTML;
        var _b = tr2.cells[n].innerHTML;
        if(isNaN(_a) || isNaN(_b)){
            // 这里的this也不能使用，因为this被函数包含过就会变化。然后再上一级的this是可以使用的。所以我们使用上一级函数中的this。
            return (_a.localeCompare(_b))*_this.sortFlag;
        }
        return  (_a - _b)*_this.sortFlag;
    });

    for(var i=0; i<tbodytrsAry.length; i++){
        // 把排好序的数组重新回填到页面中
        tbody.appendChild(tbodytrsAry[i]);
    }
}





