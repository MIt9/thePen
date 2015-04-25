/**
 * Created by Dmitriy Bilukha on 25.04.2015.
 */

function colorfulConsole(text,color){
    console.log("%c" + text, "color : " + color);
}
/***
 * Модель простой ручки
 * @param color - цвет задается как в css так "#000000" либо так "blue"
 * @constructor
 */

function Pen(color) {
    this.color = color;
    this.inkValue = 100; //количество пасты
    this.rechargeInk = function () {
        this.inkValue = 100;
    };
}//end Pen constructor

Pen.prototype.writeText = function (text) {
    if (this.inkValue > 0) {
        colorfulConsole(text.slice(0, this.inkValue),this.color);
        this.inkValue -= text.length;
        if (this.inkValue === 0) {
            console.log("Your writing tool is empty, recharge it");
        }
    } else {
        console.log("Your writing tool is empty, recharge it")
    }
};
//======================Test===========================


function testSupply(it, times) {
    for (var i = 0; times > i; i++) {
        it.writeText("Good by brutal world !!!");
    }
}

console.log("================Pen=============");
var pen = new Pen("blue");
testSupply(pen, 10);
pen.rechargeInk();
testSupply(pen, 2);
