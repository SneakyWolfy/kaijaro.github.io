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

function aniPlayBtn(){
    if (debounceAni){
        debounceAni = false;
        $('play-button').classList.add("popAni");
        const popAnimatied = document.querySelector('#play-button')

        popAnimatied.addEventListener('animationend', () => {
            $('play-button').classList.remove('pop');
            $('play-button').style.display = 'none';
        });

        $('Title').classList.add("fadeOutAni");
        $('option-button').classList.add("fadeOutAni");
        const fadeAnimatied = document.querySelector('#option-button')
        fadeAnimatied.addEventListener('animationend', () => {
            $('Title').classList.remove('fadeOutAni');
            $('Title').style.display = 'none';
            $('option-button').classList.remove('fadeOutAni');
            $('option-button').style.display = 'none';
            debounceAni = true;
            aniLoadSongs()
        });
    }
}

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
        previewAudio.currentTime = previewTime
        previewAudio.volume = .01;
        previewAudio.play();
        previewAudio.loop = true;
    })
}

function unloadBg(){
    $("imageBox").style.backgroundImage = "none";
    $("InfoList").style.backgroundImage = "none"
}

function loadBG(image){
    $("imageBox").style.backgroundImage = "url("+image+")";
    $("InfoList").style.backgroundImage = "url("+image+")";
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
        $("title").innerText=file.Metadata.Title + " - " + file.Metadata.Artist;
        $("creator").innerText="Created by " + file.Metadata.Creator;
        
    }).then(function(){
        
        $('difBoxContainer').innerHTML = "";
        var DifColor;
        for (var difNum = 0;difNum<SongData[songIndex].Versions.length;difNum++){
            DifColor = getVersionColor(SongData[songIndex].Versions[difNum].Name)
            

            $('difBoxContainer').innerHTML += "<button id=\"dif"+difNum+"\" class=\"dif "+DifColor+"\" onclick=\"selectDif("+difNum+")\"><p>"+SongData[songIndex].Versions[difNum].Name+"</p></button>";
        }
        loadaudio("song-audio/"+audioName,audioPreview)
        loadBG("song-bg/"+image)
    })
}

var selectedSong;
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
    $(selectedSong).classList.remove("selected");
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
    $('playDifContainer').innerHTML = '<button id="playDifButton" class="hoverinverse">Play</button>'
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


function aniLoadSongs() {
    if (debounceAni){
        debounceAni = false;
        loadMaps(function(response){
            select(0)
            load();
        })
        for (element of document.getElementsByClassName('screen2')){
            element.classList.add("fadeInAni");
            element.style.display = 'block';
        }
        const songLoadAnimatied = document.querySelector('.screen2')
        songLoadAnimatied.addEventListener('animationend',() =>{
            for (element of document.getElementsByClassName('screen2')){
                element.classList.remove("fadeInAni");
            }
            debounceAni = true;
        })
    }
}


//Background movment
addEventListener("mousemove",(e) => {
    var amountMovedX = (e.pageX * -1 / 64);
    var amountMovedY = (e.pageY * -1 / 64);
    $("imageBox").style.backgroundPosition = amountMovedX + 'px ' + amountMovedY + 'px';
})
/*
onmousemove = (function(e){
    console.log(e,this);
    var amountMovedX = (e.pageX * -1 / 6);
    var amountMovedY = (e.pageY * -1 / 6);
    this.css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});
*/