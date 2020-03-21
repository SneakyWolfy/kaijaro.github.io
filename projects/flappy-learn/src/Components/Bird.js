class Bird {
    constructor(brain) {
        this.x = 300;
        this.y = (canvas.height/2);
        this.rotation = 0;
        this.momentum = 0;
        this.score = 0;
        this.fitness = 0;
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(4, 8, 2);
        }
    }
  
    dispose() {
        this.brain.dispose();
    }

    mutate() {
      this.brain.mutate(0.3);
    }

    show(image, ctx){
        
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.rotation+this.momentum*Math.PI/180);
        ctx.drawImage(image, -bird.width/2, -bird.height/2, bird.width, bird.height)
        ctx.restore();
    }
    collide(pipe, ground){
        pipe.pipes.map(p => {
            if (p.pos<this.x && p.pos+pipe.width>this.x){ 
                if (p.gapHeight>this.y | p.gapHeight+pipe.gapDistance<this.y){
                    return true;
                }
            }
        })
        //ceiling collision
        if (this.y<0){
            return true;
        }

        //floor collision
        if (this.y>ground){
            return true;
        }

        return false;
    }

    jump(){
        this.momentum=-25
    }

    think(pipes) {
        // Find the closest pipe
        /*
        let closest = null;
        let closestD = Infinity;
        for (let i = 0; i < pipes.length; i++) {
        let d = pipes[i].x + pipes[i].w - this.x;
        if (d < closestD && d > 0) {
            closest = pipes[i];
            closestD = d;
        }
        }*/
        let ps = pipes.filter(p=>{
            return (!p.passed)
        })
        let last = ps[0].pos
        let closest = ps[0]
        ps.map(p => {
            if (p.pos<last){
                last=p.pos
                closest=p
            }
        })
    
        let inputs = [];
        inputs[0] = this.y / canvas.height; // bird y pos
        inputs[1] = (closest.gapHeight+pipe.gapDistance) / canvas.height; // pipe top pos
        inputs[2] = closest.gapHeight / canvas.height; // pipe bottom pos
        inputs[3] = (closest.pos+pipe.width-this.y) / canvas.width; //pipe distance
        //inputs[4] = this.momentum / 10;
        let output = this.brain.predict(inputs);
        //console.log(output[0]);
        //if (output[0] > output[1] && this.velocity >= 0) {
        if (output[0] > output[1]) {
            this.jump();
        }
    }

    offScreen() {
      return this.y > height || this.y < 0;
    }
  
    update() {
        this.score++
        this.momentum += 1
        this.y += this.momentum
    }
}