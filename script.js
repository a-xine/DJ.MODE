const { ipcRenderer } = require('electron');

//these references to the HTML elements in our index.html
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-pause-btn');
const songTitle = document.getElementById('song-title');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const uploadBtn = document.getElementById('upload');
const closeBtn = document.getElementById('close-btn');

let playlist = [];//this will store the list of uploaded songs
let currentTrackIndex = 0;//this is to keep track of the current song playing


uploadBtn.addEventListener('click', () => {//this will trigger the file input dialog when the upload button is clicked
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true; 
    
    input.onchange = (e) => {
        playlist = Array.from(e.target.files);//this will store the selected files in the playlist array
        if (playlist.length > 0) {
            currentTrackIndex = 0;
            loadAndPlay(currentTrackIndex);//this will load and play the first selected song
        }
    };
    input.click();//this will open the file dialog
});

function loadAndPlay(index) {//this function will load and play the song at the given index in the playlist
    if (playlist.length > 0) {
        const file = playlist[index];
        const url = URL.createObjectURL(file);/*this will create a temporary URL for the selected file 
        so that we can play it in the audio element*/
        
        audio.src = url;//this will set the audio source to the selected file
        songTitle.innerText = file.name.toUpperCase(); 
        audio.play();//this will start playing the song
        playBtn.innerText = "PAUSE";//this will show "PAUSE"on the button when the song is playing
    }
}

playBtn.addEventListener('click', () => {
    if (!audio.src) return; //this will not do anything if no song is loaded
    
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "PAUSE";//this will show "PAUSE" on the button when the song is playing
    } else {
        audio.pause();
        playBtn.innerText = "PLAY";//while this will show "PLAY" on the button when the song is paused
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;//this will move to the next song in the playlist, and loop back to the first song if we are at the end
        loadAndPlay(currentTrackIndex);
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (playlist.length > 0) {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;//this will move to the previous song in the playlist, and loop to the last song if we are at the beginning
        loadAndPlay(currentTrackIndex);
    }
});

audio.addEventListener('ended', () => {//this will automatically play the next song when the current song ends
    if (playlist.length > 0) {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadAndPlay(currentTrackIndex);
    }
});

audio.addEventListener('timeupdate', () => {//this will update the progress bar as the song plays
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;//this will calculate the percentage of the song that has played
        progressBar.style.width = `${progressPercent}%`;//this will set the width of the progress bar based on the percentage of the song that has played
    }
});


progressContainer.addEventListener('click', (e) => {//this will allow the user to seek to a different part of the song by clicking on the progress bar
    if (!audio.src) return;
    const width = progressContainer.clientWidth;//this will get the width of the progress container
    const clickX = e.offsetX;//this will get the X coordinate of the click relative to the progress container
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;//this will set the current time of the audio based on where the user clicked on the progress bar
});


closeBtn.addEventListener('click', () => {
    window.close(); //this will close the application when the close button is clicked
});