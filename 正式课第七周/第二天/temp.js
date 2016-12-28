var a = 12;
var b = 13;
a = a + b;//->a=25
b = a - b;//->b=12
a = a - b;//->a=13
console.log(a, b);

/*在这里用到LESS模块中的方法*/
var lC = require('less');
lC.render();//->render就是LESS模块中提供的一个方法