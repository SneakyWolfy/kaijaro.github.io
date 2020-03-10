class Background{
    constructor(src="", width=1920, height=1080){
        this.src = src;
        this.width = width;
        this.height = height;
    }
    draw(){
        ctx.drawImage(bg.src,0,0,bg.width,bg.height)
    }
}