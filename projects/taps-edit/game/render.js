
var bg = new Background()

function animate(){
    bg.draw()
    requestAnimationFrame(animate)
}
animate()