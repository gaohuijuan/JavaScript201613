function fn(){}
function fn1(){}
fn();
fn1();
/////////带薪年假////////////
function fn(){}
function fn1(){}
var tianxi = {
    fn : function (){
        this.fn1(); // tianxi
    },
    fn1 : function (){
        console.log(this); //
        this.fn();
    }
};
tianxi.fn();
tianxi.fn1();

/////////////带薪年假////////////
var zhangwen = {
    fn : function (){},
    fn1 : function (){}
};


zhangwen.fn();
zhangwen.fn1();




