var canvas 
var ctx 

var testObj = {};

window.onload = function(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    function rect(leftX,topY,width,height,drawColor) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(leftX,topY,width,height);
    }

    function setUpTest(){
        color="#232323"
        rect(0,0,canvas.width,canvas.height,"#FF3333")
        rect(0,0,40,40,color);
    }

    setUpTest()

    canvas.addEventListener("mousemove",function (evt) {Getmouse(evt)})


}

function Getmouse(evt){
    console.log(evt.clientX, evt.clientY)
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    function rect(leftX,topY,width,height,drawColor) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(leftX,topY,width,height);
    }

    if (evt.clientX<40&&evt.clientY<40){
        color="#ffffff";
        rect(0,0,40,40,color);
    } else {
        color="#232323";
        rect(0,0,40,40,color);
    }
}

