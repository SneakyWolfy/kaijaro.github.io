"use strict";

window.onload = function(){
    var TrackAudio = new Audio('audio.mp3')

    var canvas ;
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
    var SpeedFactor = .3

    var pY
    /*
    takes a percentage as peramater

    returns the respective width in pixels of the game
    */
    var gw=canvas.width
    var $pw = (f) => {
        return (f/100)*gw;
    }
    /*
    takes a percentage as peramater

    returns the respective height in pixels of the game
    */
    var gh=canvas.height
    var $ph = (f) => {
        return (f/100)*gh;
    }
    var ctx ;
    var testObj = {};
    var songLength = 159000;
    var trackNotes = [[],[],[],[]]
    var songUrl = "https://api.myjson.com/bins/b3su1"
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

    var hitLineHeightOffset = $ph(0);
    var bgColor="#101010";
    var gameBgPosLeft=canvas.width/2-track.BgWidth/2-(track.BorderWidth/2);
    var gameBgPosRight=canvas.width/2+track.BgWidth/2+(track.BorderWidth/2);
    var hitLineHeight = canvas.height - track.keyHeight - hitLineHeightOffset

    fetch(songUrl).then(function(response){
        return response.json()
    }).then(function(mapData){
        console.log(mapData)
    
        var TimingPoints = []
        for (var TP of mapData.TimingPoints){
            if (TP.Type == "TimingPoint"){
                TimingPoints.push(TP)
            }
        }
        console.log(TimingPoints)
        function createChart(){
             
            for (var note of mapData.HitObjects){  
          
                if (note.Type == "Hit"){
                    trackNotes[note.Column].push({'offset':parseInt(note.Offset)*-1*SpeedFactor+hitLineHeightOffset,'Type':'Hit'})
                } else if (note.Type == "Hold"){
                    //trackNotes[note.Column].push({'offset':note.offset,'Type':'Hold',})
                }
            }
    
        }
        createChart()
        console.log(trackNotes)
    }).then(function(){
        //the object defining the track
        //creates a rectange 
        function rect(leftX,topY,width,height,drawColor) {
            ctx.fillStyle = drawColor;
            ctx.fillRect(leftX,topY,width,height);
        }
        function setUpKeyValues(){
            /*\
            this creates the on and off key imagedata and throws it in
            3 arrays. 2 arrays (columnInputActive and columnInputPassive) hold the 
            on and of images, and the other array stores the images that are in use.
            
            columnInput represents the values of
            (index 0: furthest left track)
            (index 1: middle left track)
            (index 2: middle right track)
            (index 3: furthest right track)
            \*/
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
            //this sets the images to the corresponding on off stored in columnInput
            updateTrack()
        }
        setUpKeyValues()

        //the e code of the current keybinds from left to right
        var keybinds = ["KeyD","KeyF","KeyJ","KeyK"]
        addEventListener("keydown",KeyboardEvent);
        addEventListener("keyup",KeyboardupEvent);

        //the code that sets the current on and off values to the keys
        function updateTrack(){
            for (var i=0;i<4;i++){
                ctx.putImageData(columnInput[i], gameBgPosLeft+i*track.keyWidth+track.BorderWidth,canvas.height-track.keyHeight+1);
            }
        }

        function checkHit(column){
            console.log(trackNotes[column].offset+pY)
        }
        
        //the key pressing events
        //they activate when pressing a key in the keybinding array
        //debounce (disable until event ends - release key) is used to prevent repeated clicks when
        //holding the key down sssssssssssssssssssssssssss
        function KeyboardEvent(ev){      
            var key = ev.code;
            if (keybinds.includes(key) && debounce[keybinds.indexOf(key)]){//[keybinds.indexOf(key)]
                debounce[keybinds.indexOf(key)] = false;
                columnInput[keybinds.indexOf(key)] = columnInputActive[keybinds.indexOf(key)]
                checkHit([keybinds.indexOf(key)])
                //updateTrack()
            }
        }
        //the key pressing events
        //they activate when pressing a key in the keybinding array
        //no debounce neededfgh
        function KeyboardupEvent(ev){
            var key = ev.code;
            if (keybinds.includes(key)){
                debounce[keybinds.indexOf(key)] = true;
                columnInput[keybinds.indexOf(key)] = columnInputPassive[keybinds.indexOf(key)]
                //updateTrack()
            }
        }
        var main = () => {
            var note = new Image()
            var line = new Image()
            note.src = "skin/note.png";
            line.src = "skin/note.png";
            pY = 0;
            //main loop of the game
            /*\ currently not needed 
            function createLines(){
                lines = lines.filter(function(value, index, arr){
                    return value > pY-canvas.height;
                });
                lines.push(pY);
            }
            \*/
            function drawHitLine(){
                rect(gameBgPosLeft+track.BorderWidth,hitLineHeight,Math.abs(gameBgPosLeft-gameBgPosRight)-track.BorderWidth,2,'#999999')
            }
            console.log(trackNotes[0])


            function drawNotes(){
                function inRange(){

                }

                /*\
                function checkInRange(values){
                    //checks if note is on screen by checking
                    //bottom of note Ypos is below top || note Ypos is above bottom\\
                    return ($ph(5)+(values.offset-pY)>0||values.offset-pY<canvas.height)
                }
                trackNotes[0].filter(function(value, index, arr){
                    return value.offset > pY-canvas.height;
                });

                for (var noteObj of trackNotes[0].filter(checkInRange)){
                    ctx.drawImage(note,gameBgPosLeft+track.BorderWidth,noteObj.offset+pY,track.keyWidth,$ph(5));
                }
                for (var noteObj of trackNotes[1].filter(checkInRange)){
                    ctx.drawImage(note,gameBgPosLeft+track.BorderWidth+track.keyWidth,noteObj.offset+pY,track.keyWidth,$ph(5));
                } 
                for (var noteObj of trackNotes[2].filter(checkInRange)){
                    ctx.drawImage(note,gameBgPosLeft+track.BorderWidth+track.keyWidth*2,noteObj.offset+pY,track.keyWidth,$ph(5));
                } 
                for (var noteObj of trackNotes[3].filter(checkInRange)){
                    ctx.drawImage(note,gameBgPosLeft+track.BorderWidth+track.keyWidth*3,noteObj.offset+pY,track.keyWidth,$ph(5));
                }      
                \*/  
                
                for (var index = 0; index<4;index++){
                    for (var noteObj of trackNotes[index]){           
                        if (noteObj.offset+pY>canvas.height){
                            trackNotes[index].shift();
                            continue;
                        }                 
                        if ($ph(5)+(pY-noteObj.offset)<0){
                            break;
                        }
                        ctx.drawImage(note,gameBgPosLeft+track.BorderWidth+track.keyWidth*index,noteObj.offset+pY,track.keyWidth,$ph(5));
                    }
                }           
            }

            var i=0

            var globalOffset=180
            function animate(){
                //background
                rect(0,0,canvas.width,canvas.height,bgColor);
                //bg effects
                //timing lines
                drawLines()
                //keys
                pY = (TrackAudio.currentTime*1000)*SpeedFactor+(globalOffset*SpeedFactor); 
                          
                //border
                rect(gameBgPosLeft,0,track.BorderWidth,canvas.height,track.color);
                rect(gameBgPosRight,0,track.BorderWidth,canvas.height,track.color);    
                drawHitLine()
                //notes
                drawNotes()
                updateTrack()                
                //effects
                requestAnimationFrame(animate);
            }    

            //console.log(performance.now());   
            //about every 60hz call this function again
            animate()
            requestAnimationFrame(animate);
            //setInterval(function(){
            //    createLine()
            //},400) 
            function createLine(){
                lines = lines.filter(function(value, index, arr){
                    return value > pY-canvas.height;
                });
                lines.push(pY);
            }   
            function drawLines(){                
                for (l of lines){                   
                    ctx.drawImage(line,gameBgPosLeft+track.BorderWidth,pY-l,track.keyWidth*4,1);
                }
            }
        }
        var debounceStart = true;
        addEventListener('click',() => {
            if (debounceStart == true){
                debounceStart = false
                TrackAudio.play().then(function(){
                    main()
})}})})}


/*\
tasks:

interface
    scaleable on aspect ratio - done
    song select
    make it look better


registering key listiners - done
key-down and key-up presses - done
this code will later handle note checking -done

animating lines 
will be have a base scroll speed
bpm x sv x ss will have their factors
will require an element of constant time (heartbeat) - done

note object - done
    will determine the whats and wheres of each object - done

txt file (note file) to json - done
    will determine the a chart; a conversion of a chart into usible data -done

playing audio - done
    using the audio object -done    

playing audio async - done
    syncing audio with the game and game timer - somewhat done

adjustable options

additional add-ons

hitsounds 
    note feedback (will be implimented in the json converstion)

tap sounds - done
same as above

sfx
    aditional polish basically

score screen
    record grades
    record combo
    display grade and combo

auto mode

performance improvements
    better syncing
    better engine



//things i'll probably need

//load image object (same as audio object)

//var image = new Image()
//image.scr = "image.png"

\*/


