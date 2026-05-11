/* =============================================
   TUNES DATA — ProjectConfettiCloud
   Song metadata and timestamped lyrics for
   the Tunes page.

   ADJUSTING SYNC:
   Each lyric entry has a `time` value in seconds.
   If a line appears too early or too late, open
   this file and nudge the time value up or down.
   ============================================= */

var tunesData = {

  title:    "If I Didn't Have You",
  subtitle: "Chinenye's Song",
  src:      "assets/audio/Chinenye-song-main.mp3",

  /*
   * scrollSpeed — controls how fast the lyrics scroll relative to the song.
   * 1.0 = lyrics finish scrolling exactly when the song ends.
   * 1.2 = lyrics finish 20% earlier (scrolls faster).
   * Nudge up to scroll faster; nudge down toward 1.0 to slow down.
   */
  scrollSpeed: 1.02,

  lyrics: [

    /* ---- Verse 1 ---- */
    { time: 1,   text: "Verse 1",                                               type: "section" },
    { time: 2,  text: "If I didn't have you, life would be blue",              type: "line" },
    { time: 7,  text: "I'd be a server down with no restart",                  type: "line" },
    { time: 10,  text: "A codebase with no tests, a merge that's a mess",       type: "line" },
    { time: 13,  text: "I'd be debugging bugs in the dark",                     type: "line" },
    { time: 15,  text: "I'd be Git without commit, a function throwing fits",   type: "line" },
    { time: 18,  text: "Like null refs crashing all my flow",                   type: "line" },
    { time: 21,  text: "I'd be logic with no plan, a loop that never ends",     type: "line" },
    { time: 23,  text: "Still stuck where I was years ago",                     type: "line" },
    { time: 25,  text: "I'd be an app with no UI, a query with no reply",       type: "line" },
    { time: 31,  text: "And I'd probably still live on my own",                 type: "line" },
    { time: 36,  text: "Yeah, I'd probably still be on my own",                 type: "line" },

    /* ---- Chorus ---- */
    { time: 42,  text: "Chorus",                                                type: "section" },
    { time: 43,  text: "Ever since I met you, you turned my world around",      type: "line" },
    { time: 49,  text: "You made sense of all my scattered code",               type: "line" },
    { time: 54,  text: "You're like frontend and backend in perfect sync",      type: "line" },
    { time: 59,  text: "Running smoothly in one mode",                          type: "line" },

    /* ---- Post-Chorus ---- */
    { time: 65,  text: "Post-Chorus",                                           type: "section" },
    { time: 70,  text: "I couldn't have imagined",                              type: "line" },
    { time: 71,  text: "How good my life would get",                            type: "line" },
    { time: 73,  text: "From the moment that I met you, Chinenye",              type: "line" },

    /* ---- Verse 2 ---- */
    { time: 75, text: "Verse 2",                                               type: "section" },
    { time: 77, text: "If I didn't have you, life would be dreary",            type: "line" },
    { time: 80, text: "I'd be an API with no response",                        type: "line" },
    { time: 83, text: "I'd be binary without a one, a job that's never done",  type: "line" },
    { time: 86, text: "Like a system stuck in constant pause",                 type: "line" },
    { time: 88, text: "I'd be Docker with no image, a stack with broken limits", type: "line" },
    { time: 90, text: "A deploy that never goes live",                         type: "line" },
    { time: 93, text: "I'd be searching Stack Overflow all night",             type: "line" },
    { time: 97, text: "Just trying to survive",                                type: "line" },
    { time: 99, text: "I'd overthink every line I write",                      type: "line" },
    { time: 100, text: "And still not get it right",                            type: "line" },
    { time: 104, text: "Yeah, I'd probably still be on my own",                 type: "line" },

    /* ---- Chorus 2 ---- */
    { time: 108, text: "Chorus",                                                type: "section" },
    { time: 110, text: "Ever since I met you, you turned my world around",      type: "line" },
    { time: 116, text: "You're my safe place and my support",                   type: "line" },
    { time: 121, text: "We're like code and execution",                         type: "line" },
    { time: 124, text: "You can't have one without the source",                 type: "line" },

    /* ---- Post-Chorus ---- */
    { time: 132, text: "Post-Chorus",                                           type: "section" },
    { time: 138, text: "I couldn't have imagined",                              type: "line" },
    { time: 140, text: "How good my life would get",                            type: "line" },
    { time: 141, text: "From the moment that I met you, Chinenye",              type: "line" },

    /* ---- Outro ---- */
    { time: 145, text: "Outro",                                                 type: "section" },
    { time: 148, text: "Oh, I couldn't have imagined",                          type: "line" },
    { time: 149, text: "How good my life would get",                            type: "line" },
    { time: 150, text: "From the moment that I met you, Chinenye",              type: "line" }

  ]

};
