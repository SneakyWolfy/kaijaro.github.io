class Asset {
  skinPath = "./skins";

  static initData = {
    skinFolder: "./skins",
    skinExtention: ".png",
    upScale: "@2x.png",
  };
  constructor(name, path = "/default", origin = "TopLeft", x=0, y=0, ext = ".png") {
    this.name = name;
    this.path = path;
    this.origin = origin;
    this.x = x;
    this.y = y;
    this.ext = ext;
    this.scale = scale;
  }
}

class Sprite extends Asset {
  type = 'Sprite'
  constructor(img, name, path = "/default", origin = "TopLeft", x=0, y=0, ext = ".png") {
    super(name, path, origin, x, y, ext);
    this.img = img;
    this.src = img.src;
    this.width = img.naturalWidth;
    this.height = img.naturalHeight;
    this.aspectRatio = img.naturalWidth / img.naturalHeight;
    
  }

  show(offsetX=0,offsetY=0) {
    switch (this.origin) {
      case "Top":
        offsetX-=this.width/2
        break;
      case "TopRight":
        offsetX-=this.width
        break;
      case "Left":
        offsetY-=this.height/2
        break;
      case "Center":
        offsetX-=this.width/2
        offsetY-=this.height/2
        break;
      case "Right":
        offsetX-=this.width
        offsetY-=this.height/2
        break;
      case "BottomLeft":
        offsetY-=this.height
        break;
      case "Bottom":
        offsetX-=this.width/2
        offsetY-=this.height
        break;
      case "BottomRight":
        offsetX-=this.width
        offsetY-=this.height
        break;
    }
    ctx.drawImage(this.img, this.x+offsetX, this.y+offsetY, this.width, this.height)
  }
  setOrientation(x, y, width, height, origin, scale=this.scale){
    this.x = x*scale;
    this.y = y*scale;
    this.width = width*scale;
    this.height = height*scale;
    this.origin = origin;

    this.img.width = width;
    this.img.height = height;
  }
}

class Animation extends Asset {
  type = 'Animation'
  constructor(animation, frameRate, name, path = "/default", origin = "TopLeft", x=0, y=0, ext = ".png") {
    super(name, path, origin, x, y, ext);
    this.animation = animation;
    this.frames = animation.length;
    this.frameRate = frameRate;
    this.width = animation[0].img.naturalWidth;
    this.height = animation[0].img.naturalHeight;
  }

  show() {}
}

//take image perameters (ref, animationable ect)

//async load:
//test if image has an animation on the documented path
//if not, test if image can load on the documented path
//if not, test if image has an animation on the default path

//if not, test if image can load on the default path
//if not, warn image unable to load
