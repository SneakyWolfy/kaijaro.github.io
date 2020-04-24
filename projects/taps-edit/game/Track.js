class Track{
  constructor(skinData){
    this.state = {
      load:false,
      keyPress:[false, false, false, false],
      loading:false,
    }
    this.loadSkin(skinData);
  }

  setSkin = (skin) => {
    this.skinData = skin
    this.state.loaded = true;
    this.state.loading = false;
  }

  loadSkin = async (skinPath) => {
    if (this.state.loading){
      return
    }
    this.state.loading = true
    this.state.loaded = false;
    let skinFolder = Asset.initData.skinFolder;
    let responce = await Reader.parseIni(`${skinFolder}/${skinPath}/skin.ini`);
    this.setSkin(responce);
  }

  interface = () => {
      console.log(this.skinData['Mania-4k'].KeyImage1D)
  }
  
  drawLights = () => {
    this.skinData[`Mania-4k`]['ColumnPositions'].map((value, index) => {
      this.skinData['Mania-4k'].StageLight.show(value*scale)
    })
  }

  setKeyStat = (index, value) => {
    this.state.keyPress[index] = value;
  }

  drawKeys = () => {
    this.skinData[`Mania-4k`]['ColumnPositions'].map((value, index) => {
      switch (index){
        case 0:
        case 3:
          this.state.keyPress[index] 
            ? this.skinData['Mania-4k'].KeyImage1D.show(value*scale)
            : this.skinData['Mania-4k'].KeyImage1.show(value*scale)
          break;
        case 1:
        case 2:
          this.state.keyPress[index] 
            ? this.skinData['Mania-4k'].KeyImage1D.show(value*scale)
            : this.skinData['Mania-4k'].KeyImage1.show(value*scale)
          break;
      }
    })
  }

  draw = () => {
    if (!this.state.loaded){
      return;
    }
    this.skinData['Mania-4k'].StageLeft.show()
    this.skinData['Mania-4k'].StageRight.show()
    this.skinData['Mania-4k'].StageHint.show()
    //this.skinData['Mania-4k'].Hit300.show()
    //this.drawLights()
    this.drawKeys()
  }
}

