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


/***
 * авторучка с множеством паст (разноцветных)
 * @param colorArray - масив цветов ["blue", "#000000", "green"]
 * @constructor
 */
function MultiColorPen(colorArray) {
    MechanicalPencil.apply(this, arguments);
    this.colorArray = colorArray;
    this.inkValueArray = [100];
    this.currentColor = 0;
    this.color = this.colorArray[this.currentColor];

}

MultiColorPen.prototype = Object.create(MechanicalPencil.prototype);
MultiColorPen.prototype.constructor = MultiColorPen;

MechanicalPencil.prototype.erasable = false;
MultiColorPen.prototype.switchColor = function () {
    var tmpNum = this.currentColor;
    if (this.colorArray.length >= tmpNum + 1) {
        tmpNum++;
    } else {
        tmpNum = 0;
    }
    if (this.inkValueArray[tmpNum] === undefined) {
        this.inkValueArray.push(100);
    }
    this.inkValueArray[this.currentColor]=this.inkValue;
    this.currentColor = tmpNum;
    this.color = this.colorArray[this.currentColor];
    this.inkValue = this.inkValueArray[this.currentColor];
    colorfulConsole("You select " + this.color + " color",this.color);
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
console.log("Is Pen a prototype of MechanicalPencil? "+Pen.prototype.isPrototypeOf(apl));
testSupply(apl, 10);
apl.turn();
testSupply(apl, 10);
apl.rechargeInk();
testSupply(apl, 2);
apl.erasWrittenText(5, 10);

console.log("\n==========MultiColorPen========");

var mcp = new MultiColorPen(["blue", "brown", "green"]);
console.log("Is MechanicalPencil a prototype of MultiColorPen? "+MechanicalPencil.prototype.isPrototypeOf(mcp));
console.log("Is AutomaticPen a prototype of MultiColorPen? "+AutomaticPen.prototype.isPrototypeOf(mcp));
console.log("Is Pen a prototype of MultiColorPen? "+Pen.prototype.isPrototypeOf(mcp));
mcp.writeText("hi gays");
testSupply(mcp, 10);
mcp.turn();

testSupply(mcp, 10);
mcp.switchColor();
testSupply(mcp, 10);
mcp.switchColor();
testSupply(mcp, 10);

mcp.rechargeInk();
mcp.switchColor();
mcp.switchColor();
mcp.switchColor();

testSupply(mcp, 5);
mcp.switchColor();
mcp.rechargeInk();
testSupply(mcp, 3);
mcp.erasWrittenText(5, 10);