var num1 = [2,3,4,5,6,7,8]
var num2 = [1]

let c = (n) => {
  return n[Math.floor(n.length/2)]
}
let cutfront = (n) => {
  return n.slice(0, Math.floor(n.length/2))
}
let cutback = (n) => {
  if (n.length === 1){
    return n
  }
  return n.slice(Math.floor(n.length/2))
}

var sort = (n, m) => {
  //console.log(n, m)
  if (n.length + m.length < 3) {
    console.log(n,m)
    return 3;
  } else {
    if(c(n) > c(m)){
      return sort(cutfront(n), cutback(m))
    } else {
      return sort(cutback(n), cutfront(m));
    }
  }
};


console.log(sort(num1,num2))
/*
console.log(c(num1))
console.log(c(num2))

if (c(num1) > c(num2)){
  console.log(cutfront(num1))
  console.log(cutback(num2))
} else {
  console.log(cutback(num1))
  console.log(cutfront(num2))
}*/
/*
console.log(num2.slice(0, Math.floor(num2.length+1/2)))
console.log(num1.slice(Math.floor(num1.length/2)))
//console.log(num1[Math.floor((num2.length-1)/2)])
//console.log(num1.slice(0,3))
*/