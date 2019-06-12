"use strict";
var $ = (id) => {
    return document.getElementById(id);
}

window.onload = function(){
    console.log(sessionStorage.getItem('test'))
    var globalOffset=115
    var HitNormal = new Audio('../hit-sounds/hitnormal.wav')
    var TrackAudio;
    var MissSoundEffect = new Audio('../hit-sounds/miss.mp3')
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
    var SpeedFactor = .2
    var pY
    var gw=canvas.width
    var $pw = (f) => {
        return (f/100)*gw;
    }

    var gh=canvas.height
    var $ph = (f) => {
        return (f/100)*gh;
    }

    var trackNotes = [[],[],[],[]]
    var songUrl = "https://api.myjson.com/bins/pgo5x"
    var track = {
        color:'#ffffff',
        RedPassive:'0',
        GreenPassive:'0',
        BluePassive:'0',
        RedActive:'255',
        GreenActive:'255',
        BlueActive:'255',
        BgWidth:parseInt($pw(36)),
        BorderWidth:parseInt($pw(1)),
        keyWidth:parseInt($pw(36)/4),
        keyHeight:parseInt($ph(20))
    }

    var hitLineHeightOffset = parseInt($ph(0));
    var gameBgPosLeft=parseInt(canvas.width/2-track.BgWidth/2-(track.BorderWidth/2));
    var gameBgPosRight=parseInt(canvas.width/2+track.BgWidth/2+(track.BorderWidth/2));
    var hitLineHeight = canvas.height - track.keyHeight - hitLineHeightOffset

    fetch(songUrl).then(function(response){
        return response.json()
    }).then(function(mapData){
        console.log(mapData)
        
        TrackAudio = new Audio('../song-audio/'+mapData.General.AudioFilename)
        TrackAudio.volume = .5
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
                    trackNotes[note.Column].push({'offset':(parseInt(note.Offset)*-1)*SpeedFactor+hitLineHeightOffset,'Type':'Hit'})
                } else if (note.Type == "Hold"){
                    trackNotes[note.Column].push({'offset':(parseInt(note.Offset)*-1)*SpeedFactor+hitLineHeightOffset,'Type':'Hold','EndTime':(parseInt(note.EndTime)*-1)*SpeedFactor+hitLineHeightOffset})
                }
            }
        }
        createChart()
        console.log(trackNotes)
    }).then(function(){
        function rect(leftX,topY,width,height,drawColor) {
            ctx.fillStyle = drawColor;
            ctx.fillRect(leftX,topY,width,height);
        }
        function updateScore(element){
            let score = parseInt(element.innerText);
            score++
            element.innerText = score
        }

        function drawGame(){
            //bg
            rect(0,0,canvas.width,canvas.height,'rgba(00,00,00,1)')
            //border
            rect(gameBgPosLeft,0,track.BorderWidth,canvas.height,track.color);
            rect(gameBgPosRight,0,track.BorderWidth,canvas.height,track.color);
            //hitline
            rect(gameBgPosLeft+track.BorderWidth,hitLineHeight,parseInt(Math.abs(gameBgPosLeft-gameBgPosRight))-parseInt(track.BorderWidth),2,'#999999')
        }

        function setUpKeyValues(){
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
            drawGame()
            updateTrack()
        }
        setUpKeyValues()
        var keybinds = ["KeyA","KeyS","KeyD","KeyF"]
        addEventListener("keydown",KeyboardEvent);
        addEventListener("keyup",KeyboardupEvent);
        
        function updateTrack(){
            for (var i=0;i<4;i++){
                ctx.putImageData(columnInput[i], gameBgPosLeft+i*track.keyWidth+track.BorderWidth,canvas.height-track.keyHeight+1);
            }
        }

        function noteHit(acc){
            if (Math.abs(acc)<45){
                updateScore($('perfect'));
                updateScore($('combo'));
            } else if (Math.abs(acc)<70){
                updateScore($('good'));
                updateScore($('combo'));
            } else if (Math.abs(acc)<100){
                updateScore($('ok'));
                updateScore($('combo'));
            } else {
                updateScore($('bad'));
                $('combo').innerText = '0'
                MissSoundEffect.play()
            }   
        }
        var checkCount = 0
        var totalUR = 0
        var UR = 0
        function checkHit(column){
            let accOffset = 0;
            let TrueNoteOffset = (trackNotes[column][0].offset-hitLineHeightOffset)/SpeedFactor
            let currentTime = (TrackAudio.currentTime*1000)
            let percision = (TrueNoteOffset+currentTime)
            if (Math.abs(percision)<350){
                checkCount++;
                totalUR+=percision;
                UR=totalUR/checkCount;
                console.log(UR)
                trackNotes[column].shift()
                noteHit(percision)
            }
        }

        function playHitsound(){
            let sound = new Audio('../hit-sounds/hitnormal.wav')
            sound.play();
        }

        function KeyboardEvent(ev){     
            var key = ev.code;
            if (keybinds.includes(key) && debounce[keybinds.indexOf(key)]){//[keybinds.indexOf(key)]
                debounce[keybinds.indexOf(key)] = false;
                playHitsound()
                columnInput[keybinds.indexOf(key)] = columnInputActive[keybinds.indexOf(key)]
                checkHit(keybinds.indexOf(key))
            }
        }

        function KeyboardupEvent(ev){
            var key = ev.code;
            if (keybinds.includes(key)){
                debounce[keybinds.indexOf(key)] = true;
                columnInput[keybinds.indexOf(key)] = columnInputPassive[keybinds.indexOf(key)]
            }
        }

        var main = () => {
            var note = new Image()
            var line = new Image()
            note.src = "../skin/note.png";
            line.src = "../skin/note.png";
            pY = 0;
            function drawNotes(){
                function checkMiss(){
                    for (var index = 0; index<4;index++){
                        for (var noteObj of trackNotes[index]){
                            if (noteObj.offset+pY>canvas.height){
                                trackNotes[index].shift();
                                updateScore($('miss'));
                                $('combo').innerText = '0'
                                MissSoundEffect.play()
                                continue;
                            }
                        }
                    }
                }
                function notefilter(value){
                    return (parseInt($ph(5))+(pY+value.offset)>0)
                }
                checkMiss()

                for (var index = 0; index<4;index++){
                    for (var noteObj of trackNotes[index].filter(notefilter)){
                        ctx.drawImage(note,gameBgPosLeft+track.BorderWidth+track.keyWidth*index,noteObj.offset+pY,parseInt(track.keyWidth),parseInt($ph(5)));
                    }
                }
            }

            function animate(){
                drawGame()
                //keys
                pY = (TrackAudio.currentTime*1000)*SpeedFactor+(globalOffset); 
                //notes
                drawNotes()
                updateTrack()                
                //effects
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }

        var debounceStart = true;
        addEventListener('click',() => {
            if (debounceStart == true){
                debounceStart = false
                TrackAudio.play().then(function(){
                    main()
                })
            }
        })
    })
}