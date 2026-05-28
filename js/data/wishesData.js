/* =============================================
   WISHES DATA — ProjectConfettiCloud
   Birthday wish cards rendered on wishes.html.

   WISH FORMAT:
   {
     type: "text" | "audio" | "video",
     src:  "path/to/media"   (required for audio/video)
     ...
   }

   === TYPE: text ===
   message → the full wish text
   media   → optional array of photos/videos

   === TYPE: audio ===
   src     → path to audio file (e.g. assets/audio/file.mp3)
   media   → optional supplementary photos/videos

   === TYPE: video ===
   src     → path to video file (e.g. assets/videos/wishes/file.mp4)
   poster  → optional thumbnail image
   media   → optional supplementary photos/videos

   MEDIA FORMAT (for media array):
   { type: "image", src: "...", caption: "..." }
   { type: "video", src: "...", caption: "...", poster: "..." }
   ============================================= */

var wishesData = [

  {
    id: 1,
    type: "audio",
    icon: "👩‍👧",
    sender: "Mum",
    from: "From Your Mum",
    title: "A Mother's Prayer",
    preview: "Press play to hear a heartfelt birthday prayer from your mum...",
    src: "assets/audio/mums-wish.mp3",
    accentColor: "#E87BB0",
    media: []
  },

  {
    id: 2,
    type: "audio",
    icon: "👨‍👧",
    sender: "Dad",
    from: "From Your Dad",
    title: "A Father's Blessing",
    preview: "Press play to hear a special birthday blessing from your dad...",
    src: "assets/audio/dads-wish.mp3",
    accentColor: "#4A90E8",
    media: []
  },

  {
    id: 3,
    type: "audio",
    icon: "🧙‍♀️",
    sender: "Zainab",
    from: "From Your Ibadan Winch 🔮",
    title: "A Spell of Love & Laughter",
    preview: "Press play to hear Zainab cast her birthday magic on you...",
    src: "assets/audio/zainabs-wish.mp3",
    accentColor: "#8B5CF6",
    media: [
      { type: "video", src: "assets/videos/wishes/grace-long-ago-2.mp4", caption: "long long timne ago" },
      { type: "video", src: "assets/videos/wishes/grace-long-ago-1.mp4", caption: "long long timne ago" },
      { type: "image", src: "assets/images/wishes/zee-grace1.jpeg", caption: "long long timne ago" },
      { type: "image", src: "assets/images/wishes/zee-grace2.jpeg", caption: "long long timne ago" },
      { type: "image", src: "assets/images/wishes/zee-grace3.jpeg", caption: "long long timne ago" },
    ]
  },

  {
    id: 4,
    type: "text",
    icon: "❤️",
    sender: "Jide",
    from: "From Your Aboki",
    title: "Rare and Rising",
    preview: "It's been 8 years of knowing you, and I still can't believe how fast time has flown…",
    message: "It's been 8 years of knowing you, and I still can't believe how fast time has flown. Meeting you for the first time at Mr. Tunjí's place was the beginning of a truly beautiful story.\n\nIf there's one thing that has always stood out about you, it's your work ethic. You don't just talk about your goals, you go after them with everything you have. It's rare, and it's something I deeply admire.\n\nI'm genuinely proud of you 🥺\nNot just for what you've achieved, but for your consistency, your strength, and the discipline you show even when things aren't easy.\n\nYou're becoming something truly special, and I hope you never doubt that. As you step into this new year, I pray life meets your effort with the success, happiness, and fulfilment you truly deserve.\n\nHappy birthday my Aboki!!! ❤️❤️",
    accentColor: "#E8A84A",
    media: [
      // { type: "image", src: "assets/images/journey/present-1.jpg", caption: "Grace Jude, today" },
      // { type: "image", src: "assets/images/journey/present-2.jpg", caption: "Radiant and unstoppable" },
      // { type: "image", src: "assets/images/journey/present-3.jpg", caption: "The best is yet to come" },
      // // { type: "video", src: "assets/videos/journey/present.mp4", caption: "A moment in motion 🎬",
      //   poster: "assets/images/journey/present-1.jpg" }
    ]
  },

  {
    id: 5,
    type: "text",
    icon: "🌟",
    sender: "Lizara",
    from: "From Your Office Sister",
    title: "She Fills Every Room With Light",
    preview: "Today, the world gets a little brighter because it's your day, girl 🥳✨",
    message: "Today, the world gets a little brighter because it's your day, girl 🥳✨\n\nI still remember the very first day we met at work. It felt like we'd known each other forever. We just connected so easily, like colleagues who were always meant to be friends. From that moment, you've been more than a workmate. You've been a sister, a cheerleader, and a daily reminder that good people still exist.\n\nYou're the friend who walks into a room and fills it with light, always smiling, always laughing, always ready with a Snapchat video to capture the joy of the moment 😂 You don't just live life, you celebrate it, and you bring everyone along with you.\n\nI admire how much you love God and how it shows in your generous heart. You're a cheerful giver in the truest sense, always lifting others, always giving more than you take. And when it comes to what you do? You don't just do it, you excel at it. Your outspoken spirit and sharp, intelligent mind mean you never settle for ordinary. You're always asking questions, always learning, always growing.\n\nGracie, may this new year of life bring you even more reasons to smile, more wins to document on Snapchat, and more opportunities to shine in everything you touch. May God continue to guide you, strengthen you, and open doors that no one can shut. May you keep excelling, keep inspiring, and keep being that bold, beautiful force of joy that we all love.\n\nHappy big 25th birthday, my elenu shipoti 😁🥳\nCheers to more laughter, more blessings, and more Grace, dearie 🥂💖\n\nLove,\nLizara",
    accentColor: "#E87BB0",
    media: [
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.09.28 AM.jpeg", caption: "Grace and Lizzy" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.09.29 AM.jpeg", caption: "Sisters from day one 💕" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.10.53 AM.jpeg", caption: "Corporate queens on the grind 💼" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.10.54 AM (1).jpeg", caption: "Bride-to-be moments with my girl 🎂" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.10.54 AM (2).jpeg", caption: "The trio that lights up every room ✨" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.10.54 AM.jpeg", caption: "Celebrating love and friendship 🥂" },
      { type: "image", src: "assets/images/wishes/WhatsApp Image 2026-05-20 at 10.18.23 AM.jpeg", caption: "My person, always 💫" }
    ]
  },

  {
    id: 6,
    type: "text",
    icon: "💖",
    sender: "Toyin",
    from: "A Wish for Your Heart",
    title: "Seen & Loved",
    preview: "Grace, my love, The past 4+ years that I've met you, you've.…",
    message: "Grace, my love, The past 4+ years that I've met you, you've been present for all the important parts of my adulthood. And I'm so glad I met you. You're such a girl's girl. You are wise beyond your years. You are so smart and so inspiring. I deeply love how you carry other people's matter on your head and fight to the last. You look after everyone around you and make sure everyone is fine and sorted. I remember during Ay's wedding at Abeokuta, how you took it upon yourself to make sure everyone from Eazipay ate. You did same at my wedding. And you constantly do the same at work, everyday. Just simply being a good-hearted young woman and only wanting the best for people. So this new year, as you clock 25, it's only God's best for you. I pray this new phase marks the beginning of even greater things in your life. You're made for the top, girl, and I can't wait to celebrate you there. Happy birthday, sweet girl. Love you 😘",
    accentColor: "#F0B8C8",
    media: [
      { type: "image", src: "assets/images/wishes/Toyin07.jpg", caption: "Grace and Me" },
      { type: "image", src: "assets/images/wishes/Toyin08.jpg", caption: "Grace and goofy me" },
      { type: "image", src: "assets/images/wishes/Toyin09.jpg", caption: "Grace, Asher and Me" },
      { type: "image", src: "assets/images/wishes/Toyin10.jpg", caption: "Group photo" },
      { type: "image", src: "assets/images/wishes/Toyin11.jpg", caption: "Grace at my wedding" }
    ]
  },

  {
    id: 7,
    type: "text",
    icon: "💛",
    sender: "Mayourwah",
    from: "A Wish from a Grateful Heart",
    title: "You Are One of the Rare Ones",
    preview: "Your kindness, support, wisdom, and genuine care have made a lasting impact on my life…",
    message: "Happy Birthday Oreofeoluwa.\n\nYour kindness, support, wisdom, and genuine care have made a lasting impact on my life, and I'm truly grateful for your friendship.\n\nYou are one of those rare people who bring peace, joy, and encouragement wherever they go. On this special day, I pray that your life is filled with happiness, good health, favour, and endless reasons to smile.\n\nMay this new year bring you closer to your dreams and surround you with love, success, and unforgettable moments. Thank you for being such a wonderful friend.",
    accentColor: "#E8956A",
    media: [{ type: "image", src: "assets/images/wishes/mayourwah.jpg", caption: "Grace Jude, today" }]
  },

  {
    id: 8,
    type: "text",
    icon: "🙌",
    sender: "Oluwafemi",
    from: "A Friend and Sister in Faith",
    title: "Radiate His Glory",
    preview: "Grace, Grace, my friend and sister — I celebrate you now and always…",
    message: "Grace, Grace, my friend and sister,\n\nI celebrate you now and always. I celebrate your growth and love for the things of God.\n\nHappy happy birthday to you! 🥳 May your life continually radiate the glory of God ✨ Keep thriving 🙌\n\nFrom Oluwafemi",
    accentColor: "#9B7FD8",
    media: []
  },

  {
    id: 9,
    type: "text",
    icon: "🎉",
    sender: "Godstar",
    from: "A Wish from Godstar",
    title: "Blessings Yanfu Yanfu",
    preview: "Happy birthday Grace, as you dey enter this new year for your life…",
    message: "Happy birthday Grace, as you dey enter this new year for your life, make God continue to bless you yanfu yanfu, keep you and prosper you. As you be lovely person na so love go always surround you.\n\nPS: Thank you for loving my guy, the principal Adamu. Because of you, him don get sense small 😂\n\nFrom Godstar",
    accentColor: "#F0B8C8",
    media: []
  },

  {
    id: 10,
    type: "text",
    icon: "💫",
    sender: "Sarah",
    from: "From Sarah",
    title: "Beautiful Inside and Out",
    preview: "It's not easy staying as beautiful as you do baby girl…",
    message: "Happy birthday Grace 💫\n\nIt's not easy staying as beautiful as you do baby girl ❤️\nHope your life continues to be filled up with joy and love ❤️\n\nFrom Sarah",
    accentColor: "#E8A84A",
    media: []
  },

  {
    id: 11,
    type: "text",
    icon: "🤍",
    sender: "Dynamic",
    from: "Since 2021 & Counting",
    title: "Carried by Grace",
    preview: "Life brought us together in 2021, just trying to figure out this thing called life…",
    message: "Grace Grace Grace\n\nLife brought us together in 2021, we were just trying to figure out this thing called life and what ICAN even entailed in the first place.\n\nThrough this journey I have seen your name personified in your life. You have truly been carried by GRACE.\n\nIt's the way you love people. You do not even let what anyone do change your mind from helping another person. You stay true to who you are. That's emulatable.\n\nMy sincere prayer for you on this special day is that you are always in joy.\n\nAs you have been carried by God may you be carried by Him all the days of your life.\nMay you get married to someone who truly values you and sees you.\n\nTruth is you are a friend everyone should have in their corner.\nYou are a good person.\n\nI love you 🤍❤️",
    accentColor: "#4BAFC9",
    media: []
  },

  {
    id: 12,
    type: "audio",
    icon: "🎙️",
    sender: "Favour",
    from: "A Voice Note Just for You",
    title: "Happy Birthday, Grace!",
    preview: "Press play to hear a special birthday message from Favour...",
    src: "assets/audio/favour-wish.mp3",
    accentColor: "#FF6B9D",
    media: []
  },

  {
    id: 13,
    type: "text",
    icon: "🎉",
    sender: "Charity",
    from: "A Beautiful Year Ahead",
    title: "As Amazing as You Are",
    preview: "Wishing you a beautiful year filled with happiness, peace, success, and good memories…",
    message: "Happy birthday Grace 🎉\n\nWishing you a beautiful year filled with happiness, peace, success, and good memories. Hope your special day is as amazing as you are.\n\nHave a wonderful birthday ✨\n\nFrom Charity",
    accentColor: "#6BC9A8",
    media: []
  },

  {
    id: 14,
    type: "text",
    icon: "👗",
    sender: "Adijat",
    from: "Your Sit Partner & Biggest Supporter",
    title: "Grace on Her Head",
    preview: "It's honestly so beautiful how we've gone from secondary school sit partners to grown women still holding on…",
    message: "Happy Birthday to one of the realest people in my life 🥹\n\nIt's honestly so beautiful how we've gone from secondary school girls as sit partners to grown women still holding onto this friendship, it's funny how we are the closest out of all our friends in school ☺️😅\n\nThrough different phases of life, you have remained such a genuine and supportive person to me, and I don't think I say thank you enough for that.\n\nYou've supported me and my brand in so many ways right from the beginning, I can't even ever not talk about this — Grace and my brand on her head 🤝 5 and 6. Anytime there's a party, event, or special occasion, you always think of me first, and that alone means so much to me. You trusted me even when I was still learning, growing, and trying to fully find my feet in this fashion journey. There were times I would sew things that weren't even perfect or exactly what you wanted, but you never made me feel bad about it 😭 You would still wear it with love, encourage me, and move on like it was nothing. That kind of support, patience, and belief in me is something I can never forget.\n\nHow she's always cheering me on even on my littlest growth 🥹😭 I'm grateful for you my friend 😘\n\nNot everybody gets blessed with friends who genuinely want to see them grow, but you've always been that person for me. Thank you for always showing up, always supporting, always referring me, always believing in me and my dreams even in little ways you may not realize.\n\nOn your birthday, I just want to pray that life rewards your kindness greatly. May this new age bring you peace, happiness, good health, beautiful opportunities, and everything good your heart secretly desires. You deserve genuine love, soft life, and all the beautiful things this world has to offer.\n\nThank you for being my friend through the years. I truly appreciate you more than words can explain.\n\nHappy Birthday once again, my Grace Mfon 🤭",
    accentColor: "#E8684A",
    media: [
      {
        type: "image", src: "assets/images/wishes/jump-suit.jpeg",
        caption: "Adijat made the fit — Grace wore it to Kemi's wedding like it was runway ✨"
      },
      {
        type: "image", src: "assets/images/wishes/jump-suit2.jpeg",
        caption: "Best friends, matching geles, one of them made the outfit — this is 5 and 6 🤝"
      },
      {
        type: "video", src: "assets/videos/wishes/first-dress-sewn-by-adijat.mp4",
        caption: "The very first time Adijat's needle met fabric for Grace 🪡"
      },
      {
        type: "video", src: "assets/videos/wishes/other-dresses-sewn.mp4",
        caption: "More custom pieces, more memories stitched with love 🩷"
      }
    ]
  },
 
  {
    id: 15,
    type: "text",
    icon: "💕",
    sender: "Vickky",
    from: "From Vickky",
    title: "A Woman of Much Grace",
    preview: "Happy birthday, Grace! You are, indeed, a woman of much grace...",
    message: "Happy birthday, Grace!\nYou are, indeed, a woman of much grace.\nYou are beautiful, kind, supportive, caring, smart, and loving.\nYour achievements are indeed notable and admirable.\nI pray for God's mercies, blessings, favour, and GRACE upon your life in this new year. In this year, God will give you more of Him, He will draw you to Himself, and there will be evidences of His omnipresence in your life.\nCheers to a new and beautiful year ahead, baby girl! ❤️🥂",
    accentColor: "#D4607A",
    media: []
  },

  {
    id: 16,
    type: "audio",
    icon: "🤴",
    sender: "John",
    from: "From Your Elder Brother",
    title: "A Brother's Love",
    preview: "Press play to hear a special birthday message from your big brother John...",
    src: "assets/audio/john-wish-bby.mp3",
    accentColor: "#E8A84A",
    media: []
  },

   {
    id: 17,
    type: "video",
    icon: "👑",
    sender: "George",
    from: "From Your Love",
    title: "To My Chinenye",
    preview: "Press play to watch a birthday video message from George to his Chinenye...",
    src: "assets/videos/wishes/George-wish.mp4",
    poster: "",
    accentColor: "#D4607A",
    media: [
      { type: "image", src: "assets/images/wishes/DSC_5042.jpg", caption: "My beautiful Chinenye ✨" },
      { type: "image", src: "assets/images/wishes/DSC_5043.jpg", caption: "Elegant as ever 🌹" },
      { type: "image", src: "assets/images/wishes/Snapchat-41544755.jpg", caption: "That smile that melts me every time 😍" },
      { type: "image", src: "assets/images/wishes/ankara-style1.jpg", caption: "Queen in her ankara 👑" },
      { type: "image", src: "assets/images/wishes/ankara-style2.jpg", caption: "Grace personified 💕" },
      { type: "image", src: "assets/images/wishes/ankara-style3.jpg", caption: "My heart in human form ❤️" }
    ]
  },


];
