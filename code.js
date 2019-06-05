
var canvas ;
var ctx ;
var testObj = {};

window.onload = function(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    var columnInput0;
    var columnInput1;
    var columnInput2;
    var columnInput3;

    var columnInput = [columnInput0,columnInput1,columnInput2,columnInput3];
    var columnInputActive = [];
    var columnInputPassive = [];
    var debounce = [true,true,true,true];

    var lines = []

    gw=canvas.width
    $pw = (f) => {
        return (f/100)*gw;
    }
    gh=canvas.height
    $ph = (f) => {
        return (f/100)*gh;
    }

    var track = {
        color:'#3e3e40',
        RedPassive:'62',
        GreenPassive:'62',
        BluePassive:'64',
        RedActive:'100',
        GreenActive:'100',
        BlueActive:'106',
        BgWidth:$pw(36),
        BorderWidth:$pw(1),
        keyWidth:$pw(36)/4,
        keyHeight:$ph(20)
    }

    var bgColor="#101010";
    var gameBgPosLeft=canvas.width/2-track.BgWidth/2-(track.BorderWidth/2);
    var gameBgPosRight=canvas.width/2+track.BgWidth/2+(track.BorderWidth/2);
    



    function rect(leftX,topY,width,height,drawColor) {
        ctx.fillStyle = drawColor;
        ctx.fillRect(leftX,topY,width,height);
        
    }

    function setUpTest(){

        
        
        
        //setting background

        
        //building track keys

        //console.log(track);
        for (var j=0;j<4;j++){
            var c = ctx.createImageData(parseInt(track.keyWidth)+1, track.keyHeight);
            var cA = ctx.createImageData(parseInt(track.keyWidth)+1, track.keyHeight);
            var i;
            for (i = 0; i < c.data.length; i += 4) {
                c.data[i+0] = track.RedPassive;
                c.data[i+1] = track.GreenPassive;
                c.data[i+2] = track.BluePassive;
                c.data[i+3] = 255;

                cA.data[i+0] = track.RedActive;
                cA.data[i+1] = track.GreenActive;
                cA.data[i+2] = track.BlueActive;
                cA.data[i+3] = 255;
            }
            columnInput[j]=c;
            columnInputPassive[j]=c;
            columnInputActive[j]=cA;
        }

        updateTrack()

        //building track outlines
        
        
    }

    setUpTest()

    var keybinds = ["KeyD","KeyF","KeyJ","KeyK"]
    
    addEventListener("keydown",KeyboardEvent);
    addEventListener("keyup",KeyboardupEvent);
    
    function updateTrack(){
        for (var i=0;i<4;i++){
            ctx.putImageData(columnInput[i], gameBgPosLeft+i*track.keyWidth+track.BorderWidth,canvas.height-track.keyHeight+1);
        }
    }

    function KeyboardEvent(ev){      
        key = ev.code;
        if (keybinds.includes(key) && debounce[keybinds.indexOf(key)]){//[keybinds.indexOf(key)]
            debounce[keybinds.indexOf(key)] = false;
            columnInput[keybinds.indexOf(key)] = columnInputActive[keybinds.indexOf(key)]
            //updateTrack()
        }
    }

    function KeyboardupEvent(ev){
        key = ev.code;
        if (keybinds.includes(key)){
            debounce[keybinds.indexOf(key)] = true;
            columnInput[keybinds.indexOf(key)] = columnInputPassive[keybinds.indexOf(key)]
            //updateTrack()
        }
    }
    main = () => {
        var note = new Image()
        var line = new Image()

        note.src = "skin/note.png";
        line.src = "skin/note.png";
        
        var i = 0;
        var pX = 0;
        var pY = 0;
        function animate(){
            //background
            rect(0,0,canvas.width,canvas.height,bgColor);
            //bg effects
            //timing lines
            drawLines()
            //keys
            pY = pY + 5;
            ctx.drawImage(note,gameBgPosLeft+track.BorderWidth,pY,track.keyWidth,$ph(5));
            
            //border
            rect(gameBgPosLeft,0,track.BorderWidth,canvas.height,track.color);
            rect(gameBgPosRight,0,track.BorderWidth,canvas.height,track.color);

            
            //notes
            updateTrack()
            
            //effects
            requestAnimationFrame(animate);
            }
        //console.log(performance.now());
        requestAnimationFrame(animate);
        setInterval(function(){
            createLine()
        },400)

        function createLine(){
            lines = lines.filter(function(value, index, arr){
                return value > pY-canvas.height;
            });
            lines.push(pY);
            console.log(lines,pY+canvas.height)
        }

        function drawLines(){
            
            for (l of lines){
                
                ctx.drawImage(line,gameBgPosLeft+track.BorderWidth,pY-l,track.keyWidth*4,1);
            }
        }
    }
    main()
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




//things i'll probably need

//load image object (same as audio object)

//var image = new Image()
//image.scr = "image.png"




