// FOR LOADING SCREEN
let loadingScreen = document.querySelector(".loading-screen");
const loaderMain = document.querySelector(".loader-main")
let loadingText = document.querySelector(".loader-num");

loaderMain.addEventListener("animationend", () => {
    let interval = 1000; 

    let startValue = 0;
    let endValue = parseInt(loadingText.getAttribute("end-val"));
    let duration = Math.floor(interval / endValue);
    let counter = setInterval(()=>{
        startValue += 1;
        loadingText.textContent = startValue;
        if (startValue == endValue) {
            clearInterval(counter);
            setTimeout(()=>{
                loadingScreen.classList.add("ended");
            }, 1000)
        }
    }, duration);
})


// FOR RESPONSIVE NAVBAR
// document.querySelector('video').defaultPlaybackRate = 3.0;
// document.querySelector('video').play()
const menu = document.querySelector('.menu');
const navbar = document.querySelector('.navbar');
const menuToggle= document.querySelector('.toggle');

menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
    navbar.classList.toggle('active');
})

document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem("audioPlayed")) {
      // Wait for user interaction
      document.body.addEventListener("click", function playAudioOnce() {
        let audio = document.getElementById("introAudio");
        audio.play().catch(error => console.log("Autoplay blocked:", error));
        
        // Mark as played
        localStorage.setItem("audioPlayed", "true");

        // Remove event listener to prevent multiple plays
        document.body.removeEventListener("click", playAudioOnce);
      });
    }
  });