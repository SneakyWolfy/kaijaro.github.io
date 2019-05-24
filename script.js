//Q1
"use strict";

var $ = function(id) {
    return document.getElementById(id);
};

var calculateMpg = function(miles, gallons) { 
    var mpg = (miles / gallons);
    mpg = mpg.toFixed(1);
    return mpg;
};

var clearEntries = function() {
    $("miles").value = ''
    $("gallons").value = ''
    $("mpg").value = ''
}

var processEntries = function() {
    var miles = parseFloat($("miles").value);
    var gallons = parseFloat($("gallons").value);
    if (isNaN(miles)){
        alert("Miles must be numeric");
        $("miles").focus();
    } else if (miles <= 0){
        alert("Miles must be greater than zero")
        $("miles").focus();
    } else if (isNaN(gallons)){
        alert("Gallons must be numeric");
        $("gallons").focus();
    } else if (gallons <= 0){
        alert("Gallons must be greater than zero")
        $("gallons").focus();
    } else {
        $("mpg").value = calculateMpg(miles, gallons);
    }

    /*
    if (isNaN(miles) || isNaN(gallons)) {
        alert("Both entries must be numeric");
    } else if (miles <= 0 || gallons <= 0) {
        alert("Both entries must be greater than zero");
    }
    else {
        $("mpg").value = calculateMpg(miles, gallons);
    }
    */
};

//q2

var calcFV = (investment,rate,years) => {
    //from figure 3.7
    var futureValue = investment; for (var i = 1; i <= years; i++ ) {
        futureValue = futureValue + (futureValue * rate / 100); 
    } 
    return parseInt(futureValue)
}
var processInput = () => {
    var message = -1;
    var investment = parseFloat($("investment").value);
    var rate = parseFloat($("rate").value);
    var years = parseFloat($("years").value);

    if (investment > 10000 || investment <= 0){
        message = "Investment must be a value from 0 to 10,000.";
        $("investment").focus()
    } else if (rate > 15 || rate <= 0){
        message = "Rate must be a value from 0 to 15."
        $("rate").focus()
    } else if (years > 50 || years <= 0){
        message = "Years must be a value from 0 to 50."
        $("years").focus()
    } 

    if (isNaN(message)){
        alert(message);      
    } else {
        $("future_value").value = calcFV(investment,rate,years)
    }
    

    




}
//load events
window.onload = function(){
    $("calculate").onclick = processEntries;
    
    console.log('wdw')
    clearEntries();

    $("fvCalculate").onclick = processInput;

    var button1 = document.getElementById('q1');
    var button2 = document.getElementById('q2');
    var c = 'rgb(45.115384615384585, 5.88461538461538, 46.09615384615381)'
    button1.style.backgroundColor = c;
    button2.style.backgroundColor = c;
 
    button1.addEventListener("mouseover",handleHoverEvent);
    button1.addEventListener("mouseleave",handleLeaveEvent);
    button2.addEventListener("mouseover",handleHoverEvent);
    button2.addEventListener("mouseleave",handleLeaveEvent);

    button1.addEventListener("click",handleClick1);
    button2.addEventListener("click",handleClick2);
}

//events

function setHSL(obj,h,s,l){
    var rgb=toRGB(h,s,l)
    obj.style.backgroundColor='rgb('+rgb.red+', '+rgb.green+', '+rgb.blue+')'
}

function handleHoverEvent(){
    lumShift(this,.3,100,'h') 
}

function handleClick1(){
    unload()
    this.style.borderBottom = "solid .5rem aliceblue";
    document.getElementById('mpgBlock').style.display = 'block';
    $("miles").focus();
}
function handleClick2(){
    unload()
    this.style.borderBottom = "solid .5rem aliceblue";
    document.getElementById('fvcBlock').style.display = 'block';
    $("investment").focus();

}

function handleLeaveEvent(){
    lumShift(this,.1,100,'l')
}

function unload(){
    document.getElementById('q1').style.borderBottom = "";
    document.getElementById('q2').style.borderBottom = "";
    document.getElementById('mpgBlock').style.display = 'none';
    document.getElementById('fvcBlock').style.display = 'none';
}

////
/// color functions (ignore these)
//

