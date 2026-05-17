/* =============================================
   CANDLE PAGE — js/candle.js
   Handles: cake build, flame flicker, blow
   sequence (keyboard + touch), smoke, confetti,
   celebration reveal, audio.
   Depends on: config.js (appConfig)
   ============================================= */

var hasBlown = false;

document.addEventListener('DOMContentLoaded', function () {
  initCakeImageFallback();
  buildCandles();
  arcCandles();
  randomiseFlickers();
  initControls();
});

/* ============================================
   CAKE IMAGE FALLBACK
   If cake.png fails to load, show a styled
   CSS placeholder so the page still works.
   ============================================ */

function initCakeImageFallback() {
  var img = document.querySelector('.cake-img');
  if (!img) return;

  img.addEventListener('error', function () {
    var fallback = document.createElement('div');
    fallback.className = 'cake-img-fallback';
    fallback.setAttribute('aria-label', 'Birthday cake');
    fallback.innerHTML = '<span class="fallback-emoji">🎂</span>';
    this.parentNode.insertBefore(fallback, this.nextSibling);
    this.style.display = 'none';
  });
}

/* ============================================
   BUILD CAKE CANDLES
   Caps at 10 for clean visual rendering.
   Age is displayed on the cake tier in HTML.
   ============================================ */

function buildCandles() {
  var row   = document.getElementById('candles-row');
  var count = Math.min(appConfig.candleCount, 10);

  for (var i = 0; i < count; i++) {
    var candle = document.createElement('div');
    candle.className = 'candle';
    candle.innerHTML =
      '<div class="flame"><div class="flame-inner"></div></div>' +
      '<div class="candle-body"></div>';
    row.appendChild(candle);
  }
}

/* ============================================
   ARC CANDLES along the cake top curve
   A round cake's top rim forms an elliptical
   arc. Edge candles sit higher than centre
   candles, following that curve.

   curveDepth — px edge candles rise above centre.
   Increase for a more pronounced arc.
   ============================================ */
function arcCandles() {
  var candles = document.querySelectorAll('.candle');
  var count   = candles.length;
  if (count <= 1) return;

  var center     = (count - 1) / 2;
  var curveDepth = 14; /* px */

  candles.forEach(function (candle, i) {
    var t       = (i - center) / center; /* -1 (left edge) → 0 (centre) → 1 (right edge) */
    var yOffset = -(curveDepth * t * t); /* negative = upward; edges rise, centre stays */
    candle.style.transform = 'translateY(' + yOffset.toFixed(1) + 'px)';
  });
}

/* Give each flame a slightly different flicker timing so they
   don't all pulse in perfect synchrony — more natural. */
function randomiseFlickers() {
  document.querySelectorAll('.flame').forEach(function (flame) {
    flame.style.animationDuration = (0.4 + Math.random() * 0.35).toFixed(2) + 's';
    flame.style.animationDelay    = (Math.random() * 0.3).toFixed(2) + 's';
  });
}

/* ============================================
   CONTROLS — keyboard B + tap button
   ============================================ */

function initControls() {
  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'b' || e.key === 'B') && !hasBlown) blow();
  });

  /* Tap / click button */
  var btn = document.getElementById('blow-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!hasBlown) blow();
    });
  }
}

/* ============================================
   BLOW SEQUENCE
   ============================================ */

function blow() {
  if (hasBlown) return;
  hasBlown = true;

  hideInstruction();
  blowOutFlames();
  // playSound();
  playBirthdaySong(); /* starts the moment the candles blow */

  setTimeout(launchConfetti,   350);
  setTimeout(showCelebration,  900);
  updateButton();
}

function hideInstruction() {
  var el = document.getElementById('instruction');
  if (el) {
    el.style.transition = 'opacity 0.4s ease';
    el.style.opacity    = '0';
    setTimeout(function () { el.style.display = 'none'; }, 400);
  }
}

/* Stagger each flame going out for a realistic whoosh */
function blowOutFlames() {
  var candles = document.querySelectorAll('.candle');

  candles.forEach(function (candle, i) {
    setTimeout(function () {
      var flame = candle.querySelector('.flame');
      if (!flame) return;

      /* 1. Blow-out animation on the flame */
      flame.classList.add('blown');

      /* 2. After animation: hide flame, show smoke */
      setTimeout(function () {
        flame.style.visibility = 'hidden';

        var smoke = document.createElement('div');
        smoke.className = 'smoke';
        candle.insertBefore(smoke, candle.firstChild);

        /* Remove smoke element once animation ends */
        setTimeout(function () { smoke.remove(); }, 2100);
      }, 400);

    }, i * 90); /* 90ms stagger between each candle */
  });
}

function updateButton() {
  var btn  = document.getElementById('blow-btn');
  var icon = btn && btn.querySelector('.blow-icon');
  var text = btn && btn.querySelector('.blow-text');

  if (btn)  btn.classList.add('blown');
  if (icon) icon.textContent = '🌸';
  if (text) text.textContent = 'Wish Made!';
}

/* ============================================
   CELEBRATION
   ============================================ */

function showCelebration() {
  var el = document.getElementById('celebration');
  if (el) el.removeAttribute('hidden');
}

/* ============================================
   CONFETTI
   Pure JS — no libraries.
   ============================================ */

function launchConfetti() {
  var container = document.getElementById('confetti-layer');
  if (!container) return;

  var colors = [
    '#D4607A', '#E8A84A', '#C9B2E8', '#F0B8C8',
    '#FFD700', '#A8D8EA', '#FF8C94', '#A8E6CF', '#FFFFFF'
  ];

  function spawnPiece(delay) {
    var piece    = document.createElement('div');
    var color    = colors[Math.floor(Math.random() * colors.length)];
    var size     = 5 + Math.random() * 9;
    var isCircle = Math.random() > 0.45;
    var duration = 2.4 + Math.random() * 2.2;
    var leftPos  = Math.random() * 100;

    piece.className = 'confetti-piece';
    piece.style.cssText = [
      'left:'                + leftPos                         + 'vw',
      'width:'               + size                            + 'px',
      'height:'              + (isCircle ? size : size * 1.7)  + 'px',
      'background:'          + color,
      'border-radius:'       + (isCircle ? '50%' : '2px'),
      'animation-duration:'  + duration                        + 's',
      'animation-delay:'     + (delay || 0)                   + 's'
    ].join(';');

    /* Self-remove when the fall animation ends — prevents DOM accumulation */
    piece.addEventListener('animationend', function () { this.remove(); });

    container.appendChild(piece);
  }

  /* Initial burst with staggered delays */
  for (var i = 0; i < 70; i++) {
    spawnPiece(Math.random() * 1.2);
  }

  /* Endless loop — top up the canvas every 350ms */
  setInterval(function () {
    for (var j = 0; j < 8; j++) {
      spawnPiece(j * 0.04);
    }
  }, 350);
}

/* ============================================
   AUDIO
   ============================================ */

function playSound() {
  var audio = document.getElementById('celebration-audio');
  if (!audio) return;

  var audioPath = appConfig && appConfig.audio && appConfig.audio.celebration;
  if (!audioPath) return;

  var promise = audio.play();
  if (promise !== undefined) {
    promise.catch(function () { /* autoplay blocked — silence is fine */ });
  }
}

function playBirthdaySong() {
  var audio = document.getElementById('birthday-audio');
  if (!audio) return;

  audio.volume = 0.35; /* comfortable level — not too loud */

  var promise = audio.play();
  if (promise !== undefined) {
    promise.catch(function () {
      /* Autoplay blocked — controls are visible so the user can press play */
    });
  }
}
