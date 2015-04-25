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


/***
 * Автаматичиская ручка
 * @param color - цвет задается как в css так "#000000" либо так "blue"
 * @constructor
 */

function AutomaticPen(color) {
    Pen.apply(this, arguments);
    this.turnOn = false;
    this.turn = function () {
        return this.turnOn = !this.turnOn;
    };
}

AutomaticPen.prototype = Object.create(Pen.prototype);
AutomaticPen.prototype.constructor = AutomaticPen;


AutomaticPen.prototype.writeText = function (text) {
    if (this.turnOn) {
        Pen.prototype.writeText.apply(this, arguments);
    } else {
        console.log("Your writing tool is turned off, and it can't write");
    }
    return this;
};


/***
 * Механический карандаш (цветной, так как цвет не указан)
 * @param color - цвет задается как в css так "#000000" либо так "blue"
 * @constructor
 */

function MechanicalPencil(color) {
    AutomaticPen.apply(this, arguments);
    this.writtenText = "";
}
MechanicalPencil.prototype = Object.create(AutomaticPen.prototype);
MechanicalPencil.prototype.constructor = MechanicalPencil;

MechanicalPencil.prototype.erasable = true;
MechanicalPencil.prototype.writeText = function (text) {
    var oldInkLevel = this.inkValue;
    AutomaticPen.prototype.writeText.apply(this, arguments);
    var difference = oldInkLevel - this.inkValue;

    if (difference !== 0) {
        if (text.length > difference) {
            this.writtenText = text.slice.apply(0, difference);
        } else {
            this.writtenText = text;
        }
    }
    // return this;
};
/***
 * Удаляет промежутки написаного текста
 * @param start - начиная с этого символа
 * @param stop - заканчуя этим
 */

MechanicalPencil.prototype.erasWrittenText = function (start, stop) {
    if (this.erasable) {
        if (this.writtenText.length > 0 && (stop < this.writtenText.length)) {
            var tmp = this.writtenText;
            var empty = " ";
            for (var i = start; stop > i; i++) {
                empty = empty + " ";
            }
            this.writtenText = tmp.substring(0, start) + empty + tmp.substring(stop + 1);
            //console.log("%c" + this.writtenText, "color : " + this.color);
            colorfulConsole(this.writtenText,this.color);
        } else {
            console.log("Wright something and then eras text");
        }
    } else {
        console.log("You can't eras this text");
    }
    return this;
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


console.log("\n==========AutomaticPen========");

var ap = new AutomaticPen("green");
console.log("Is Pen a prototype of AutomaticPen? "+Pen.prototype.isPrototypeOf(ap));
testSupply(ap, 10);
ap.turn();
testSupply(ap, 10);
ap.rechargeInk();
testSupply(ap, 2);

console.log("\n==========MechanicalPencil========");

var apl = new MechanicalPencil("grey");
console.log("Is AutomaticPen a prototype of MechanicalPencil? "+AutomaticPen.prototype.isPrototypeOf(apl));
testSupply(apl, 10);
apl.turn();
testSupply(apl, 10);
apl.rechargeInk();
testSupply(apl, 2);
apl.erasWrittenText(5, 10);
