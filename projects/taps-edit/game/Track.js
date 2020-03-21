class Track{
    defaults={
        width:20,
        height:100,
        healthWidth:1,
        maniaStageLeft:()=>{
            let image = new Image();
            image.src = '../skin/visuals/mania-stage-left.png';
            return image;
        },
        maniaStageRight:()=>{
            let image = new Image();
            image.src = '../skin/visuals/mania-stage-right.png';
            return image;
        }
    }
    constructor(){

    }

    draw(){
        
    }
}