function lumShift (obj, val, rate, type) {
    clearInterval(interval)
    var color = obj.style.backgroundColor.slice(4,-1).split(", ");
    var red=parseFloat(color[0]);
    var green=parseFloat(color[1]);
    var blue=parseFloat(color[2]);
    
    var hsl = toHSL(red,green,blue)
    
    var delta = Math.abs(val-hsl.lum)

    //rate 100;.1lum/s
    //time in ms
    var time = (delta*100000)/rate;
    var hz=40;
    var repeats = parseInt(time/hz);
    var shiftval = (val-hsl.lum)/repeats;
    var out = hsl.lum;
    var i = 0;
    var interval = setInterval(shift, hz)
    function shift(){
        i++;
        out += shiftval;
        setHSL(obj,hsl.hue,hsl.sat,out)
        
        if (i >= repeats){
            clearInterval(interval);  
        }
    }
    switch (type){
        case 'h':
            obj.addEventListener('mouseleave', function(){
                clearInterval(interval)
                })
        case 'l':
            obj.addEventListener('mouseover', function(){
            clearInterval(interval)
            })
    }
}

function toHSL(r,g,b){  
    
    //breaks rgb into light levels 
    function getHigh(arr) {
        let high = -1;
        let med = -1;
        let low = -1;
        for (var val of arr){           
            val = parseInt(val)
            if (high<val){
                low = med;
                med = high;
                high = val;
            } else if (med<val){
                low = med;
                med = val;
            } else {
                low = val;
            }
        }
        return{
            high:high,
            tone:med,
            base:low
        }
    }
    var colorHSL=getHigh([r,g,b])

    //matches rgb colors with it's light level to find hue level
    switch (r){
        case colorHSL.base:
            colorHSL.red = 0;
            break;
        case colorHSL.tone:
            colorHSL.red = 1;
            break;
        case colorHSL.high:
            colorHSL.red = 2;
            break;
    } switch (g){
        case colorHSL.base:
            colorHSL.green = 0;
            break;
        case colorHSL.tone:
            colorHSL.green = 1;
            break;
        case colorHSL.high:
            colorHSL.green = 2;
            break;
    } switch (b){
        case colorHSL.base:
            colorHSL.blue = 0;
            break;
        case colorHSL.tone:
            colorHSL.blue = 1;
            break;
        case colorHSL.high:
            colorHSL.blue = 2;
            break;
    }

    //calucating lum and sat from properties of the highest and dim color
    var lum = (colorHSL.high+colorHSL.base)/(255*2)
    var sat = Math.abs(colorHSL.high-colorHSL.base)/Math.abs(Math.abs(-255+lum*510)-255)
    
    //finding the domain of the brigtest and most dim color
    var upperbound = 255;
    var lowerbound = 0;
    if (lum<.5){
        upperbound=lum*510;
    } else if (lum>.5) {
        lowerbound=lum*510-255;
    }
    
    //applying varibles depending on what rbg values are bighter than other to find hue
    var offset;
    var direction;
    var sign;
    switch (colorHSL.red.toString()+colorHSL.green.toString()+colorHSL.blue.toString()){
        case '210':
            offset=0
            direction=0
            sign=1
            break;
        case '120':
            offset=0
            direction=120
            sign=-1
            break;
        case '021':
            offset=120
            direction=0
            sign=1
            break;
        case '012':
            offset=120
            direction=120
            sign=-1
            break;
        case '102':
            offset=240
            direction=0
            sign=1
            break;
        case '201':
            offset=240
            direction=120
            sign=-1
            break;
    }

    //calucating hue
    var lumCenter = 255*lum;
    var normalizedHue = lumCenter+(colorHSL.tone-lumCenter)/sat
    var hueShift=(normalizedHue/(upperbound-lowerbound))*60
    var hue = (direction+hueShift*sign)+offset

    return {
        lum:lum,
        sat:sat,
        hue:hue
    }
}

function toRGB(hue,sat,lum){
    //factering lum
    var upperbound = 255;
    var lowerbound = 0;
    if (lum<.5){
        upperbound=lum*510;
    } else if (lum>.5) {
        lowerbound=lum*510-255;
    }

    //factering sat
    var center = upperbound-(upperbound-lowerbound)/2;
    upperbound -= (upperbound-center)*(1-sat);
    lowerbound += (center-lowerbound)*(1-sat);

    var red = 0;
    var green = 0;
    var blue = 0;
    //if-net calcs rgb-values from hue
    if (hue<60){
        red = 1;
        green = hue/60;
    } else if (hue<120) {
        green = 1;
        red = (120-hue)/60;
    } else if (hue<180){
        green = 1;
        blue = (hue-120)/60;
    } else if (hue<120) {
        blue = 1;
        green = (240-hue)/60;
    } else if (hue<180){
        blue = 1;
        red = (hue-240)/60;
    } else {
        red = 1;
        blue = (360-hue)/60;
    }

    var deltabound=upperbound-lowerbound;

    return {
        red:red*deltabound+lowerbound,
        green:green*deltabound+lowerbound,
        blue:blue*deltabound+lowerbound
    }
}
