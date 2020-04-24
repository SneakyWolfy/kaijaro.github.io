class Reader {
  static parseINIString = (data) => {
    var regex = {
      section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
      param: /^\s*([^:]+?)\s*:\s*(.*?)\s*$/,
      comment: /^\s*\/\//,
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    var duplicationList = {};
    lines.forEach(function (line) {
      if (regex.comment.test(line)) {
        return;
      } else if (regex.param.test(line)) {
        let match = line.match(regex.param);
        section
          ? (value[section][match[1]] = match[2])
          : (value[match[1]] = match[2]);
      } else if (regex.section.test(line)) {
        var match = line.match(regex.section);
        section = match[1];
        if (match[1] in value) {
          duplicationList[section]++;
          section += `-` + duplicationList[section];
        }
        value[section] = {};
        duplicationList[section] = 0;
      } else if (line.length == 0 && section) {
        section = null;
      }
    });
    console.log(value);
    Object.keys(value).map((key) => {
      if ("Keys" in value[key]) {
        value[`${key.match(/^\w*/)}-${value[key]["Keys"]}k`] = value[key];
        !delete value[key];
      }
    });
    return value;
  };

  static parseIni = async (path) => {
    const res = await fetch(encodeURIComponent(path));
    const text = await res.text();
    let value = this.parseINIString(text);
    let structuredValue = await this.partialStructureData(value, path);

    return structuredValue;
  };

  //check if animation or image

  //check for upscale

  //check for defult

  /*
    check if loadable
      ? if can load as animation or sprite => return results
      ? if can't load as animation or sprite => load as default animation or sprite
      ? if can't load as default animation or sprite => error

    check animation if animation check is true
      ? is animation => load animation Then try to load @2x 
      ? isn't animation => load as sprite Then try to load @2x 
      ? can't load sprite => call back error to use root assets
    
    check for upscale
      ? if can't load => there's no @2x
  
  */
  static loadImage = async (
    name,
    path,
    animationCheck = true,
    upscaleCheck = true,
    returnDefault = true
  ) => {

    return new Promise(async (resolve) => {
      let ImageLoader = (name, path) => {
        let checkAnimation = () => {
          return new Promise(async (resolve) => {
            if (!animationCheck) {
              resolve(false);
            }
            let animation = await this.loadAnimation(name, path);
            if (!animation.loaded) {
              resolve(false);
            }
            resolve(animation);
          });
        };

        let checkImage = (ani) => {
          return new Promise(async (resolve) => {
            if (ani) {
              resolve(ani);
            }
            let img = await this.loadSprite(name, path);
            resolve(img);
          });
        };

        return new Promise(async (resolve) => {
          let animation = await checkAnimation();
          let image = await checkImage(animation);
          resolve(image);
        });
      };

      let ImageProvider = (name) => {
        return new Promise(async (resolve) => {
          let image = await ImageLoader(name, path);
          if (image.loaded) {
            resolve(image);
          }
          image = await ImageLoader(name, "default");
          resolve(image);
        });
      };

      let value = await ImageProvider(name);
      resolve(value);
    })

    
  };
  static loadAnimation = async (name, path, loadRange = 80) => {
    let testAnimation = async () => {
      return await this.loadSprite(`${name}-0`, path);
    };
    let animatable = await testAnimation();
    if (!animatable.loaded) {
      return false;
    } else {
      let animations = [];

      for (let i = 0; i < loadRange + 1; i++) {
        animations.push(this.loadSprite(`${name}-${i}`, path));
      }

      let vals = await Promise.all(animations);
      let filteredVals = vals.filter((val) => {
        return val.loaded;
      });
      return { type: "Animation", loaded: true, values: filteredVals, path:path, name:name,ext:'.png' };
    }
  };

  static loadSprite = (name, path) => {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = encodeURIComponent(
        `${`${Asset.initData.skinFolder}/${path}/${name}`}.png`
      );
      image.onload = () => {
        resolve({
          img: image,
          type: "Sprite",
          src: `${`${Asset.initData.skinFolder}/${path}/${name}`}.png`,
          uri: image.src,
          extention: `.png`,
          loaded: true,
          name: name,
          path: path,
        });
      };
      image.onerror = () => {
        resolve({
          loaded: false,
          src: `${`${Asset.initData.skinFolder}/${path}/${name}`}.png`,
        });
      };
    });
  };

  static partialStructureData = async (data, path) => {
    return new Promise(async (resolve) => {
      const initialFormation = [
        {
          name: "Name",
          default: "default",
          data: "String",
          section: "General",
        },
        {
          name: "Author",
          default: "-",
          data: "String",
          section: "General",
        },
        {
          name: "Version",
          default: "Latest",
          data: "String",
          section: "General",
        },
        {
          name: "LayeredHitSounds",
          default: "1",
          data: "Bool",
          section: "General",
        },
        {
          name: "Keys",
          default: "4",
          data: "Int",
          section: "Mania-4k",
        },
        {
          name: "ColumnStart",
          default: "136",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "ColumnRight",
          default: "19",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "ColumnSpacing",
          default: "0,0,0",
          data: "Array<Number>",
          section: "Mania-4k",
        },
        {
          name: "ColumnWidth",
          default: "30,30,30,30",
          data: "Array<Number>",
          section: "Mania-4k",
        },
        {
          name: "ColumnLineWidth",
          default: "2,2,2,2,2",
          data: "Array<Number>",
          section: "Mania-4k",
        },
        {
          name: "BarlineHeight",
          default: "1.2",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "HitPosition",
          default: "402",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "LightPosition",
          default: "413",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "ScorePosition",
          default: "325",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "ComboPosition",
          default: "111",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "JudgementLine",
          default: "1",
          data: "Bool",
          section: "Mania-4k",
        },
        {
          name: "StageSeparation",
          default: "40",
          data: "Number",
          section: "Mania-4k",
        },
        {
          name: "Colour",
          default: "0,0,0,255",
          data: "RGBA",
          suffex: "1,2,3,4",
          section: "Mania-4k",
        },
        {
          name: "ColourLight",
          default: "255,255,255",
          data: "RGBA",
          suffex: "1,2,3,4",
          section: "Mania-4k",
        },
        {
          name: "ColourColumnLine",
          default: "255,255,255,255",
          data: "RGBA",
          section: "Mania-4k",
        },
        {
          name: "ColourBarline",
          default: "255,255,255,255",
          data: "RGBA",
          section: "Mania-4k",
        },
        {
          name: "ColourJudgementLine",
          default: "255,255,255",
          data: "RGBA",
          section: "Mania-4k",
        },
        {
          name: "ColourKeyWarning",
          default: "0,0,0",
          data: "RGBA",
          section: "Mania-4k",
        },
        {
          name: "ColourHold",
          default: "255,191,51,255",
          data: "RGBA",
          section: "Mania-4k",
        },
        {
          name: "ColourBreak",
          default: "255,0,0",
          data: "RGBA",
          section: "Mania-4k",
        },
      ];

      let spriteFormation = [
        {
          name: "KeyImage1",
          default: "mania-key1",
          data: "KeyImage",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "KeyImage2",
          default: "mania-key2",
          data: "KeyImage",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "KeyImage1D",
          default: "mania-key1D",
          data: "KeyImage",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "KeyImage2D",
          default: "mania-key2D",
          data: "KeyImage",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "NoteImage1",
          default: "mania-note1",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "NoteImage2",
          default: "mania-note2",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "NoteImage1H",
          default: "mania-note1H",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "NoteImage2H",
          default: "mania-note2H",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "NoteImage1L",
          default: "mania-note1L",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "NoteImage2L",
          default: "mania-note2L",
          data: "NoteImage",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "StageLeft",
          default: "mania-stage-left",
          data: "StageLeft",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "StageRight",
          default: "mania-stage-right",
          data: "StageRight",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "StageHint",
          default: "mania-stage-hint",
          data: "StageHint",
          section: "Mania-4k",
          animationCheck: false,
        },
        {
          name: "StageLight",
          default: "mania-stage-light",
          data: "StageLight",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "LightingN",
          default: "LightingN",
          data: "LightingN",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "LightingL",
          default: "LightingL",
          data: "LightingL",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit0",
          default: "mania-hit0",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit50",
          default: "mania-hit50",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit100",
          default: "mania-hit100",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit200",
          default: "mania-hit200",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit300",
          default: "mania-hit300",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
        {
          name: "Hit300g",
          default: "mania-hit300g",
          data: "HitSprite",
          section: "Mania-4k",
          animationCheck: true,
        },
      ];

      let formatedData = {};

      let GetColorString = (color) => {
        let colorArr = color.split(",");
        if (colorArr.length != 4) {
          colorArr.push("255");
        }
        return `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${
          parseInt(colorArr[3]) / 255
        })`;
      };

      let formatData = (d, type) => {
        if (type === "String") {
          return d;
        } else if (type === "Bool") {
          return +d;
        } else if (type === "Int") {
          return parseInt(d);
        } else if (type === "Number") {
          return +d;
        } else if (type === "RGBA") {
          return GetColorString(d);
        } else if (type === "Array<Number>") {
          return d.split(",").map((element) => {
            return +element;
          });
        }
        console.warn(`${type} is not a known type.`);
      };

      let prepareData = (name, d) => {
        let typedData;
        console.log(data)
        if (!data[d.section]){
          data[d.section] = {}
        }

        if (name in data[d.section]) {
          typedData = formatData(data[d.section][name], d.data);
        } else {
          typedData = formatData(d.default, d.data);
        }
        if (!(d.section in formatedData)) {
          formatedData[d.section] = {};
        }
        formatedData[d.section][name] = typedData;
      };

      initialFormation.map((initialData) => {
        !("suffex" in initialData)
          ? prepareData(initialData.name, initialData)
          : initialData.suffex.split(",").forEach((element) => {
              prepareData(initialData.name + element, initialData);
            });
      });

      let arrSum = (arr) => {
        return arr.reduce(
          (accumulator, currentValue) =>
            parseInt(accumulator) + parseInt(currentValue),
          0
        )
      }

      let TrackWidth = arrSum(formatedData[`Mania-4k`][`ColumnWidth`])

      var columnPositions = formatedData[`Mania-4k`][`ColumnWidth`].map((width, index) => {
        return arrSum(formatedData[`Mania-4k`][`ColumnWidth`].slice(0,index+1))-(formatedData[`Mania-4k`][`ColumnWidth`][index]/2)
      })

      formatedData[`Mania-4k`]['TrackWidth'] = TrackWidth;
      formatedData[`Mania-4k`]['ColumnPositions'] = columnPositions;

      let formatSprite = async (name, d) => {
        return new Promise(async (resolve) => {
          let image = await this.loadImage(name, formatedData.General.Name, d.animationCheck);
          let sprite;
          switch (image.type){
            case "Sprite":
              sprite = new Sprite(image.img,name,image.path)
              break;
            case "Animation":
              sprite = new Animation(image.values, 60, image.path)
              break;
          }

          let height;
          let width;
          let x;
          let y;

          switch (d.data) {
            case "StageLeft":
              height = 480;
              width = height * sprite.aspectRatio;
              x = formatedData[d.section][`ColumnStart`];
              y = 480;
              sprite.setOrientation(x,y,width,height,'BottomRight')
              break;
            case "StageRight":
              height = 480;
              width = height * sprite.aspectRatio;
              x = formatedData[d.section][`ColumnStart`] + TrackWidth;
              y = 480;
              sprite.setOrientation(x, y, width, height, "BottomLeft");
              break;
            case "StageHint":
              width = TrackWidth
              height = width / sprite.aspectRatio
              x = formatedData[d.section][`ColumnStart`]+TrackWidth/2
              y = formatedData[d.section][`HitPosition`]
              sprite.setOrientation(x, y, width, height, "Center");
              break;
            case "HitSprite":
              switch (sprite.type){
                case 'Sprite':
                  width = sprite.width
                  height = width / sprite.aspectRatio
                  x = formatedData[d.section][`ColumnStart`]+TrackWidth/2
                  y = formatedData[d.section][`ScorePosition`]
                  sprite.setOrientation(x, y, width, height, "Center");
                  break;
                case 'Animation':
                  break;
              }
              break;
            case "NoteImage":
              break;
            case "LightingN":
              break;
            case "LightingL":
              break;
            case "KeyImage":
              switch (sprite.type){
                case 'Sprite':
                  width = TrackWidth/4
                  height = 107;
                  x = (formatedData[d.section][`ColumnStart`])
                  y = 480;
                  sprite.setOrientation(x, y, width, height, "Bottom");
                  break;
                case 'Animation':
                  break;
                }
              break;
            case "StageLight":
              
              switch (sprite.type){
                case 'Sprite':
                  width = TrackWidth/4
                  height = canvas.height;
                  x = (formatedData[d.section][`ColumnStart`])
                  y = 480;
                  sprite.setOrientation(x, y, width, height, "Bottom");
                  break;
                case 'Animation':
                  break;
                }
              break;
            default:
              //console.log(d.data);
          }
          //console.log(sprite)
          resolve(sprite)
        })
        
        //console.log(name, d)
        //let sprite = new Sprite(`${name}`, d.animationCheck)
      };

      let prepareSprite = async (name, d) => {
        return new Promise(async (resolve) => {
          let sprite;
          if (false){//name in data[d.section]) { 

            // section need to be reworked due to loading bug

            console.log(data)
            console.log(name)
            sprite = await formatSprite(data[d.Section][name], d);
          } else {
            sprite = await formatSprite(d.default, d);
          }
          if (!(d.section in formatedData)) {
            formatedData[d.section] = {};
          }
          formatedData[d.section][name] = sprite;
          resolve(sprite)
        });
      };

      let loadSprites = async () => {
        let p = spriteFormation.map((spriteData) => {
          return prepareSprite(spriteData.name, spriteData)
        });

        let vals = await Promise.all(p);
        return
      }
      
      await loadSprites()
      console.log(formatedData)
      resolve(formatedData);
      
    });
  };
}
