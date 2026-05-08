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
  initLightboxDOM();     /* shared — from lightbox.js */
  initWishesLightbox();  /* wish-specific click handler */
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

  /* Attach image error handlers for wish media */
  container.querySelectorAll('.wish-media-strip .photo-front img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.closest('.photo-front').classList.add('no-image');
    });
  });
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

        /* Expandable full message + optional media */
        '<div class="card-expandable">' +
          '<div class="card-expandable-inner">' +
            '<p class="card-message">' + wish.message + '</p>' +
            '<span class="card-closing script">&mdash; Always, with love. 🌸</span>' +
            (wish.media && wish.media.length ? buildWishMediaHTML(wish.media) : '') +
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
    /* Polaroid photo clicks are handled by the lightbox — ignore here */
    if (e.target.closest('.timeline-photo')) return;

    var card = e.target.closest('.wish-card');
    if (!card) return;

    var isOpen      = card.classList.contains('is-open');
    var isToggleBtn = !!e.target.closest('.card-toggle-btn');

    if (isOpen) {
      /* Only the toggle button closes an already-open card */
      if (isToggleBtn) closeCard(card);
      /* Clicking anywhere else inside the open card does nothing */
      return;
    }

    /* Closed card clicked — close any open card and open this one */
    container.querySelectorAll('.wish-card.is-open').forEach(function (c) {
      closeCard(c);
    });
    openCard(card);
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
  if (!hex || hex.length < 7) return 'rgba(212,96,122,' + alpha + ')';
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

/* ============================================
   WISH MEDIA — build polaroid strip
   Same structure as journey polaroids so the
   shared CSS in global.css applies directly.
   ============================================ */

function buildWishMediaHTML(media) {
  if (!media || media.length === 0) return '';

  var html = '<div class="wish-media-strip">';

  media.forEach(function (item) {
    var isVideo = item.type === 'video';

    var mediaContent = isVideo
      ? '<video class="timeline-video" playsinline preload="none"' +
          (item.poster ? ' poster="' + item.poster + '"' : '') + '>' +
          '<source src="' + item.src + '" type="video/mp4">' +
        '</video>'
      : '<img src="' + item.src + '" alt="' + item.caption + '" loading="lazy">';

    html +=
      '<figure class="timeline-photo' + (isVideo ? ' timeline-photo--video' : '') + '">' +
        '<div class="photo-flipper">' +
          '<div class="photo-front">' + mediaContent + '</div>' +
          '<div class="photo-back">' +
            '<span class="back-deco">✦</span>' +
            '<p class="photo-caption">' + item.caption + '</p>' +
          '</div>' +
        '</div>' +
      '</figure>';
  });

  return html + '</div>';
}

/* ============================================
   WISHES LIGHTBOX — click handler
   DOM setup + open/close come from lightbox.js
   ============================================ */

function initWishesLightbox() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  container.addEventListener('click', function (e) {
    var photo = e.target.closest('.timeline-photo');
    if (!photo) return;

    var captionText = ((photo.querySelector('.photo-caption') || {}).textContent || '').trim();

    if (photo.classList.contains('timeline-photo--video')) {
      var inlineVideo = photo.querySelector('.timeline-video');
      if (!inlineVideo) return;
      e.stopPropagation();
      inlineVideo.pause();
      var sourceEl = inlineVideo.querySelector('source');
      var videoSrc = sourceEl ? sourceEl.getAttribute('src') : '';
      openLightbox({ type: 'video', src: videoSrc, caption: captionText, poster: inlineVideo.getAttribute('poster') || '' });
    } else {
      var img = photo.querySelector('.photo-front img');
      if (!img || photo.querySelector('.photo-front.no-image')) return;
      e.stopPropagation();
      openLightbox({ type: 'image', src: img.src, alt: img.alt, caption: captionText });
    }
  });
}
