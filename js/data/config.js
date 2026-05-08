/* =============================================
   APP CONFIG — ProjectConfettiCloud
   Central configuration for the entire app.
   Update values here to customise the experience.
   ============================================= */

   const setSlideShowPictures = ()=>{
    let array = [];
    for (let index = 8; index >=1; index--) {
      array.push(`assets/images/carousel/slide${index}.jpg`);
    }
    return array;
   }
var appConfig = {

  /* --- Subject --- */
  name:     "Grace Jude",
  nickname: "Nenye",
  age:      25,

  /* --- Countdown target: 29th May 2026, midnight --- */
  countdownTarget: new Date("2026-05-08T16:19:00"),

  /* --- Candle page --- */
  candleCount: 25,

  /* --- Countdown page carousel ---
       Add your image filenames in assets/images/carousel/.
       Falls back to CSS gradients if images are missing.     */
    carouselImages: setSlideShowPictures(),

  /* Gradient fallbacks shown while images load or if missing */
  carouselFallbacks: [
    "linear-gradient(135deg, #2D1B25 0%, #5C2D44 60%, #2D1B25 100%)",
    "linear-gradient(135deg, #1C1B2D 0%, #3A2D5C 60%, #1C1B2D 100%)",
    "linear-gradient(135deg, #2D1B1B 0%, #5C2D2D 60%, #2D1B1B 100%)"
  ],

  /* --- Audio paths ---
       Place your audio files in assets/audio/.
       Remove the path or leave empty string to disable.     */
  audio: {
    melody:      "assets/audio/melody.mp3",
    wishesSong:  "assets/audio/wishes-song.mp3",
    celebration: "assets/audio/celebration.mp3"
  },

  /* --- Countdown redirect delay after reaching zero (ms) --- */
  redirectDelay: 5000,

  /* --- Shared carousel on all pages ---
       Set to false to instantly roll back the carousel
       from menu, journey and wishes pages.             */
  carouselOnAllPages: true

};