/*
class Track{
    skinPath = './skins';
    default = '/default';
    
    constructor(track){

        // Config

        try {
            let UpsideDown = parseInt(track.config.UpsideDown);
            let JudgementLine = parseInt(track.config.JudgementLine);
            let HitPosition = parseInt(track.config.HitPosition);
            let ScorePosition = parseInt(track.config.ScorePosition);
            let ComboPosition = parseInt(track.config.ComboPosition);

            this.Config = {
                UpsideDown: UpsideDown,
                JudgementLine: JudgementLine,
                HitPosition: HitPosition,
                ScorePosition: ScorePosition,
                ComboPosition: ComboPosition,
                };
        } catch (error) {
            console.warn(`Unable to load Track.Config\n${error}`);
        }
        
        // Combo

        try {
            let FontCombo = track.combo.FontCombo;
            let ColourBreak = this.GetColorString(track.combo.ColourBreak);
            let ColourHold = this.GetColorString(track.combo.ColourHold);

            this.Combo = {
                FontCombo: FontCombo,
                ColourBreak: ColourBreak,
                ColourHold: ColourHold,
            }; 
        } catch (error) {
            console.warn(`Unable to load Track.Combo\n${error}`);
        }

        //Barline

        try {
            let BarlineWidth = parseInt(track.barline.BarlineWidth);
            let ColourBarline = this.GetColorString(track.barline.ColourBarline);

            this.Barline = {
                BarlineWidth: BarlineWidth,
                ColourBarline: ColourBarline,
            };
        } catch (error) {
            console.warn(`Unable to load Track.Barline\n${error}`);
        }

        // Columns

        try {
            let ColumnStart = parseInt(track.columns.ColumnStart);
            let ColumnWidth = track.columns.ColumnWidth.split(",");

            this.Columns = {
                ColumnStart: ColumnStart,
                ColumnWidth: ColumnWidth,
            } 
        } catch (error) {
            console.warn(`Unable to load Track.Columns\n${error}`);
        }

        // ColumnLine
        
        try {
            let ColumnLine = track.columnLine.ColumnLine.split(",");
            let ColourColumnLine = this.GetColorString(track.columnLine.ColourColumnLine);
            let ColumnLineWidth = parseFloat(track.columnLine.ColumnLineWidth);
            
            this.columnLine = {
                ColumnLine: ColumnLine,
                ColourColumnLine: ColourColumnLine,
                ColumnLineWidth: ColumnLineWidth,
            } 
        } catch (error) {
            console.warn(`Unable to load Track.ColumnLine\n${error}`);
        }

        //Colours

        try {
            let Colour1 = this.GetColorString(track.colours.Colour1);
            let Colour2 = this.GetColorString(track.colours.Colour2);
            let Colour3 = this.GetColorString(track.colours.Colour3);
            let Colour4 = this.GetColorString(track.colours.Colour4);

            this.colours = {
                Colour1: Colour1,
                Colour2: Colour2,
                Colour3: Colour3,
                Colour4: Colour4,
            } 
        } catch (error) {
            console.warn(`Unable to load Track.Colours\n${error}`);
        }

        //Stagelight
        
        try {
            let LightFramePerSecond = parseInt(track.stagelight.LightFramePerSecond)
            let ColourLight1 = this.GetColorString(track.stagelight.ColourLight1);
            let ColourLight2 = this.GetColorString(track.stagelight.ColourLight2);
            let ColourLight3 = this.GetColorString(track.stagelight.ColourLight3);
            let ColourLight4 = this.GetColorString(track.stagelight.ColourLight4);
            let Light = this.GetImageFromRef(track.stagelight.Light);

            let ManiaStageLeft = this.GetImageFromRef(track.stagelight.ManiaStageLeft);
            let ManiaStageLeftHeight = canvas.height;
            let ManiaStageLeftWidth = ManiaStageLeft.naturalWidth*(canvas.height/ManiaStageLeft.naturalHeight)
            let ManiaStageLeftPos = {x:this.Columns.ColumnStart*scale-ManiaStageLeftWidth,y:0}

            let ManiaStageRight = this.GetImageFromRef(track.stagelight.ManiaStageRight);
            let ManiaStageRightHeight = canvas.height;
            let ManiaStageRightWidth = ManiaStageRight.naturalWidth*(canvas.height/ManiaStageRight.naturalHeight)
            let ManiaStageRightPos = {x:(this.Columns.ColumnStart+this.arrSum(this.Columns.ColumnWidth))*scale,y:0}

            let ManiaStageHint = this.GetImageFromRef(track.stagelight.ManiaStageHint)

            this.stagelight = {
                LightFramePerSecond: LightFramePerSecond,
                Light: Light,
                ColourLight1: ColourLight1,
                ColourLight2: ColourLight2,
                ColourLight3: ColourLight3,
                ColourLight4: ColourLight4,
                ManiaStageLeft: {img:ManiaStageLeft, x:ManiaStageLeftPos.x, y:ManiaStageLeftPos.y, height:ManiaStageLeftHeight, width:ManiaStageLeftWidth},
                ManiaStageRight: {img:ManiaStageRight, x:ManiaStageRightPos.x, y:ManiaStageRightPos.y, height:ManiaStageRightHeight, width:ManiaStageRightWidth},
                ManiaStageHint: ManiaStageHint,
            } 

        } catch (error) {
            console.warn(`Unable to load Track.Stagelight\n${error}`);
        }

        // Notes

        try {
            let NoteImage0 = this.GetImageFromRef(track.notes.NoteImage0);
            let NoteImage0H = this.GetImageFromRef(track.notes.NoteImage0H);
            let NoteImage0L = this.GetImageFromRef(track.notes.NoteImage0L);
            let NoteImage1 = this.GetImageFromRef(track.notes.NoteImage1);
            let NoteImage1H = this.GetImageFromRef(track.notes.NoteImage1H);
            let NoteImage1L = this.GetImageFromRef(track.notes.NoteImage1L);
            let NoteImage2 = this.GetImageFromRef(track.notes.NoteImage2);
            let NoteImage2H = this.GetImageFromRef(track.notes.NoteImage2H);
            let NoteImage2L = this.GetImageFromRef(track.notes.NoteImage2L);
            let NoteImage3 = this.GetImageFromRef(track.notes.NoteImage3);
            let NoteImage3H = this.GetImageFromRef(track.notes.NoteImage3H);
            let NoteImage3L = this.GetImageFromRef(track.notes.NoteImage3L);

            this.notes = {
                NoteImage0: NoteImage0,
                NoteImage0H: NoteImage0H,
                NoteImage0L: NoteImage0L,
                NoteImage1: NoteImage1,
                NoteImage1H: NoteImage1H,
                NoteImage1L: NoteImage1L,
                NoteImage2: NoteImage2,
                NoteImage2H: NoteImage2H,
                NoteImage2L: NoteImage2L,
                NoteImage3: NoteImage3,
                NoteImage3H: NoteImage3H,
                NoteImage3L: NoteImage3L,
            } 
        } catch (error) {
            console.warn(`Unable to load Track.Notes\n${error}`);
        }

        //Keys

        try {
            let KeyImage0 = this.GetImageFromRef(track.keys.KeyImage0);
            let KeyImage0D = this.GetImageFromRef(track.keys.KeyImage0D);
            let KeyImage1 = this.GetImageFromRef(track.keys.KeyImage1);
            let KeyImage1D = this.GetImageFromRef(track.keys.KeyImage1D);
            let KeyImage2 = this.GetImageFromRef(track.keys.KeyImage2);
            let KeyImage2D = this.GetImageFromRef(track.keys.KeyImage2D);
            let KeyImage3 = this.GetImageFromRef(track.keys.KeyImage3);
            let KeyImage3D = this.GetImageFromRef(track.keys.KeyImage3D);

            this.keys = {
                KeyImage0: KeyImage0,
                KeyImage0D: KeyImage0D,
                KeyImage1: KeyImage1,
                KeyImage1D: KeyImage1D,
                KeyImage2: KeyImage2,
                KeyImage2D: KeyImage2D,
                KeyImage3: KeyImage3,
                KeyImage3D: KeyImage3D,
            } 
        } catch (error) {
            console.warn(`Unable to load Track.Keys\n${error}`);
        }
    }

    GetColorString = (color) => {
        let colorArr = color.split(",")
        return `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${parseInt(colorArr[3])/255})`
    };

    GetImageFromRef = (ref) => {
        let link = this.skinPath + this.default + '/' + ref
        let image = new Image();
        image.src = link
        return image
    }

    arrSum = (arr) => {
        return arr.reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue), 0)
    }

    interface = () => {
        console.log(this)
        console.log(ctx)
    }
    
    
    draw = () => {

        let drawStage = () => {
            ctx.drawImage(this.stagelight.ManiaStageLeft.img, this.stagelight.ManiaStageLeft.x, this.stagelight.ManiaStageLeft.y, this.stagelight.ManiaStageLeft.width, this.stagelight.ManiaStageLeft.height)
            ctx.drawImage(this.stagelight.ManiaStageRight.img, this.stagelight.ManiaStageRight.x, this.stagelight.ManiaStageRight.y, this.stagelight.ManiaStageRight.width, this.stagelight.ManiaStageRight.height)
        }
        drawStage()
        ctx.drawImage(this.stagelight.ManiaStageHint, 500, 700)
        ctx.drawImage(this.keys.KeyImage0D, 500, 700)
        
    }
}
*/