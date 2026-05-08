/* =============================================
   WISHES PAGE — js/wishes.js
   Renders wish cards from wishesData.
   Handles card open/close and audio playback.
   Depends on: wishesData.js, config.js
   ============================================= */

var audioEl      = null;
var audioPlaying = false;
var isMuted      = false;

document.addEventListener('DOMContentLoaded', function () {
  renderWishes();
  initCardInteractions();
  initAudio();
});

/* ============================================
   RENDER
   ============================================ */

function renderWishes() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  var html = '';
  wishesData.forEach(function (wish, index) {
    html += buildWishCard(wish, index);
  });
  container.innerHTML = html;
}

function buildWishCard(wish, index) {
  var delay        = (index * 0.13 + 0.1).toFixed(2);
  var colorLight   = hexToRgba(wish.accentColor, 0.08);

  return (
    '<article class="wish-card" ' +
      'data-id="' + wish.id + '" ' +
      'aria-expanded="false" ' +
      'style="' +
        '--wish-color:' + wish.accentColor + ';' +
        '--wish-color-light:' + colorLight + ';' +
        'animation-delay:' + delay + 's' +
      '">' +
      '<div class="card-body">' +

        /* Sender tag — who this wish is from */
        '<div class="card-sender-tag">' +
          '<span class="sender-prefix">From</span>' +
          '<span class="sender-name script">' + wish.sender + '</span>' +
        '</div>' +

        /* Header: icon + title + wish category */
        '<div class="card-head">' +
          '<div class="card-icon-wrap">' +
            '<span class="card-icon">' + wish.icon + '</span>' +
          '</div>' +
          '<div class="card-meta">' +
            '<h2 class="card-title">' + wish.title + '</h2>' +
            '<span class="card-from script">' + wish.from + '</span>' +
          '</div>' +
        '</div>' +

        /* Preview — always visible */
        '<p class="card-preview">' + wish.preview + '</p>' +

        /* Expandable full message */
        '<div class="card-expandable">' +
          '<div class="card-expandable-inner">' +
            '<p class="card-message">' + wish.message + '</p>' +
            '<span class="card-closing script">&mdash; Always, with love. 🌸</span>' +
          '</div>' +
        '</div>' +

        /* Toggle button */
        '<button class="card-toggle-btn" aria-label="Read full wish">' +
          '<span class="toggle-label">Read</span>' +
          '<span class="toggle-icon">✦</span>' +
        '</button>' +

      '</div>' +
    '</article>'
  );
}

/* ============================================
   CARD INTERACTIONS
   ============================================ */

function initCardInteractions() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  container.addEventListener('click', function (e) {
    var card = e.target.closest('.wish-card');
    if (!card) return;

    var isOpen = card.classList.contains('is-open');

    /* Close all cards */
    container.querySelectorAll('.wish-card.is-open').forEach(function (c) {
      closeCard(c);
    });

    /* Open the tapped card if it was closed */
    if (!isOpen) {
      openCard(card);
    }
  });
}

function openCard(card) {
  card.classList.add('is-open');
  card.setAttribute('aria-expanded', 'true');

  var label = card.querySelector('.toggle-label');
  if (label) label.textContent = 'Close';

  /* Start music on first card open */
  startAudio();

  /* Scroll card into view on mobile */
  setTimeout(function () {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

function closeCard(card) {
  card.classList.remove('is-open');
  card.setAttribute('aria-expanded', 'false');

  var label = card.querySelector('.toggle-label');
  if (label) label.textContent = 'Read';
}

/* ============================================
   AUDIO
   ============================================ */

function initAudio() {
  audioEl = document.getElementById('wishes-audio');
  var toggleBtn = document.getElementById('audio-toggle');
  var audioPath = appConfig && appConfig.audio && appConfig.audio.wishesSong;

  if (!audioEl || !audioPath) return;

  /* Reveal mute toggle now we know audio is configured */
  if (toggleBtn) toggleBtn.removeAttribute('hidden');

  toggleBtn.addEventListener('click', function () {
    isMuted = !isMuted;
    audioEl.muted = isMuted;
    document.getElementById('audio-icon').textContent = isMuted ? '🔇' : '🔊';
  });
}

function startAudio() {
  if (!audioEl || audioPlaying) return;

  var playPromise = audioEl.play();

  if (playPromise !== undefined) {
    playPromise.then(function () {
      audioPlaying = true;
    }).catch(function () {
      /* Autoplay blocked — music plays next time user interacts */
    });
  }
}

/* ============================================
   UTILITY
   ============================================ */

function hexToRgba(hex, alpha) {
  /* Safely converts a 6-digit hex colour to rgba() */
  if (!hex || hex.length < 7) return 'rgba(212,96,122,' + alpha + ')';
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}
