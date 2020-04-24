// Canvas

var canvas = document.querySelector('#game')
var ctx = canvas.getContext('2d')
var scale = 4
var AspectRatio = canvas.clientWidth / canvas.clientHeight
canvas.height = 480 * scale
canvas.width = 480 * AspectRatio * scale

var skinList = [
  '-   it will be done   -',
  `- a q u a r i u m -`,
  `- GomDogs skin`,
  `#azer8dawn`,
  `#xblue+chitanda`, 

  
]

/*
can't load
0 TypeError: right-hand side of 'in' should be an object, got undefined - Reader.js:525:13
5 ReferenceError: Name is not defined - Reader.js:662:13
6 ReferenceError: Name is not defined - Reader.js:662:13
8 TypeError: cannot use 'in' operator to search for "Keys" in "#azer8dusk azer(..." - Reader.js:34:11
9 this does nothing
*/