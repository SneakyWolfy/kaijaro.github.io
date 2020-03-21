//import { resetMaxTextureSize } from "@tensorflow/tfjs-core/dist/backends/webgl/webgl_util";
//import { setWebGLContext } from "@tensorflow/tfjs-core/dist/webgl";

//import * as tf from '@tensorflow/tfjs.js';

const $ = (el) => {
    return document.querySelector(el);
}

/*
function createModel() {
    const NEURONS = 6;
    const hiddenLayer = tf.layers.dense({
        units: NEURONS,
        inputShape: [2]
    });
    
    const outputLayer = tf.layers.dense({
        units: 1,
    });

    var birdModel = tf.sequential(); 
    birdModel.add(hiddenLayer);
    birdModel.add(outputLayer);
    birdModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    return birdModel;
}
*/

function initCanvas(){
    const canvas = $("canvas");
    const ctx = canvas.getContext('2d'); 
    var scale = 1;
    canvas.width = 1920 * scale;
    canvas.height = 1080 * scale;
    return {
        canvas:{
            canvas:canvas,
            width:1920,
            height:1080
        },
        ctx:ctx
    }
}

function initBG(){
    bg = new Image();
    bg.src = './Assets/Backgrounds/bg.jpg';
    return {
        src:bg,
        pos:0,
        width:1920,
        height:1080,
        transitionSpeed:1
    }
}

function initGround(){
    let ground = new Image();
    ground.src = './Assets/Sprites/ground.png';
    let groundObj={
        src:ground,
        pos:0,
        width:160,
        height:160,
        transitionSpeed:8,
        layers:1
    }
    
    return groundObj
}

function setBG(){
    bg.pos = 0
}

function setGround(){
    ground.pos=0
    ground.distanceFromCeiling=canvas.height-ground.height*ground.layers;
}

function initPipe(){
    var pipeBody = new Image();
    var pipeTop = new Image();
    var pipeTop2 = new Image();
    pipeBody.src = './Assets/Sprites/pipe-body.png';
    pipeTop.src = './Assets/Sprites/pipe-top.png';
    pipeTop2.src = './Assets/Sprites/pipe-top2.png';
    pipe = {
        body:pipeBody,
        top:pipeTop,
        top2:pipeTop2,
        width:150,
        relativeBodyHeight:2.1512605042016806,
        gapDistance:350,
        pipeSpacing:300,
        initialDistance:1500,
        transitionSpeed:8,
        maxGapDistanceFromScreen:85,
        pipes:[]
    }

    pipe.bodyHeight = parseInt(pipe.width*pipe.relativeBodyHeight);
    pipe.heightoffset = pipe.width/3.7
    return pipe
}

function initBird(){
    let bird = new Image();
    bird.src = './Assets/Sprites/cheep.png';
    return {
        src:bird,
        //posX:300,
        //posY:600,
        width: 80,
        height: 75,
        //rotation: 0,
        //momentum: 0,
       // score:0
    }  
}

function initGame(){
    return {
        state:'uninitiated'
    }
}

function initScore(){
    var bestScore = localStorage.getItem('bestScore')

    if (bestScore===null){
        localStorage.setItem('bestScore', 0) 
        bestScore = localStorage.getItem('bestScore')
    }

    let score = {
        currentScore:0,
        bestScore:bestScore,
        bestScoreDiv:$("#bestScoreContainer"),
        currentScoreDiv:$("#currentScoreContainer")
    }
    score.bestScoreDiv.textContent = `Best Score ${score.bestScore}`

    return score
}

function setScore(){
    score.currentScore=0;
    score.bestScoreDiv.textContent = `Best Score ${score.bestScore}`
    score.currentScoreDiv.textContent = `Current Score ${score.currentScore}`
}

function setBird(){
    bird.posX = 300;
    bird.posY = (canvas.height/2);
    bird.rotation = 0;
    bird.momentum = 0;
    bird.score = 0;
}

function setPipe(){
    pipe.pipes = []
    var spacing = 0
    while (spacing-pipe.width<=canvas.width+pipe.pipeSpacing+pipe.width){
        pipe.pipes.push({
            gapHeight:Math.random()*(canvas.height-pipe.maxGapDistanceFromScreen*2-ground.height*ground.layers-pipe.gapDistance)+pipe.maxGapDistanceFromScreen,
            pos:pipe.initialDistance+(spacing),
            passed:false,
        })
        spacing+=pipe.pipeSpacing+pipe.width
    }
}

