"use strict";
var $ = (id) => {
    return document.getElementById(id);
}

var offsetTimer
var offsetTimerTime = 1000;
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
var songUrl = sessionStorage.getItem("url")
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
    TrackAudio.volume = sessionStorage.getItem("musicVolume")
    var TimingPoints = []
    for (var TP of mapData.TimingPoints){
        if (TP.Type == "TimingPoint"){
            TimingPoints.push(TP)
        }
    }
    function createChart(){   
        function getSamples(bitmap){
            var bin = parseInt(bitmap).toString(2);
            while (bin.length < 4){
                bin = 0+bin;
            }
            var out=["normal"];
            var additions = ["clap","finish","whistle"];
            for (var i=0; i<3; i++){
                if (bin[i]=='1'){
                    out.push(additions[i])
                }
            }
            return out;
        }
        for (var note of mapData.HitObjects){  
            if (note.Type == "Hit"){
                trackNotes[note.Column].push({'offset':((parseInt(note.Offset)+offsetTimerTime)*-1)*SpeedFactor+hitLineHeightOffset,'Type':'Hit',"volume":parseInt(note.SampleVolume)/100,"samples":getSamples(note.Sample)})
            } else if (note.Type == "Hold"){
                trackNotes[note.Column].push({'offset':((parseInt(note.Offset)+offsetTimerTime)*-1)*SpeedFactor+hitLineHeightOffset,'Type':'Hold','EndTime':(parseInt(note.EndTime)*-1)*SpeedFactor+hitLineHeightOffset,"volume":parseInt(note.SampleVolume)/100,"samples":getSamples(note.Sample)})
            }
        }
    }
    createChart()

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

    function comboIncrease(){
        let combo = parseInt($("instruct").innerText);
        let streak = parseInt($("streak").innerText);
        combo++;
        if (combo>streak){
            streak++
        }
        $("instruct").innerText = combo;
        $("streak").innerText = streak;
    }

    function comboBreak(){
        $('instruct').innerText = '0'
        MissSoundEffect.play()
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
    var keybinds = sessionStorage.getItem("keybinds").split(",");

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
            comboIncrease()
        } else if (Math.abs(acc)<70){
            updateScore($('good'));
            comboIncrease()
        } else if (Math.abs(acc)<100){
            updateScore($('ok'));
            comboIncrease()
        } else {
            updateScore($('bad'));
            comboBreak();
        }   
    }

    var checkCount = 0
    var totalUR = 0
    var UR = 0

    function checkHit(column){
        let accOffset = 0;
        let TrueNoteOffset = (trackNotes[column][0].offset-hitLineHeightOffset)/SpeedFactor
        let currentTime = (TrackAudio.currentTime*1000)
        let percision = (TrueNoteOffset+currentTime+offsetTimer)
        if (Math.abs(percision)<350){
            /*
            checkCount++;
            totalUR+=percision;
            UR=totalUR/checkCount;
            console.log(UR)
            */
            trackNotes[column].shift()
            noteHit(percision)
        }
    }

    function playHitsound(obj){
        let soundList = []
        for (var sound of obj.samples){
            sound = new Audio('../hit-sounds/hit'+sound+'.wav')
            soundList.push(sound)
            sound.volume = sessionStorage.getItem("musicVolume")
        }
        for (var sound of soundList){
            sound.play();
        }
    }

    function KeyboardEvent(ev){     
        var key = ev.code;
        if (keybinds.includes(key) && debounce[keybinds.indexOf(key)]){//[keybinds.indexOf(key)]
            debounce[keybinds.indexOf(key)] = false;
            playHitsound(trackNotes[keybinds.indexOf(key)][0])
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
                            comboBreak()
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

            pY = (TrackAudio.currentTime*1000)*SpeedFactor+(globalOffset)+offsetTimer*SpeedFactor; 
            //notes
            drawNotes()
            updateTrack()                
            //effects
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    var debounceStart = true;
    document.addEventListener('keypress',startProtocol)
    var protocolCheck = [0,0,0,0];
    $("instruct").innerText = "Tap Keys To Start"
    for (var id = 0;id<4;id++){
        $(""+id).innerText=keybinds[id].slice(3)
    }
    function startProtocol(ev){
        var key = ev.code;
        if (keybinds.includes(key)){
            if (protocolCheck[keybinds.indexOf(key)]===1){
                return;
            }
            protocolCheck[keybinds.indexOf(key)]=1
            if (protocolCheck.reduce((pv, cv) => pv + cv, 0) === 4){
                $("instruct").innerText = "0"
                $("keyDisplay").style.display = "none";
                document.removeEventListener('keypress',startProtocol);
                runGame();
                return;
            }
            $(""+keybinds.indexOf(key)).classList.add("light")
        }
    }
    function runGame(){
        if (debounceStart == true){
            debounceStart = false
            main()
            var start = Date.now();
            var delay = setInterval(step,15)
            function step(){
                offsetTimer = Date.now() - start;
                
            }
            
            setTimeout(function() { 
                clearInterval(delay)
                offsetTimer = offsetTimerTime;
                TrackAudio.autoplay = true;
                TrackAudio.play()
                TrackAudio.onended = function() {
                    window.open("../index.htm","_self");
                }; 
            }, offsetTimerTime);
        }
    }
    document.body.onkeyup = function(e){
        if(e.keyCode == 32){
            
        }
    }
})

