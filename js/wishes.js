/* =============================================
   WISHES PAGE — js/wishes.js
   Renders wish cards from wishesData.

   Wish types supported:
     • text  → rendered as text message + optional media strip
     • audio → rendered as custom audio player + optional media strip
     • video → rendered as custom video player + optional media strip

   Depends on: wishesData.js, config.js
   ============================================= */

var audioEl      = null;
var audioPlaying = false;
var isMuted      = false;

/* Gallery data keyed by wish id — populated when media array has items */
var wishMediaData = {};

document.addEventListener('DOMContentLoaded', function () {
  renderWishes();
  initCardInteractions();
  initAudio();
  initLightboxDOM();       /* shared — from lightbox.js */
  initWishesLightbox();    /* wish-specific click handler */
  initCardMediaPlayers();  /* audio + video play/pause controls */
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
  var delay      = (index * 0.13 + 0.1).toFixed(2);
  var colorLight = hexToRgba(wish.accentColor, 0.08);
  var wishType   = wish.type || 'text';
  var typeClass  = ' wish-card--' + wishType;
  var actionLabel = wishType === 'text' ? 'Read' : 'Play';
  var actionAria  = wishType === 'text' ? 'Read full wish' :
                    wishType === 'audio' ? 'Listen to wish' : 'Watch wish';

  return (
    '<article class="wish-card' + typeClass + '" ' +
      'data-id="' + wish.id + '" ' +
      'data-type="' + wishType + '" ' +
      'aria-expanded="false" ' +
      'style="' +
        '--wish-color:' + wish.accentColor + ';' +
        '--wish-color-light:' + colorLight + ';' +
        'animation-delay:' + delay + 's' +
      '">' +
      '<div class="card-body">' +

        /* Sender tag */
        '<div class="card-sender-tag">' +
          '<span class="sender-prefix">From</span>' +
          '<span class="sender-name script">' + escapeHtml(wish.sender) + '</span>' +
        '</div>' +

        /* Header: icon + title + wish category */
        '<div class="card-head">' +
          '<div class="card-icon-wrap">' +
            '<span class="card-icon">' + wish.icon + '</span>' +
          '</div>' +
          '<div class="card-meta">' +
            '<h2 class="card-title">' + escapeHtml(wish.title) + '</h2>' +
            '<span class="card-from script">' + escapeHtml(wish.from) + '</span>' +
          '</div>' +
        '</div>' +

        /* Preview — always visible */
        '<p class="card-preview">' + escapeHtml(wish.preview) + '</p>' +

        /* Expandable content: message or media player */
        '<div class="card-expandable">' +
          '<div class="card-expandable-inner">' +
          buildWishContent(wish) +
          (wish.media && wish.media.length ? buildWishMediaHTML(wish.media, wish.id) : '') +
          '</div>' +
        '</div>' +

        /* Toggle button */
        '<button class="card-toggle-btn" aria-label="' + actionAria + '">' +
          '<span class="toggle-label">' + actionLabel + '</span>' +
          '<span class="toggle-icon">✦</span>' +
        '</button>' +

      '</div>' +
    '</article>'
  );
}

/* Build the main content area based on wish type */
function buildWishContent(wish) {
  var type = wish.type || 'text';
  if (type === 'audio')  return buildMediaPlayerHTML(wish, 'audio');
  if (type === 'video')  return buildMediaPlayerHTML(wish, 'video');
  return buildTextWishHTML(wish);
}

/* Build text wish content */
function buildTextWishHTML(wish) {
  if (!wish.message) return '';
  return formatMessage(wish.message) +
    '<span class="card-closing script">&mdash; Always, with love. 🌸</span>';
}

/* Build audio OR video player (unified markup)

   For video: we render a poster preview + the player controls.
   If poster is empty, a colour-gradient placeholder is shown.
   Controls auto-hide/show on hover when paused/playing. */
function buildMediaPlayerHTML(wish, mediaType) {
  var isVideo   = mediaType === 'video';
  var elTag     = isVideo ? 'video' : 'audio';
  var extraAttr = isVideo ? ' playsinline' : '';
  var poster    = isVideo ? (wish.poster || '') : '';

  var posterHTML = '';
  if (isVideo) {
    posterHTML =
      '<div class="media-wish-poster">' +
        (poster ? '<img src="' + poster + '" alt="Preview" loading="lazy">' : '') +
        '<div class="media-wish-poster-overlay">' +
          '<span class="media-wish-poster-icon">▶</span>' +
        '</div>' +
      '</div>';
  }

  return (
    '<div class="media-wish-player" data-media-type="' + mediaType + '">' +
      '<div class="media-wish-visual">' +
        '<span class="media-wish-icon">' + wish.icon + '</span>' +
        '<span class="media-wish-label script">' +
          (isVideo ? 'A video message from ' : 'A voice note from ') +
          escapeHtml(wish.sender) +
        '</span>' +
      '</div>' +
      posterHTML +
      '<div class="media-wish-controls">' +
        '<button class="media-wish-play-btn" aria-label="Play">' +
          '<span class="media-wish-play-icon">▶</span>' +
        '</button>' +
        '<div class="media-wish-progress-wrap">' +
          '<div class="media-wish-progress-bar" role="slider" aria-label="Progress">' +
            '<div class="media-wish-progress-fill"></div>' +
            '<div class="media-wish-progress-thumb"></div>' +
          '</div>' +
          '<div class="media-wish-time">' +
            '<span class="media-wish-current">0:00</span>' +
            '<span class="media-wish-sep">/</span>' +
            '<span class="media-wish-duration">0:00</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<' + elTag + ' class="media-wish-el" preload="metadata"' + extraAttr + '>' +
        '<source src="' + wish.src + '" type="' + (isVideo ? 'video/mp4' : 'audio/mpeg') + '">' +
      '</' + elTag + '>' +
    '</div>'
  );
}

/* ============================================
   CARD INTERACTIONS
   ============================================ */

function initCardInteractions() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  container.addEventListener('click', function (e) {
    /* Polaroid photo clicks → lightbox */
    if (e.target.closest('.timeline-photo')) return;

    /* Media player controls → handled separately */
    if (e.target.closest('.media-wish-player')) return;

    var card = e.target.closest('.wish-card');
    if (!card) return;

    var isOpen      = card.classList.contains('is-open');
    var isToggleBtn = !!e.target.closest('.card-toggle-btn');

    if (isOpen) {
      if (isToggleBtn) closeCard(card);
      return;
    }

    /* Close any open card, then open this one */
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

  /* Start background wishes-song on first card open */
  startAudio();

  /* Scroll card into view on mobile */
  setTimeout(function () {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

function closeCard(card) {
  card.classList.remove('is-open');
  card.setAttribute('aria-expanded', 'false');

  var type = card.getAttribute('data-type') || 'text';
  var label = card.querySelector('.toggle-label');
  if (label) label.textContent = type === 'text' ? 'Read' : 'Play';

  /* Pause any playing media in this card */
  var mediaEl = card.querySelector('.media-wish-el');
  if (mediaEl) {
    mediaEl.pause();
    updateMediaPlayerUI(card.querySelector('.media-wish-player'), false);
  }
}

/* ============================================
   MEDIA PLAYER (audio + video)
   ============================================ */

function initCardMediaPlayers() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  container.querySelectorAll('.media-wish-player').forEach(function (player) {
    var playBtn     = player.querySelector('.media-wish-play-btn');
    var mediaEl     = player.querySelector('.media-wish-el');
    var progressBar = player.querySelector('.media-wish-progress-bar');
    var isVideo     = player.getAttribute('data-media-type') === 'video';

    if (!playBtn || !mediaEl) return;

    /* Play / pause toggle */
    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleCardMedia(player, mediaEl);
    });

    /* Update progress bar + time */
    mediaEl.addEventListener('timeupdate', function () {
      updateMediaProgress(player, mediaEl);
    });

    /* Update duration once metadata loads */
    mediaEl.addEventListener('loadedmetadata', function () {
      var durationEl = player.querySelector('.media-wish-duration');
      if (durationEl) durationEl.textContent = formatTime(mediaEl.duration);
    });

    /* Reset UI when media ends */
    mediaEl.addEventListener('ended', function () {
      updateMediaPlayerUI(player, false);
      mediaEl.currentTime = 0;
      updateMediaProgress(player, mediaEl);
      if (isVideo) player.classList.remove('video-playing');
    });

    /* Click on progress bar to seek */
    if (progressBar) {
      progressBar.addEventListener('click', function (e) {
        e.stopPropagation();
        var rect = progressBar.getBoundingClientRect();
        var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (mediaEl.duration) mediaEl.currentTime = ratio * mediaEl.duration;
      });
    }

    /* For video: show poster initially, hide when playing */
    if (isVideo) {
      mediaEl.addEventListener('play', function () {
        player.classList.add('video-playing');
      });
      mediaEl.addEventListener('pause', function () {
        player.classList.remove('video-playing');
      });
    }
  });
}

function toggleCardMedia(player, mediaEl) {
  /* Pause any other playing media first (audio or video) */
  document.querySelectorAll('.media-wish-el').forEach(function (el) {
    if (el !== mediaEl && !el.paused) {
      el.pause();
      var otherPlayer = el.closest('.media-wish-player');
      if (otherPlayer) updateMediaPlayerUI(otherPlayer, false);
    }
  });

  if (mediaEl.paused) {
    var promise = mediaEl.play();
    if (promise !== undefined) {
      promise.then(function () {
        updateMediaPlayerUI(player, true);
      }).catch(function () {
        /* Autoplay blocked */
      });
    }
  } else {
    mediaEl.pause();
    updateMediaPlayerUI(player, false);
  }
}

function updateMediaPlayerUI(player, isPlaying) {
  var playIcon = player.querySelector('.media-wish-play-icon');
  if (playIcon) playIcon.textContent = isPlaying ? '⏸' : '▶';
  player.classList.toggle('is-playing', isPlaying);
}

function updateMediaProgress(player, mediaEl) {
  if (!mediaEl.duration) return;
  var pct = (mediaEl.currentTime / mediaEl.duration) * 100;
  var fill = player.querySelector('.media-wish-progress-fill');
  var thumb = player.querySelector('.media-wish-progress-thumb');
  var currentEl = player.querySelector('.media-wish-current');

  if (fill) fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  if (currentEl) currentEl.textContent = formatTime(mediaEl.currentTime);
}

/* ============================================
   BACKGROUND AUDIO (wishes song)
   ============================================ */

function initAudio() {
  audioEl = document.getElementById('wishes-audio');
  var toggleBtn = document.getElementById('audio-toggle');
  var audioPath = appConfig && appConfig.audio && appConfig.audio.wishesSong;

  if (!audioEl || !audioPath) return;

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
      /* Autoplay blocked */
    });
  }
}

