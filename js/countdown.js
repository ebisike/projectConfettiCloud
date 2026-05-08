/* =============================================
   COUNTDOWN PAGE — js/countdown.js
   Handles: carousel, timer, audio, zero state
   Depends on: config.js (appConfig)
   ============================================= */

var carouselIndex = 0;
var activeLayerIndex = 0;
var carouselLayers = [];

var countdownInterval = null;

var audio   = null;
var isMuted = false;

/* ---- Passcode state ---- */
var currentPin = '';
var correctPin = '2869';
var pinLocked  = false; /* prevents input while checking/animating */

/* ---- Bootstrap ---- */
document.addEventListener('DOMContentLoaded', function () {
  initCarousel();
  initCountdown();
  initAudio();
});

/* ============================================
   CAROUSEL
   ============================================ */

function initCarousel() {
  var bg = document.getElementById('carousel-bg');
  var images = appConfig.carouselImages;
  var fallbacks = appConfig.carouselFallbacks;

  if (!bg || !images || images.length === 0) return;

  /* Create two layers that crossfade between each other */
  for (var i = 0; i < 2; i++) {
    var layer = document.createElement('div');
    layer.className = 'carousel-layer';
    bg.appendChild(layer);
    carouselLayers.push(layer);
  }

  /* Show first image on layer 0 */
  setLayerBackground(carouselLayers[0], 0);
  carouselLayers[0].classList.add('active');

  /* Only auto-advance if there's more than one image */
  if (images.length > 1) {
    setInterval(advanceCarousel, 5000);
  }
}

function setLayerBackground(layer, index) {
  var images   = appConfig.carouselImages;
  var fallbacks = appConfig.carouselFallbacks;
  var i        = index % images.length;
  var fallback = fallbacks[i % fallbacks.length];

  /* Image sits on top; gradient fallback shows if image fails to load */
  layer.style.backgroundImage = 'url("' + images[i] + '"), ' + fallback;
}

function advanceCarousel() {
  var images = appConfig.carouselImages;
  var nextIndex = (carouselIndex + 1) % images.length;

  /* The layer NOT currently active receives the next image */
  var incomingIndex = 1 - activeLayerIndex;
  var incoming = carouselLayers[incomingIndex];
  var outgoing = carouselLayers[activeLayerIndex];

  setLayerBackground(incoming, nextIndex);

  /* CSS transition handles the crossfade */
  incoming.classList.add('active');
  outgoing.classList.remove('active');

  carouselIndex = nextIndex;
  activeLayerIndex = incomingIndex;
}

/* ============================================
   COUNTDOWN TIMER
   ============================================ */

function initCountdown() {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  var now    = Date.now();
  var target = appConfig.countdownTarget.getTime();
  var diff   = target - now;

  if (diff <= 0) {
    clearInterval(countdownInterval);
    setUnit('cd-days',    0);
    setUnit('cd-hours',   0);
    setUnit('cd-minutes', 0);
    setUnit('cd-seconds', 0);
    showZeroState();
    return;
  }

  var days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setUnit('cd-days',    days);
  setUnit('cd-hours',   hours);
  setUnit('cd-minutes', minutes);
  setUnit('cd-seconds', seconds, true);
}

function setUnit(id, value, animatePop) {
  var el = document.getElementById(id);
  if (!el) return;

  var padded = String(value).padStart(2, '0');

  if (el.textContent === padded) return; /* no change, skip */

  el.textContent = padded;

  if (animatePop) {
    el.classList.remove('pop');
    void el.offsetWidth; /* force reflow so animation restarts */
    el.classList.add('pop');
  }
}

/* ============================================
   ZERO STATE → show passcode screen
   ============================================ */

function showZeroState() {
  var display  = document.getElementById('countdown-display');
  var dateEl   = document.querySelector('.countdown-date');
  var header   = document.querySelector('.countdown-header');
  var passcode = document.getElementById('passcode-screen');

  if (display)  display.style.display  = 'none';
  if (dateEl)   dateEl.style.display   = 'none';
  if (header)   header.style.display   = 'none';

  if (passcode) {
    passcode.removeAttribute('hidden');
    initPinPad();
  }
}

/* ============================================
   PASSCODE / PIN PAD
   ============================================ */

function initPinPad() {
  /* Digit buttons */
  document.querySelectorAll('.pin-btn[data-digit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      addDigit(this.getAttribute('data-digit'));
    });
  });

  /* Backspace button */
  var delBtn = document.getElementById('pin-del');
  if (delBtn) {
    delBtn.addEventListener('click', removeDigit);
  }

  /* Keyboard support — works when the passcode screen is visible */
  document.addEventListener('keydown', handlePinKeydown);
}

function handlePinKeydown(e) {
  if (e.key >= '0' && e.key <= '9') {
    addDigit(e.key);
  } else if (e.key === 'Backspace') {
    removeDigit();
  }
}

function addDigit(d) {
  if (pinLocked || currentPin.length >= 4) return;
  currentPin += d;
  updatePinDots();

  if (currentPin.length === 4) {
    pinLocked = true;
    /* Brief pause so the last dot fills before we check */
    setTimeout(checkPin, 220);
  }
}

function removeDigit() {
  if (pinLocked) return;
  currentPin = currentPin.slice(0, -1);
  updatePinDots();
}

function updatePinDots() {
  document.querySelectorAll('.pin-dots .dot').forEach(function (dot, i) {
    dot.classList.toggle('filled', i < currentPin.length);
  });
}

function checkPin() {
  if (currentPin === correctPin) {
    /* Correct — navigate to the menu */
    var page = document.querySelector('.page');
    if (page) page.classList.add('page-leaving');
    setTimeout(function () {
      window.location.href = 'menu.html';
    }, 300);
  } else {
    /* Wrong — shake, flash red, then alert */
    var dots = document.getElementById('pin-dots');
    if (dots) dots.classList.add('shake');

    setTimeout(function () {
      if (dots) dots.classList.remove('shake');
      currentPin = '';
      pinLocked  = false;
      updatePinDots();
      alert('You are not Chinenye; this is not for your eyes. 🤫');
    }, 450);
  }
}

/* ============================================
   AUDIO
   ============================================ */

function initAudio() {
  var toggleBtn  = document.getElementById('audio-toggle');
  var audioPath  = appConfig.audio && appConfig.audio.melody;

  audio = document.getElementById('bg-audio');

  /* Hide toggle if no audio configured */
  if (!audioPath || !audio) {
    if (toggleBtn) toggleBtn.style.display = 'none';
    return;
  }

  /* Attempt autoplay */
  var playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(function () {
      /* Autoplay blocked — unlock on first user interaction */
      var unlock = function () {
        if (!isMuted) audio.play();
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('click', unlock);
      };
      document.addEventListener('touchstart', unlock, { passive: true });
      document.addEventListener('click', unlock);
    });
  }

  /* Mute / unmute toggle */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      audio.muted = isMuted;
      document.getElementById('audio-icon').textContent = isMuted ? '🔇' : '🔊';
    });
  }
}
