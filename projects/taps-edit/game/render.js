var bg = new Background()
var rGrid = new RenderGrid()
//var cTrack = new Track('./skins/-   it will be done   -/skin.ini')
var cTrack = new Track('#azer8dawn')



async function animate(){
    bg.draw()
    rGrid.show()
    cTrack.draw()
    requestAnimationFrame(animate)
}
animate()