function initiate() {
    var {canvas, ctx} = initCanvas()
    var bg = initBG();
    var ground = initGround();
    var pipe = initPipe();
    var bird = initBird();
    var game = initGame();
    var score = initScore();
    var birdModel = new NeuralNetwork(4, 8, 2);

    return {
        bg:bg,
        ground:ground,
        pipe:pipe,
        canvas:canvas,
        ctx:ctx,
        bird:bird,
        game:game,
        score:score,
        birdModel:birdModel
    };
}


function loadBackground() {
    (bg.pos<=-bg.width) ? bg.pos+=bg.width-bg.transitionSpeed : bg.pos -= bg.transitionSpeed;
    
    for (var i=0;i<2;i++){
        ctx.drawImage(bg.src,bg.pos+canvas.width*i,0,bg.width,bg.height)
    }
}

function loadGround() {
    (ground.pos<=-ground.width) ? ground.pos+=ground.width: '';

    (game.state==='started') ? ground.pos -= ground.transitionSpeed : ''

    let p=0;
    while (p<canvas.width+ground.width){
        for (var i=0;i<ground.layers;i++){
            ctx.drawImage(ground.src,ground.pos+p,canvas.height-ground.height*(i+1),ground.width,ground.height)
        }
        p+=ground.width;
    }
}

function managePipe() {
    let last=0
    pipe.pipes.map(p => {
        if (last<p.pos){
            last=p.pos
        }
    })
    return last+(pipe.pipeSpacing+pipe.width)
}

function loadPipes(){
    pipe.pipes.map(p => {
        if (p.pos<0-pipe.width) {
            p.pos=managePipe()
            p.gapHeight = Math.random()*(canvas.height-pipe.maxGapDistanceFromScreen*2-ground.height*ground.layers-pipe.gapDistance)+pipe.maxGapDistanceFromScreen,
            p.passed = false
        }

        (game.state==='started') ? p.pos -= pipe.transitionSpeed : ''

        //build lower body

        var i=0;
        while(p.gapHeight-pipe.gapDistance+pipe.bodyHeight*(i)<canvas.height){
            ctx.drawImage(pipe.body, p.pos, p.gapHeight+pipe.gapDistance+pipe.bodyHeight*(i), pipe.width, pipe.bodyHeight)
            i++
        }

        //build upper body
        
        i=0
        while(p.gapHeight-pipe.bodyHeight*(i)>0){
            ctx.drawImage(pipe.body, p.pos, p.gapHeight-pipe.bodyHeight*(i+1), pipe.width, pipe.bodyHeight)
            i++
        }

        //build lower top
        ctx.drawImage(pipe.top, p.pos, p.gapHeight-pipe.heightoffset+pipe.gapDistance, pipe.width, pipe.width)

        //build upper top
        ctx.drawImage(pipe.top2, p.pos, p.gapHeight+pipe.heightoffset-pipe.width, pipe.width, pipe.width)
    })
}

function loadBird() {
    if (game.state==='started'){
        for (let i = birds.length - 1; i >= 0; i--){
            birds[i].update()
            
        }
    }
    for (let i = birds.length - 1; i >= 0; i--){
        birds[i].show(bird.src, ctx)
    }
}

savedBirds = []
function checkCollision(){
    //pipe collision
    for (let i = birds.length - 1; i >= 0; i--){
        console.log(birds[i].collide(pipe, ground.distanceFromCeiling))
        if (birds[i].collide(pipe, ground.distanceFromCeiling)){
            
            savedBirds.push(birds.splice(i, 1)[0]);
        }
    }
    if (birds.length===0){
        lose()
    }
    /*
    pipe.pipes.map(p => {
        if (p.pos<bird.posX && p.pos+pipe.width>bird.posX){
            if (p.gapHeight>bird.posY | p.gapHeight+pipe.gapDistance<bird.posY){
                lose()
            }
        }
    })

    //ceiling collision
    if (bird.posY<0){
        lose()
    }

    //floor collision
    if (bird.posY>ground.distanceFromCeiling){
        lose()
    }
    */
}

function lose() {
    game.state='losing';
    bird.momentum=-20;
    localStorage.setItem('bestScore', score.bestScore);
    nextGeneration()
    reset();
    game.state='started';
}

