//load events
"use strict";

var debounceAni = true;
var $ = (id) => {
    return document.getElementById(id);
}
var SongData;

function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/song-api.json', true); 
    xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
    }
    };
    xobj.send(null);  
}

function init() {
    loadJSON(function(response) {
       SongData = JSON.parse(response);
       console.log(SongData)
    });
}

init()

//Screen 1 transitions

function aniPlayBtn(){
    
    if (debounceAni){
        function AnimationPopOutEnd(){
            $('play-button').classList.remove('popAni');
            $('play-button').style.display = 'none';
            console.log("a")
            $('play-button').removeEventListener('animationend',AnimationPopOutEnd)
        }
        
        function AnimationFadeInEnd(){
            $('Title').classList.remove('fadeOutAni');
            $('Title').style.display = 'none';
            $('option-button').classList.remove('fadeOutAni');
            $('option-button').style.display = 'none';
            debounceAni = true;
            console.log("b")
            fadeAnimatied.removeEventListener('animationend',AnimationFadeInEnd)
            aniLoadSongs()
        }

        debounceAni = false;

        
        $('play-button').classList.add("popAni");
        $('play-button').addEventListener('animationend',AnimationPopOutEnd)
            
        $('Title').classList.add("fadeOutAni");
        $('option-button').classList.add("fadeOutAni");
        const fadeAnimatied = document.querySelector('#option-button')
        fadeAnimatied.addEventListener('animationend', AnimationFadeInEnd)
    }
}

function aniLoadSongs() {
    if (debounceAni){
        debounceAni = false;
        loadMaps(function(response){
            select(0)
            load();
        })
        function AnimationFadeInEnd(){
            for (element of document.getElementsByClassName('screen2')){
                element.classList.remove("fadeInAni");
            }
            debounceAni = true;
            console.log("c")
            songLoadAnimatied.removeEventListener('animationend',AnimationFadeInEnd)
        }
        for (var element of document.getElementsByClassName('screen2')){
            element.classList.add("fadeInAni");
            element.style.display = 'block';
        }
        const songLoadAnimatied = document.querySelector('.screen2')
        songLoadAnimatied.addEventListener('animationend',AnimationFadeInEnd)
    }
}

function aniOptionBtn(){
    if (debounceAni){
        debounceAni = false;

        function AnimationPopOutEnd(){
            $('option-button').classList.remove('popButtonAni');
            $('option-button').style.display = 'none';
            console.log("d")
            popAnimatied.removeEventListener('animationend',AnimationPopOutEnd)
        }

        function AnimationFadeInEnd(){
            $('Title').classList.remove('fadeOutAni');
            $('Title').style.display = 'none';
            $('play-button').classList.remove('fadeOutAni');
            $('play-button').style.display = 'none';
            debounceAni = true;
            console.log("e")
            fadeAnimatied.removeEventListener('animationend',AnimationFadeInEnd)
            aniLoadOptions()
        }

        $('option-button').classList.add("popButtonAni");
        const popAnimatied = document.querySelector('#option-button')
        popAnimatied.addEventListener('animationend', AnimationPopOutEnd)

        $('Title').classList.add("fadeOutAni");
        $('play-button').classList.add("fadeOutAni");
        const fadeAnimatied = document.querySelector('#option-button')
        fadeAnimatied.addEventListener('animationend', AnimationFadeInEnd)
    }
}

function aniLoadOptions() {
    if (debounceAni){
        debounceAni = false;
        function AnimationFadeInEnd(){
            for (let element of document.getElementsByClassName('screen3')){
                element.classList.remove("fadeInAni");
            }
            debounceAni = true;
            console.log("f")
            songLoadAnimatied.removeEventListener('animationend',AnimationFadeInEnd)
        }

        for (let element of document.getElementsByClassName('screen3')){
            element.classList.add("fadeInAni");
            element.style.display = 'block';
        }

        const songLoadAnimatied = document.querySelector('.screen3')
        songLoadAnimatied.addEventListener('animationend',AnimationFadeInEnd);
    }
}

//Screen 2 transitions
function loadMaps(callback){
    $('song-overflow').innerHTML = "";
    for (var songNumber=0;songNumber<SongData.length;songNumber++){
        let id = songNumber;
        let title = SongData[songNumber].Title;
        $('song-overflow').innerHTML += "<button id=\"song"+id+"\" class=\"song screen2 hoverinverse\" onclick=\"loadSongElements("+id+")\">"+title+"</button>"
    }
    callback();
}

var previewAudio = new Audio();

function stopAudio(){
    previewAudio.pause();
}

function resumeAudio(){
    previewAudio.play()
}
function loadaudio(file,preview){
    function getDuration(src, cb) {
        var audio = new Audio();
        audio.onloadedmetadata = (function(){
            cb(audio.duration);
        })
        audio.src = src;
    }

    previewAudio.src = file;
    var previewTime = 0;
    getDuration(file, function(length) {
        if (!(length<preview/1000)){
            previewTime = preview/1000;
        }
        previewAudio.currentTime = previewTime;
        console.log("setting volulme to "+currentMusicVolume)
        previewAudio.volume = currentMusicVolume;
        previewAudio.loop = true;
        if (!muted){
            previewAudio.play();
        }
    })
}