/* ============================================
   UTILITY
   ============================================ */

function formatMessage(text) {
  if (!text) return '';
  var html = text
    .trim()
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g,   '<br>');
  return '<p class="card-message">' + html + '</p>';
}

function hexToRgba(hex, alpha) {
  if (!hex || hex.length < 7) return 'rgba(212,96,122,' + alpha + ')';
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  var m = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ============================================
   WISH MEDIA — build polaroid strip
   ============================================ */

function buildWishMediaHTML(media, wishId) {
  if (!media || media.length === 0) return '';

  var galleryKey = 'wish-' + wishId;
  wishMediaData[galleryKey] = media;

  var html = '<div class="wish-media-strip">';

  media.forEach(function (item, idx) {
    var isVideo = item.type === 'video';
    var navAttrs = ' data-gallery="' + galleryKey + '" data-gallery-idx="' + idx + '"';

    var mediaContent = isVideo
      ? '<video class="timeline-video" playsinline preload="none"' +
          (item.poster ? ' poster="' + item.poster + '"' : '') + '>' +
          '<source src="' + item.src + '" type="video/mp4">' +
        '</video>'
      : '<img src="' + item.src + '" alt="' + escapeHtml(item.caption) + '" loading="lazy">';

    html +=
      '<figure class="timeline-photo' + (isVideo ? ' timeline-photo--video' : '') + '"' + navAttrs + '>' +
        '<div class="photo-flipper">' +
          '<div class="photo-front">' + mediaContent + '</div>' +
          '<div class="photo-back">' +
            '<span class="back-deco">✦</span>' +
            '<p class="photo-caption">' + escapeHtml(item.caption) + '</p>' +
          '</div>' +
        '</div>' +
      '</figure>';
  });

  return html + '</div>';
}

/* ============================================
   WISHES LIGHTBOX
   ============================================ */

function initWishesLightbox() {
  var container = document.getElementById('wishes-container');
  if (!container) return;

  container.addEventListener('click', function (e) {
    var photo = e.target.closest('.timeline-photo');
    if (!photo) return;

    var captionText = ((photo.querySelector('.photo-caption') || {}).textContent || '').trim();
    var navKey      = photo.getAttribute('data-gallery');
    var navIdx      = parseInt(photo.getAttribute('data-gallery-idx'), 10);
    var navItems    = (navKey && wishMediaData[navKey]) ? wishMediaData[navKey] : [];

    if (photo.classList.contains('timeline-photo--video')) {
      var inlineVideo = photo.querySelector('.timeline-video');
      if (!inlineVideo) return;
      e.stopPropagation();
      inlineVideo.pause();
      var sourceEl = inlineVideo.querySelector('source');
      var videoSrc = sourceEl ? sourceEl.getAttribute('src') : '';
      openLightbox({ type: 'video', src: videoSrc, caption: captionText,
                     poster: inlineVideo.getAttribute('poster') || '',
                     items: navItems, index: navIdx });
    } else {
      var img = photo.querySelector('.photo-front img');
      if (!img || photo.querySelector('.photo-front.no-image')) return;
      e.stopPropagation();
      openLightbox({ type: 'image', src: img.src, alt: img.alt, caption: captionText,
                     items: navItems, index: navIdx });
    }
  });
}
