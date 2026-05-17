/* =============================================
   TUNES PAGE — js/tunes.js
   Custom music player with timestamped lyrics.
   Depends on: tunesData.js
   ============================================= */

var audio          = null;
var isPlaying      = false;
var seekingByClick = false;

/* { el, time } pairs for every lyric line */
var lineEls        = [];
var lastActiveIdx  = -1; /* track changes so we only scroll when the line changes */

document.addEventListener('DOMContentLoaded', function () {
  initPlayer();
  renderLyrics();
});

/* ============================================
   PLAYER SETUP
   ============================================ */

function initPlayer() {
  audio = document.getElementById('song-audio');

  /* Set src directly on the <audio> element — the most reliable approach.
     Setting it on a <source> child after the fact is browser-inconsistent. */
  audio.src = tunesData.src;
  audio.load();

  /* Song info */
  document.getElementById('song-title').textContent    = tunesData.title;
  document.getElementById('song-subtitle').textContent = tunesData.subtitle;

  /* Play / pause button */
  document.getElementById('play-btn').addEventListener('click', togglePlay);

  /* Duration once metadata loads */
  audio.addEventListener('loadedmetadata', function () {
    document.getElementById('time-total').textContent = formatTime(audio.duration);
  });

  /* Log any load error so it's visible in DevTools */
  audio.addEventListener('error', function () {
    var code = audio.error ? audio.error.code : '?';
    console.error('Audio failed to load (error code ' + code + '):', tunesData.src);
  });

  /* Update progress bar + Spotify-style lyrics while playing */
  audio.addEventListener('timeupdate', function () {
    if (!seekingByClick) updateProgress();
    updateLyricsView();
  });

  /* Reset when song ends */
  audio.addEventListener('ended', function () {
    isPlaying = false;
    document.querySelector('.tunes-page').classList.remove('playing');
    document.querySelector('.vinyl').classList.remove('spinning');
    setPlayIcon(false);
    updateProgress();
    lastActiveIdx = -1;
    lineEls.forEach(function (item) {
      item.el.classList.remove('lyric-active', 'lyric-d1', 'lyric-d2');
    });
  });

  /* Progress bar — seek on click / tap */
  var bar = document.getElementById('progress-bar');
  bar.addEventListener('click',     onProgressSeek);
  bar.addEventListener('touchstart', onProgressSeek, { passive: true });
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    document.querySelector('.tunes-page').classList.remove('playing');
    document.querySelector('.vinyl').classList.remove('spinning');
    setPlayIcon(false);
  } else {
    audio.play().catch(function () { /* blocked — user must interact again */ });
    isPlaying = true;
    document.querySelector('.tunes-page').classList.add('playing');
    document.querySelector('.vinyl').classList.add('spinning');
    setPlayIcon(true);
  }
}

function setPlayIcon(playing) {
  /* ▶ play  /  ⏸ pause */
  document.getElementById('play-icon').innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
}

/* ============================================
   PROGRESS BAR
   ============================================ */

function updateProgress() {
  if (!audio.duration) return;
  var pct = (audio.currentTime / audio.duration) * 100;

  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-thumb').style.left  = pct + '%';
  document.getElementById('time-current').textContent   = formatTime(audio.currentTime);
}

function onProgressSeek(e) {
  var bar   = document.getElementById('progress-bar');
  var rect  = bar.getBoundingClientRect();
  var clientX = e.touches ? e.touches[0].clientX : e.clientX;
  var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

  seekingByClick = true;
  audio.currentTime = ratio * audio.duration;
  updateProgress();
  seekingByClick = false;
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  var m = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ============================================
   LYRICS — render (Spotify-style)
   All lines in normal document flow inside a
   scrollable wrapper. No translate tricks.
   ============================================ */

function renderLyrics() {
  var scroll = document.getElementById('lyrics-scroll');
  if (!scroll) return;

  lineEls = [];

  tunesData.lyrics.forEach(function (entry) {
    var el = document.createElement('div');

    if (entry.type === 'section') {
      el.className   = 'credit-section';
      el.textContent = '— ' + entry.text + ' —';
    } else {
      el.className   = 'credit-line';
      el.textContent = entry.text;
      lineEls.push({ el: el, time: entry.time });
    }

    scroll.appendChild(el);
  });

  /* Add half-wrapper-height padding top & bottom so the first and last
     lines can both be scrolled to the vertical centre of the viewport. */
  setTimeout(function () {
    var wrapper = document.getElementById('lyrics-wrapper');
    if (!wrapper) return;
    var half = Math.round(wrapper.clientHeight / 2);
    scroll.style.paddingTop    = half + 'px';
    scroll.style.paddingBottom = half + 'px';
  }, 80);
}

/* ============================================
   LYRICS — Spotify-style view update
   Called on every timeupdate event.
   Applies proximity brightness classes and
   smooth-scrolls the active line to centre.
   ============================================ */

function updateLyricsView() {
  if (!lineEls.length) return;

  var t = audio.currentTime;

  /* Find the most recent line at or before currentTime */
  var activeIdx = -1;
  for (var i = lineEls.length - 1; i >= 0; i--) {
    if (t >= lineEls[i].time) { activeIdx = i; break; }
  }

  /* Apply proximity-brightness classes */
  lineEls.forEach(function (item, i) {
    item.el.classList.remove('lyric-active', 'lyric-d1', 'lyric-d2');
    if (activeIdx < 0) return;
    var dist = Math.abs(i - activeIdx);
    if (dist === 0)      item.el.classList.add('lyric-active');
    else if (dist === 1) item.el.classList.add('lyric-d1');
    else if (dist <= 3)  item.el.classList.add('lyric-d2');
  });

  /* Scroll the wrapper so the active line sits at its vertical centre —
     only when the active line changes to avoid fighting the smooth scroll. */
  if (activeIdx !== lastActiveIdx) {
    lastActiveIdx = activeIdx;

    if (activeIdx >= 0) {
      var wrapper  = document.getElementById('lyrics-wrapper');
      var activeEl = lineEls[activeIdx].el;
      if (wrapper && activeEl) {
        var target = activeEl.offsetTop
                   - wrapper.clientHeight / 2
                   + activeEl.clientHeight / 2;
        wrapper.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  }
}
