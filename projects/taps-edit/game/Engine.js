

window.addEventListener('keydown',HandleKeypress)
window.addEventListener('keyup',HandleKeyUp)


var keyState = {
  Space: false,
  KeyD: false,
  KeyF: false,
  KeyJ: false,
  KeyK: false,
  Digit0: false,
  Digit1: false,
  Digit2: false,
  Digit3: false,
  Digit4: false,
  Digit5: false,
};

function HandleKeypress(e) {
  //console.log(e.code)
  switch (keyState[e.code]) {
    case false:
      keyState[e.code] = true;
      PressKey(e.code);
      return;
    default:
      return;
  }
}

function HandleKeyUp(e) {
  switch (keyState[e.code]) {
    case true:
      keyState[e.code] = false;
      ReleaseKey(e.code)
      return;
  }
}

function PressKey(key) {
  switch (key) {
    case "Space":
      return;
    case "KeyD":
      cTrack.setKeyStat(0, true);
      return;
    case "KeyF":
      cTrack.setKeyStat(1, true);
      return;
    case "KeyJ":
      cTrack.setKeyStat(2, true);
      return;
    case "KeyK":
      cTrack.setKeyStat(3, true);
      return;
    case "Digit1":
      cTrack.loadSkin(skinList[0]);
      return;
    case "Digit2":
      cTrack.loadSkin(skinList[1]);
      return;
    case "Digit3":
      cTrack.loadSkin(skinList[2]);
      return;
    case "Digit4":
      cTrack.loadSkin(skinList[3]);
      return;
    case "Digit5":
      cTrack.loadSkin(skinList[4]);
      return;
    case "Digit6":
      cTrack.loadSkin(skinList[5]);
      return;
    case "Digit7":
      cTrack.loadSkin(skinList[6]);
      return;
  }
}
 
function ReleaseKey(key) {
  switch (key) {
    case "Space":
      return;
    case "KeyD":
      cTrack.setKeyStat(0, false)
      return;
    case "KeyF":
      cTrack.setKeyStat(1, false)
      return;
    case "KeyJ":
      cTrack.setKeyStat(2, false)
      return;
    case "KeyK":
      cTrack.setKeyStat(3, false)
      return;
  }
}