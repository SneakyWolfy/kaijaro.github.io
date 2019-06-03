
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
        gw=canvas.width
        $pw = (f) => {
            return (f/100)*gw;
        }
        gh=canvas.height
        $ph = (f) => {
            return (f/100)*gh;
        }
        
        var bgColor="#101010";
        rect(0,0,canvas.width,canvas.height,bgColor);
        //setting background

        //building track outlines
        var trackcolor='#3e3e40';
        var trackBgWidth=$pw(36);
        var trackBorderWidth=$pw(1);

        var gameBgPosLeft=canvas.width/2-trackBgWidth/2-(trackBorderWidth/2);
        var gameBgPosRight=canvas.width/2+trackBgWidth/2+(trackBorderWidth/2);
        
        rect(gameBgPosLeft,0,trackBorderWidth,canvas.height,trackcolor);
        rect(gameBgPosRight,0,trackBorderWidth,canvas.height,trackcolor);

        //building track keys
        var keyColor = trackcolor;
        var keyWidth = trackBgWidth/4;

        var keyHeight = $ph(10);
        for (var i=0;i<4;i++){
            rect(gameBgPosLeft+i*keyWidth+trackBorderWidth,canvas.height-keyHeight,keyWidth,keyHeight,keyColor)
        }
    }

    setUpTest()

    addEventListener("keydown",KeyboardEvent);
    
    function KeyboardEvent(ev){
        console.log(ev)
    }

    
}

//tasks:

//interface
///scaleable on aspect ratio

//registering key listiners 
///key-down and key-up presses
///this code will later handle note checking

//animating lines
///will be have a base scroll speed
///bpm x sv x ss will have their factors
///will require an element of constant time (heartbeat)

//note object
///will determine the whats and wheres of each object

//txt file (note file) to json
///will determine the a chart; a conversion of a chart into usible data

//playing audio
///using the audio object

//playing audio async
///syncing audio with the game and game timer

//adjustable options
///additional add-ons

//hitsounds 
///note feedback (will be implimented in the json converstion)

//tap sounds
///same as above

//sfx
///aditional polish basically



