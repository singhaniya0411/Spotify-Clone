console.log("Lets write javascript")
let play = document.getElementById("songplay");


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


let currentSong = new Audio();

async function getsong() {
  let a = await fetch("http://127.0.0.1:3000/songs/")
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}


const playmusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";

  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  // document.querySelector(".songtime").innerHTML = "00:00/00:00";

}

async function main() {


  let songs = await getsong();
  playmusic(songs[0], true);
  // Loading playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> 
              <img class="invert" src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")} </div>
                <div>Vishal</div>
              </div>
              <div class="playmusic">
                <img class="invert" src="songplay.svg" alt="" title="play">
              </div></li> `;
  }

  //Attach an event listener to each song 
  // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
  //   e.addEventListener("click", element => {
  //     console.log(e.querySelector(".info").firstElementChild.innerHTML);
  //     playmusic(e.querySelector(".info").firstElementChild.innerHTML);
  //   })
  // })

  let songarr = document.querySelectorAll(".info");
  console.log(songarr)
  songarr.forEach(element => {
    element.addEventListener("click", e => {
      console.log(element.firstElementChild.innerHTML);
      playmusic(element.firstElementChild.innerHTML);
    })
  });


  //Attach play ,pause , next to eventlisteners 

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
      play.title = "pause";
    }
    else {
      currentSong.pause();
      play.src = "songplay.svg";
    }
  })

  //time update function 
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //add an eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  })
}
main();