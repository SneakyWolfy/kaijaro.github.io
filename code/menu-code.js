var debounceAni = true;
var $ = (id) => {
    return document.getElementById(id);
}
window.onload = function(){
    
}

function aniPlayBtn(){
    if (debounceAni){
        debounceAni = false;
        $('play-button').classList.add("popAni");
        const popAnimatied = document.querySelector('#play-button')

        popAnimatied.addEventListener('animationend', () => {
            $('play-button').classList.remove('pop');
            $('play-button').style.display = 'none';
        });

        $('Title').classList.add("fadeOutAni");
        $('option-button').classList.add("fadeOutAni");
        const fadeAnimatied = document.querySelector('#option-button')
        fadeAnimatied.addEventListener('animationend', () => {
            $('Title').classList.remove('fadeOutAni');
            $('Title').style.display = 'none';
            $('option-button').classList.remove('fadeOutAni');
            $('option-button').style.display = 'none';
            debounceAni = true;
            aniLoadSongs()
        });
    }
}

function aniLoadSongs() {
    if (debounceAni){
        debounceAni = false;
        for (element of document.getElementsByClassName('screen2')){
            element.classList.add("fadeInAni");
            element.style.display = 'block';
        }
        const songLoadAnimatied = document.querySelector('.screen2')
        songLoadAnimatied.addEventListener('animationend',() =>{
            for (element of document.getElementsByClassName('screen2')){
                element.classList.remove("fadeInAni");
            }
            debounceAni = true;
        })
    }
}