var bigBrain = new NeuralNetwork(4, 7, 2)
function nextGeneration() {
    console.log('next generation');
    calculateFitness();
    for (let i = 0; i < TOTAL; i++) {
      birds[i] = pickOne();
    }
    for (let i = 0; i < TOTAL; i++) {
      savedBirds[i].dispose();
    }
    savedBirds = [];
  }
  
  function pickOne() {
    let index = 0;
    let r = Math.random();
    while (r > 0) {
      r = r - savedBirds[index].fitness;
      index++;
    }
    index--;
    let bird = savedBirds[index];
    let child = new Bird(bird.brain);
    child.mutate();
    return child;
  }
  
  function calculateFitness() {
    let sum = 0;
    for (let bird of savedBirds) {
      sum += bird.score;
    }
    for (let bird of savedBirds) {
      bird.fitness = bird.score / sum;
    }
    console.log(sum)
  }

function reset(){
    setBG()
    setGround()
    setScore()
    //setBird()
    setPipe()
    //birdModel = createModel()
}

function increaseScore(){
    var audio = new Audio();
    audio.src = "Assets/Audio/scoreSound.mp3";
    audio.currentTime = .6
    audio.play();
    score.currentScore++;
    (score.currentScore>score.bestScore)?score.bestScore++:'';
    score.bestScoreDiv.textContent = `Best Score ${score.bestScore}`;
    score.currentScoreDiv.textContent = `Current Score ${score.currentScore}`;
}

function loadScore() {
    pipe.pipes.map(p => {
        if (p.passed===false && p.pos+pipe.width<bird.posX){
            p.passed=true
            increaseScore()
        }
    })
}

function animate(){
    loadBackground();
    loadPipes();
    loadGround();
    loadBird();
    loadScore();
    //loadUI()
    //loadEffects();
    (game.state === 'started')?checkCollision():'';
    requestAnimationFrame(animate);
}

var {bg, canvas, ctx, ground, pipe, bird, game, score, birdModel} = initiate()
reset()
TOTAL = 14;
var birds = []; 
for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
}


function jump(){
    bird.momentum=-25
}
requestAnimationFrame(animate)

window.addEventListener('keydown',initiateGame)
window.addEventListener('keydown',HandleKeypress)
window.addEventListener('keyup',HandleKeyUp)

var keyState = {
    'Space':false,
    'KeyW':false,
    'KeyR':false
}
var health = performance.now()

function HandleKeypress(e){
	switch (keyState[e.code]){
		case false:
			keyState[e.code] = true;
			PressKey(e.code)
            return
        default:
            return
	}
}

function HandleKeyUp(e){
	switch (keyState[e.code]){
		case true:
			keyState[e.code] = false;
			ReleaseKey(e.code)
			return
	}
}

function initiateGame(e){
    if(e.code==="Space"){
        game.state = 'started'
        window.removeEventListener('keydown',initiateGame)
    }
}

function PressKey(key){
	switch (key){
        case'Space'://start/jump
            (game.state === 'started')?jump():''
            return
        case'KeyW'://pause
            (game.state === 'started')?game.state='pause':game.state='started'
            return
        case'KeyR'://dump
            console.group("Debug Log");
            //State
                console.group("State");
                console.table(getState())
                console.groupEnd("State");
            //Variable
                console.group("Variables");
                [{bg}, {canvas}, {ctx}, {ground}, {pipe}, {bird}, {game}, {score}].map(v=>{
                    console.log(JSON.parse(JSON.stringify(v)))
                })
                
                console.groupEnd("Variables");
            console.groupEnd("Debug Log");
        return
	}
}

function ReleaseKey(key){
	switch (key){
        case'Space':
			return
	}
}

function getNextPipe(){
    let ps = pipe.pipes.filter(p=>{
        return (!p.passed)
    })
    let last = ps[0].pos
    let nextpipe = ps[0]
    ps.map(p => {
        if (p.pos<last){
            last=p.pos
            nextpipe=p
        }
    })
    
    return nextpipe
}

function getState(){
    var nextPipe=getNextPipe()
    return {
        heightDistance:ground.distanceFromCeiling-bird.posY,
        horizontalDistance:nextPipe.pos-bird.posX,
        birdHeight:bird.posY,
        momentum:bird.momentum,
    }
}
var i = 0;
function ai(){
    if(game.state==='started'){
        for (let i = birds.length - 1; i >= 0; i--){
            birds[i].think(pipe.pipes);
        }
    }
    
    requestAnimationFrame(ai)
}
ai()


function think(inputs){
    let output = birdModel.predict(inputs);
    if (output[0] > output[1]) {
        jump();
    }
}
