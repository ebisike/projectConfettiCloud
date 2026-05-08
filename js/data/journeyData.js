/* =============================================
   JOURNEY DATA — ProjectConfettiCloud
   Timeline entries rendered on journey.html.

   Each entry in the `images` array can be a
   photo OR a video. Use the `type` field:

   IMAGE (default — type can be omitted):
   { type: "image", src: "path/to/photo.jpg", caption: "..." }

   VIDEO:
   { type: "video", src: "path/to/clip.mp4",  caption: "...",
     poster: "path/to/thumbnail.jpg" }   ← poster is optional

   Images → assets/images/journey/
   Videos → assets/videos/journey/
   ============================================= */

var journeyData = [

  {
    id: 1,
    era: "The Beginning",
    yearLabel: "Childhood",
    title: "A Star Is Born",
    description: "Long before the world had the privilege of knowing your name, you were already something rare. A little girl with laughter too big for any room, curiosity that never sat still, and a heart that somehow knew how to make everyone around her feel seen. The world got lucky the day you arrived in it.",
    images: [
      { src: "assets/images/journey/childhood-1.jpg", caption: "Little Grace, always smiling" },
      { src: "assets/images/journey/childhood-2.png", caption: "A Sunday afternoon with family" },
      { src: "assets/images/journey/childhood-3.jpg", caption: "The joy she brought everywhere" },
      { src: "assets/images/journey/childhood-1.jpg", caption: "Little Grace, always smiling" },
      { src: "assets/images/journey/childhood-2.jpg", caption: "A Sunday afternoon with family" },
      { src: "assets/images/journey/childhood-3.jpg", caption: "The joy she brought everywhere" }
    ],
    tag: "Where it all began",
    align: "left"
  },

  {
    id: 2,
    era: "Growing",
    yearLabel: "School Years",
    title: "Brilliance in Bloom",
    description: "There was something about the way you moved through those early years — quietly sure of yourself, gentle in the way you carried others, sharp in ways that surprised even the people who thought they knew you. You were becoming something extraordinary, one quiet day at a time.",
    images: [
      { src: "assets/images/journey/school-1.jpg", caption: "Bright eyes, brighter future" },
      { src: "assets/images/journey/school-2.jpg", caption: "Learning and laughing in equal measure" }
    ],
    tag: "Finding her wings",
    align: "right"
  },

  {
    id: 3,
    era: "Blossoming",
    yearLabel: "Teenage Years",
    title: "The Girl Who Refused to Dim",
    description: "This was the season where the world tried to tell you who to be — and you simply smiled and chose yourself anyway. There was a grace to how you navigated the noise, a quiet confidence that didn't need an audience. You were never performing. You were just you. And that was always more than enough.",
    images: [
      { src: "assets/images/journey/teenage-1.jpg", caption: "Unmistakably herself" },
      { src: "assets/images/journey/teenage-2.jpg", caption: "Growing into her light" },
      { src: "assets/images/journey/teenage-3.jpg", caption: "The smile that stayed" }
    ],
    tag: "Unmistakably her",
    align: "left"
  },

  {
    id: 4,
    era: "Rising",
    yearLabel: "Young Adult",
    title: "She Became Her Own Answer",
    description: "There's a kind of courage that doesn't announce itself — it just shows up. In the choices you made, the spaces you walked into, the times you kept going when going was the hardest thing. You built a life that reflects who you really are, and watching you do it has been one of the greatest gifts.",
    images: [
      { src: "assets/images/journey/young-adult-1.jpg", caption: "Walking into her own story" },
      { src: "assets/images/journey/young-adult-2.jpg", caption: "Every step, intentional" }
    ],
    tag: "Owning her story",
    align: "right"
  },

  {
    id: 5,
    era: "Now",
    yearLabel: "Today",
    title: "The Woman You've Become",
    description: "Here you are. Every laugh that shaped you, every tear that steadied you, every moment of doubt you walked through anyway — all of it has brought you to this. A woman who is warm without being fragile, strong without being hard, beautiful without even trying. Happy birthday, Nenye. The best chapters are still ahead.",
    images: [
      { type: "image", src: "assets/images/journey/present-1.jpg", caption: "Grace Jude, today" },
      { type: "image", src: "assets/images/journey/present-2.jpg", caption: "Radiant and unstoppable" },
      { type: "image", src: "assets/images/journey/present-3.jpg", caption: "The best is yet to come" },
      { type: "video", src: "assets/videos/journey/present.mp4",   caption: "A moment in motion 🎬",
        poster: "assets/images/journey/present-1.jpg" }
    ],
    tag: "And she shines",
    align: "left"
  }

];
