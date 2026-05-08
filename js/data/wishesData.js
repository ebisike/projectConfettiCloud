/* =============================================
   WISHES DATA — ProjectConfettiCloud
   Birthday wish cards rendered on wishes.html.

   sender     → who this wish is from (replace with real names)
   accentColor → hex colour for the card's accent strip
   media      → optional array of photos/videos (same format
                as journeyData). Leave out or set [] to keep
                the card text-only.

   MEDIA FORMAT:
   { type: "image", src: "assets/images/wishes/photo.jpg", caption: "..." }
   { type: "video", src: "assets/videos/wishes/clip.mp4",  caption: "...",
     poster: "assets/images/wishes/thumb.jpg" }
   ============================================= */

var wishesData = [

  {
    id: 1,
    icon: "🌸",
    sender: "Someone Special",
    from: "A Wish for Your Joy",
    title: "Overflow",
    preview: "May every day of this new year feel like the morning light breaking through curtains…",
    message: "May every day of this new year feel like the morning light breaking through curtains — warm, unhurried, and full of promise. May you laugh until your sides ache, rest without guilt, and find delight in the ordinary. You deserve joy that doesn't have conditions. Joy that just is. Happy birthday, Nenye.",
    accentColor: "#D4607A",
    media: [
       { src: "assets/images/journey/childhood-1.jpg", caption: "Little Grace, always smiling" },
      { src: "assets/images/journey/childhood-2.png", caption: "A Sunday afternoon with family" },
      { src: "assets/images/journey/childhood-3.jpg", caption: "The joy she brought everywhere" },
      { src: "assets/images/journey/childhood-1.jpg", caption: "Little Grace, always smiling" },
      { src: "assets/images/journey/childhood-2.jpg", caption: "A Sunday afternoon with family" },
      { src: "assets/images/journey/childhood-3.jpg", caption: "The joy she brought everywhere" }
    ]
  },

  {
    id: 2,
    icon: "✨",
    sender: "A Dear Friend",
    from: "A Wish for Your Dreams",
    title: "Every Door, Wide Open",
    preview: "This year, may the things you've been reaching for finally close the distance…",
    message: "This year, may the things you've been reaching for finally close the distance. May the plans you've been nursing in quiet moments find their legs. May every door you knock on open — not because luck is on your side, but because you were always meant to walk through. The world needs what only you can bring, Grace. Go get it.",
    accentColor: "#E8A84A",
    media: [ { type: "image", src: "assets/images/journey/present-1.jpg", caption: "Grace Jude, today" },
      { type: "image", src: "assets/images/journey/present-2.jpg", caption: "Radiant and unstoppable" },
      { type: "image", src: "assets/images/journey/present-3.jpg", caption: "The best is yet to come" },
      { type: "video", src: "assets/videos/journey/present.mp4",   caption: "A moment in motion 🎬",
        poster: "assets/images/journey/present-1.jpg" }]
  },

  {
    id: 3,
    icon: "💫",
    sender: "Your No. 1 Fan",
    from: "A Wish for Your Peace",
    title: "Stillness & Strength",
    preview: "In the loud moments and the quiet ones alike, may you always feel held…",
    message: "In the loud moments and the quiet ones alike, may you always feel held. May you find rest that actually restores you. May the weight of other people's expectations fall away, and what remains is only what is truly yours to carry. You are allowed to be at peace. You have earned it a thousand times over. Rest in that, Nenye.",
    accentColor: "#C9B2E8",
    media: []
  },

  {
    id: 4,
    icon: "💖",
    sender: "Always & Forever",
    from: "A Wish for Your Heart",
    title: "Seen & Loved",
    preview: "May you always be surrounded by people who see you clearly and love what they see…",
    message: "May you always be surrounded by people who see you clearly and love what they see — the full version of you, not the curated one. May you never have to shrink to fit. May love find you in forms you didn't even know you needed. And on the days you forget how extraordinary you are, may someone remind you before the day is done. You are so deeply loved, Grace Jude.",
    accentColor: "#F0B8C8",
    media: []
  }

];
