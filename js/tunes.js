/* =============================================
   TUNES PAGE — js/tunes.js
   Custom music player with timestamped lyrics.
   Depends on: tunesData.js
   ============================================= */

var audio          = null;
var isPlaying      = false;
var seekingByClick = false;

/* Credits scroll geometry — populated after lyrics render */
var creditsStartY = 0;
var creditsEndY   = 0;

/* { el, time } pairs for each lyric line — used for active highlight */
var lineEls = [];

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

  /* Update progress bar + credits scroll while playing */
  audio.addEventListener('timeupdate', function () {
    if (!seekingByClick) updateProgress();
    updateCreditsScroll();
  });

  /* Reset when song ends */
  audio.addEventListener('ended', function () {
    isPlaying = false;
    document.querySelector('.tunes-page').classList.remove('playing');
    document.querySelector('.vinyl').classList.remove('spinning');
    setPlayIcon(false);
    updateProgress();
    /* Return credits to start position */
    var scroll = document.getElementById('lyrics-scroll');
    if (scroll) scroll.style.transform = 'translateY(' + creditsStartY + 'px)';
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
   CREDITS — render all lyrics into a single
   scrolling block (movie-credits style)
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

  /* Measure geometry once the browser has laid out the lyrics.
     Use a slightly longer delay on mobile where layout is slower. */
  setTimeout(setupCreditsScroll, 150);
}

function setupCreditsScroll() {
  var wrapper = document.getElementById('lyrics-wrapper');
  var scroll  = document.getElementById('lyrics-scroll');
  if (!wrapper || !scroll) return;

  var wH       = wrapper.offsetHeight;
  var contentH = scroll.offsetHeight;

  /* Start: lyrics block sits just below the visible window */
  creditsStartY = wH;
  /* End: last line has cleared the top of the window */
  creditsEndY   = -(contentH + wH * 0.25);

  /* Place at start position without transition */
  scroll.style.transition = 'none';
  scroll.style.transform  = 'translateY(' + creditsStartY + 'px)';

  /* Re-enable transition after forced reflow */
  void scroll.offsetWidth;
  scroll.style.transition = '';
}

/* ============================================
   CREDITS — sync scroll position to playback
   Called on every timeupdate event.
   ============================================ */

function updateCreditsScroll() {
  if (!audio.duration) return;

  var scroll = document.getElementById('lyrics-scroll');
  if (!scroll) return;

  /* Re-measure if setup hasn't run yet (creditsStartY still 0) */
  if (creditsStartY === 0 && creditsEndY === 0) setupCreditsScroll();

  /* Apply scrollSpeed from tunesData (default 1.0 if not set).
     Values above 1.0 finish the scroll before the song ends. */
  var speed    = tunesData.scrollSpeed || 1.0;
  var progress = Math.min((audio.currentTime / audio.duration) * speed, 1);
  var y        = creditsStartY + progress * (creditsEndY - creditsStartY);

  scroll.style.transform = 'translateY(' + y.toFixed(2) + 'px)';

  highlightActiveLine();
}

function highlightActiveLine() {
  var t          = audio.currentTime;
  var activeItem = null;

  /* Walk backwards — last entry whose time ≤ currentTime is the active one */
  for (var i = lineEls.length - 1; i >= 0; i--) {
    if (t >= lineEls[i].time) {
      activeItem = lineEls[i];
      break;
    }
  }

  lineEls.forEach(function (item) {
    item.el.classList.toggle('credit-line--active', item === activeItem);
  });
}