function unloadBg(){
    $("imageBox").style.backgroundImage = "none";
    $("InfoList").style.backgroundImage = "none"
}

function loadBG(image,callback){
    /*
    $("imageBox").style.backgroundImage = 'url("song-bg/A-Strange-Reunion-(Party-Crab-remix)-5.jpg")';
    $("songInfoContainer").style.backgroundImage = 'url("https://kaijaro.github.io/song-bg/A-Strange-Reunion-(Party-Crab-remix)-5.jpg")';
    */
   /*
    $("imageBox").style.backgroundImage = new URL(image);
    $("songInfoContainer").style.backgroundImage = "url("+image+")";
    */
    $("imageBox").style.backgroundImage = "url("+image+")";
    $("songInfoContainer").style.backgroundImage = "url("+image+")";
    callback()
}

function getVersionColor(versionName){
    switch (versionName){
        case"[EZ]":
            return "green";
        case"[NM]":
            return "yellow";
        case"[HD]":
            return "orange";
        case"[EX]":
            return "red";
        case"[INF]":
            return "purple";
        default:
            return "";
    }
}
var image;
function load(){

    let songIndex = parseInt(selectedSong.slice(4));
    let url = SongData[songIndex].Versions[0].link
    let audioName;
    let audioPreview = 0;

    //fetchresourse
    fetch(url).then(function(response){
        return response.json();
    }).then(function(file){
        console.log(file);
        audioPreview = parseInt(file.General.PreviewTime);
        audioName = file.General.AudioFilename;
        image = SongData[songIndex].Image;
        console.log(image)
        $("title").innerText=file.Metadata.Title + " - " + file.Metadata.Artist;
        $("creator").innerText="Created by " + file.Metadata.Creator;
        
    }).then(function(){
        
        $('difBoxContainer').innerHTML = "";
        var DifColor;
        for (var difNum = 0;difNum<SongData[songIndex].Versions.length;difNum++){
            DifColor = getVersionColor(SongData[songIndex].Versions[difNum].Name)
            

            $('difBoxContainer').innerHTML += "<button id=\"dif"+difNum+"\" class=\"dif "+DifColor+"\" onclick=\"selectDif("+difNum+")\"><p>"+SongData[songIndex].Versions[difNum].Name+"</p></button>";
        }
        loadaudio("https://kaijaro.github.io/song-audio/"+audioName,audioPreview)
        loadBG("song-bg/"+image,function(response){
            console.log($("imageBox").style.backgroundImage)
            console.log("song-bg/"+image)
            console.log("url("+"song-bg/"+image+")")
        })
    })
}

var selectedSong = "";
var selectedDif = false;

function select(id){
    selectedSong = "song"+id;
    $(selectedSong).classList.add("selected");
}

function unloadDif(){
    $('playDifContainer').innerHTML = "";
    $('difBoxContainer').innerHTML = "";
}

function unload(){
    if (!selectedSong==""){
        $(selectedSong).classList.remove("selected");
    }
    
    selectedSong="";
    selectedDif = false;

    $('title').innerText = "Loading"
    $('creator').innerText = "Loading"

    stopAudio()
    unloadBg()
    unloadDif()
}

function loadSongElements(id){
    unload();
    select(id);
    load();
}

function getDifInfo(id, callback){
    let songIndex = parseInt(selectedSong.slice(4));
    callback(SongData[songIndex].Versions[id])
}

var songurl
var isDifSelected = false;

function createButton(id){
    $('playDifContainer').innerHTML = '<button id="playDifButton" class="hoverinverse playbutton" onclick="window.loadGame()">Play</button>'
    $('playDifButton').style.width = (SongData[parseInt(selectedSong.slice(4))].Versions.length*175)+"px";
    $('playDifButton').classList.add("solid"+getVersionColor((SongData[parseInt(selectedSong.slice(4))].Versions[id].Name)));
    console.log(getVersionColor((SongData[parseInt(selectedSong.slice(4))].Versions[id].Name)))
}

function applySolidDifColor(id){
    let oldDif = $("dif"+selectedDif)
    let newDif = $("dif"+id)
    let oldColor;
    
    let newColor = "solid"+getVersionColor(SongData[parseInt(selectedSong.slice(4))].Versions[id].Name)

    if (!isNaN(parseInt(selectedDif))){
        oldColor = "solid"+getVersionColor(SongData[parseInt(selectedSong.slice(4))].Versions[selectedDif].Name)
        oldDif.classList.remove(oldColor);
    }

    console.log(oldDif,newDif,oldColor,newColor,!isNaN(parseInt(selectedDif)))
    selectedDif = id

    newDif.classList.add(newColor);
}

function selectDif(id){
    applySolidDifColor(id);
    getDifInfo(id,function(response){
        songurl = response.link
    })
    createButton(id);
}

