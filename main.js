// ELEMENTS
const music = document.getElementById("music");
const startBtn = document.getElementById("startBtn");
const slides = document.querySelectorAll(".slide");
const achievementSound = document.getElementById("achievementSound");
const achievement = document.getElementById("achievement");
const credits = document.getElementById("credits");
const bubblesContainer = document.getElementById("bubbles");
const coloredImg = document.getElementById("coloredImg");

let currentIndex = -1;
let isPlaying = false;
let bubbleInterval = null; // global bubble interval

// TIMINGS [start, end] in seconds
const timings = [
  [0.00, 2.65],
  [2.65, 5.70],
  [5.70, 9.10],
  [9.10, 11.85],
  [11.85, 15.30],
  [15.30, 18.50],
  [18.50, 21.50],
  [21.50, 25.00]
];

// START BUTTON CLICK
startBtn.addEventListener("click", () => {
  if (!isPlaying) {
    currentIndex++;

    if (currentIndex < timings.length) {
      slides[currentIndex].style.display = "flex";

      slides.forEach((slide, i) => {
        const caption = slide.querySelector(".caption");
        if (caption) {
          caption.style.display = (i === currentIndex) ? "block" : "none";
          caption.style.opacity = (i === currentIndex) ? "1" : "0";
        }
      });

      music.currentTime = timings[currentIndex][0];
      music.play();
      isPlaying = true;
      startBtn.textContent = "Collecting...";
    }
  }
});

// MUSIC TIMEUPDATE
music.addEventListener("timeupdate", () => {
  if (currentIndex >= 0 && currentIndex < timings.length) {
    const [start, end] = timings[currentIndex];

    if (music.currentTime >= end) {
      music.pause();
      isPlaying = false;
      startBtn.textContent = "Collect";

      const caption = slides[currentIndex].querySelector(".caption");
      if (caption) {
        caption.style.opacity = "0";
        setTimeout(() => caption.style.display = "none", 1000);
      }
    }
  }

  // Background change at index 5
  if (currentIndex == 5) {
    document.body.style.background = "white";
    document.querySelectorAll('.caption').forEach(c => c.style.color = 'black');
    document.body.style.transition = "5s";
  }

  // Achievement + colored image at index 6+
  if (currentIndex >= 6) {
    startBtn.addEventListener("click", function(){
      setTimeout(() => {
        achievementSound.play();
        achievement.style.animation = "achievementAni 6s forwards";
        startBtn.style.opacity = "0";

        setTimeout(() => {
          startBtn.style.display = "none";
          credits.style.animation = "fadeInUp 1.5s forwards";
        }, 5500);

        coloredImg.style.opacity = "1";
        coloredImg.style.transition = "2s";
      }, 4000);
    }, {once:true});
  }

  // Bubbles at index 3
  if (currentIndex === 3) {
    if (!bubbleInterval) {
      bubbleInterval = setInterval(createBubble, 300);
    }
  } else {
    if (bubbleInterval) {
      clearInterval(bubbleInterval);
      bubbleInterval = null;
    }
  }
});

// CREATE BUBBLE
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.style.left = Math.random() * 100 + "vw";
  const size = 10 + Math.random() * 20;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.animationDuration = (7 + Math.random() * 7) + "s";
  bubblesContainer.appendChild(bubble);

  setTimeout(() => bubble.remove(), parseFloat(bubble.style.animationDuration) * 1000);
}

// BUTTON APPEAR ANIMATION
function animation() {
  startBtn.style.opacity = "1";
}
animation();

// PRELOADER
const assets = [
  "jSquadFlag.webp",
  "7souls.mp3",
  "img1.png","img2.png","img3.png","img4.png",
  "img5.png","img6.png","img7.png","img8.png",
  "achievement.png","achievementSound.mp3","imgColored.png"
];

let loaded = 0;
const total = assets.length;

function updateProgress() {
  loaded++;
  const percent = Math.floor((loaded / total) * 100);
  document.getElementById("loadingText").textContent = `Loading... ${percent}%`;

  if (loaded === total) {
    document.getElementById("preloader").style.display = "none";
    const mainContent = document.getElementById("mainContent");
    if (mainContent) mainContent.style.display = "block";
  }
}

// PRELOAD ASSETS
assets.forEach(src => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(src)) {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress;
    img.src = src;
  } else if (/\.(mp3|wav|ogg)$/i.test(src)) {
    const audio = new Audio();
    audio.oncanplaythrough = updateProgress;
    audio.onerror = updateProgress;
    audio.src = src;
  }
});