//back
$("back").onclick = () => {
    function unloadScreen(callback){
        unload();
        debounceAni = false;
        function AnimationFadeOutEnd(){
            for (let element of document.getElementsByClassName('screen2')){
                element.classList.remove("fadeOutAni");
                element.style.display='none';
            }
            for (let element of document.getElementsByClassName('screen3')){
                element.classList.remove("fadeOutAni");
                element.style.display='none';
            }
            fadeAnimatied.removeEventListener('animationend',AnimationFadeOutEnd)
            console.log("1");
            callback();
        }
        for (let element of document.getElementsByClassName('screen2')){
            element.classList.add("fadeOutAni");
        }
        for (let element of document.getElementsByClassName('screen3')){
            element.classList.add("fadeOutAni");
        }
        const fadeAnimatied = document.querySelector('#back');
        fadeAnimatied.addEventListener('animationend', AnimationFadeOutEnd);
    }
    if (debounceAni){
        unloadScreen(function(response){
            loadMain()
        })
    }
}

function loadMain(){
    function AnimationFadeInEnd () {
        console.log("3")
        for (let element of document.getElementsByClassName('screen1')){
            element.classList.remove("fadeInAni");
        }
        debounceAni = true;
        menuLoadAnimatied.removeEventListener('animationend',AnimationFadeInEnd)
    }

    console.log("2");

    for (let element of document.getElementsByClassName('screen1')){
        element.classList.add("fadeInAni");
        element.style.display = 'block';
        console.log(element);
    }

    const menuLoadAnimatied = document.querySelector('#Title');
    console.log(menuLoadAnimatied);

    menuLoadAnimatied.addEventListener('animationend',AnimationFadeInEnd)
}

//mute
var muted = false
$("mute").onclick = () => {
    switch(muted){
        case true:
            resumeAudio()
            $("on").style.display = "block";
            $("off").style.display = "none";
            muted = false;
            break;
        case false:
            stopAudio();
            $("on").style.display = "none";
            $("off").style.display = "block";
            muted = true;
    }
}

//MENU BUTTON EVENTS (FOR CHROME)

$("play-button").addEventListener("click",aniPlayBtn)


//slider functions (options)

var musicSlider = document.getElementById("volumeRange");
var musicVolume = document.getElementById("song-volume");
var effectSlider = document.getElementById("effectRange");
var effectVolume = document.getElementById("effect-volume");

musicVolume.innerHTML = musicSlider.value+"%"; 
effectVolume.innerHTML = effectSlider.value+"%"; 
var currentMusicVolume = musicSlider.value/100;
var currentEffectVolume = effectSlider.value/100;

sessionStorage.setItem("musicVolume",currentMusicVolume)
sessionStorage.setItem("effectVolume",currentEffectVolume)

// Update the current slider value (each time you drag the slider handle)
musicSlider.oninput = function() {
    musicVolume.innerHTML = this.value+"%";
    currentMusicVolume = this.value/100;
    volumeChange(currentMusicVolume)
    sessionStorage.setItem("musicVolume",currentMusicVolume)
} 

effectSlider.oninput = function() {
    effectVolume.innerHTML = this.value+"%";
    currentEffectVolume = this.value/100;
    volumeChange(currentEffectVolume)
    sessionStorage.setItem("effectVolume",currentEffectVolume)
} 

function volumeChange(volume){
    if (volume*100%10==0&!muted){
        let sound = new Audio('Menu-sfx/volume-change.wav');
        sound.volume = volume;
        sound.play();
    }
}

/////changing keybinds
if (sessionStorage.getItem("keybinds")==null){
    sessionStorage.setItem("keybinds",["KeyA","KeyS","KeyD","KeyF"])
} 

var keybinds = sessionStorage.getItem("keybinds").split(",");
for (var i=0;i<4;i++){
    console.log(keybinds)
    $("key"+i).innerText=keybinds[i].slice(3)
}

function updateBinding(ev){
    unFocus(ev.code)
    if (focus<3){
        setFocus(focus+1)
        
    } else {
        document.removeEventListener("keyup",updateBinding)
        debounceAni = true;
        sessionStorage.setItem("keybinds",keybinds)
        console.log(sessionStorage.getItem("keybinds"));
    }
}

var focus;

function unFocus(value){
    keybinds[focus]=value
    console.log($("key"+focus).style)
    $("key"+focus).innerText=value.slice(3);
    $("key"+focus).style.backgroundColor="rgba(0,0,0,0)"
}

function setFocus(value){
    focus=value
    $("key"+focus).innerText="";
    $("key"+focus).style.backgroundColor="aliceblue"
}

$("ck-button").onclick = function(){
    if (debounceAni){
        debounceAni = false;
        setFocus(0)

        document.addEventListener("keyup",updateBinding);

        //remove kebinds an change text
        //create event listener that checks key and validates it if it's good
        //after 4 validations inable animations
    }
}
//Background movment
addEventListener("mousemove",(e) => {
    var amountMovedX = (e.pageX * -1 / 64);
    var amountMovedY = (e.pageY * -1 / 64);
    $("imageBox").style.backgroundPosition = amountMovedX + 'px ' + amountMovedY + 'px';
})

function loadGame(){
    if (debounceAni){
        debounceAni=false;
        
        sessionStorage.setItem("url",songurl)
        window.open("html/game.htm","_self")
        debounceAni=true;
    }
}
