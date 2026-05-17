/* =============================================
   JOURNEY PAGE — js/journey.js
   Renders timeline from journeyData.
   Each entry supports multiple photos with captions.
   Handles scroll-reveal via IntersectionObserver.
   Depends on: journeyData.js
   ============================================= */

/* Gallery data keyed by section id — populated when photos exceed GALLERY_LIMIT */
var galleryData  = {};
var GALLERY_LIMIT = 4; /* max polaroids shown in the strip before overflow card */

document.addEventListener('DOMContentLoaded', function () {
  renderTimeline();
  initScrollReveal();
  initLightbox();
  initPhotoGallery();
  extractAllVideoPosters();
});

/* ============================================
   RENDER
   ============================================ */

function renderTimeline() {
  var container = document.getElementById('timeline');
  if (!container) return;

  var html = '';
  journeyData.forEach(function (item, index) {
    html += buildTimelineItem(item, index);
  });
  container.innerHTML = html;

  /* Attach image error handlers after innerHTML is set */
  container.querySelectorAll('.photo-front img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.closest('.photo-front').classList.add('no-image');
    });
  });

  /* Direct listeners on overflow cards — more reliable than delegation
     because the global hover-flip rule can make the card appear blank,
     confusing some browsers' hit-testing for delegated events. */
  container.querySelectorAll('.timeline-photo--overflow').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      openPhotoGallery(card.getAttribute('data-gallery'));
    });
  });
}

function buildTimelineItem(item, index) {
  var isLeft = item.align === 'left';

  var photosHTML = buildPhotosHTML(item.images, item.id);

  var textHTML =
    '<div class="timeline-text">' +
      '<span class="text-era script">' + item.era + '</span>' +
      '<h2 class="text-title">' + item.title + '</h2>' +
      '<p class="text-desc">' + item.description + '</p>' +
      '<span class="text-tag">' + item.tag + '</span>' +
    '</div>';

  return (
    '<article class="timeline-item align-' + item.align + '" data-index="' + index + '" aria-label="' + item.title + '">' +
      '<div class="timeline-side side-a">' + (isLeft ? photosHTML : textHTML) + '</div>' +
      '<div class="timeline-middle"><div class="timeline-dot"></div></div>' +
      '<div class="timeline-side side-b">' + (isLeft ? textHTML : photosHTML) + '</div>' +
    '</article>'
  );
}

function buildPhotosHTML(images, sectionId) {
  if (!images || images.length === 0) return '';

  var hasOverflow  = images.length > GALLERY_LIMIT;
  var visible      = hasOverflow ? images.slice(0, GALLERY_LIMIT) : images;
  var galleryKey   = 'section-' + sectionId;

  /* Always store — needed for lightbox arrow-key navigation too */
  galleryData[galleryKey] = images;

  var html = '<div class="timeline-photos" data-gallery="' + galleryKey + '">';

  visible.forEach(function (mediaObj, i) {
    html += buildPolaroidHTML(mediaObj, galleryKey, i);
  });

  if (hasOverflow) {
    var peek         = images[GALLERY_LIMIT]; /* 5th image shown blurred behind count */
    var hiddenCount  = images.length - GALLERY_LIMIT;
    var peekSrc      = (peek.type === 'video') ? (peek.poster || '') : peek.src;

    html +=
      '<figure class="timeline-photo timeline-photo--overflow" data-gallery="' + galleryKey + '"' +
        ' aria-label="View all ' + images.length + ' photos">' +
        '<div class="photo-flipper">' +
          '<div class="photo-front">' +
            (peekSrc ? '<img src="' + peekSrc + '" alt="" loading="lazy">' : '') +
            '<div class="overflow-badge">' +
              '<span class="overflow-plus">+' + hiddenCount + '</span>' +
              '<span class="overflow-more">more</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</figure>';
  }

  html += '</div>';
  return html;
}

/* Build a single polaroid figure (image or video).
   galleryKey + itemIndex are stamped as data attributes so the
   lightbox click handler can look up the full array for navigation. */
function buildPolaroidHTML(mediaObj, galleryKey, itemIndex) {
  var isVideo   = (mediaObj.type === 'video');
  var navAttrs  = (galleryKey !== undefined)
    ? ' data-gallery="' + galleryKey + '" data-gallery-idx="' + itemIndex + '"'
    : '';

  var mediaHTML = isVideo
    ? '<video class="timeline-video" playsinline preload="none"' +
        (mediaObj.poster ? ' poster="' + mediaObj.poster + '"' : '') + '>' +
        '<source src="' + mediaObj.src + '" type="video/mp4">' +
      '</video>'
    : '<img src="' + mediaObj.src + '" alt="' + mediaObj.caption + '" loading="lazy">';

  return (
    '<figure class="timeline-photo' + (isVideo ? ' timeline-photo--video' : '') + '"' + navAttrs + '>' +
      '<div class="photo-flipper">' +
        '<div class="photo-front">' + mediaHTML + '</div>' +
        '<div class="photo-back">' +
          '<span class="back-deco">✦</span>' +
          '<p class="photo-caption">' + mediaObj.caption + '</p>' +
        '</div>' +
      '</div>' +
    '</figure>'
  );
}


/* ============================================
   LIGHTBOX -- journey-specific click handler
   DOM setup + open/close live in lightbox.js
   ============================================ */

function initLightbox() {
  initLightboxDOM(); /* from lightbox.js */

  var timeline = document.getElementById('timeline');
  if (!timeline) return;

  timeline.addEventListener('click', function (e) {
    var photo = e.target.closest('.timeline-photo');
    if (!photo) return;

    /* Overflow cards are handled by their own direct listeners (attached in
       renderTimeline). Skip them here so lightbox code never runs on them. */
    if (photo.classList.contains('timeline-photo--overflow')) return;

    var captionText  = ((photo.querySelector('.photo-caption') || {}).textContent || '').trim();
    var navKey       = photo.getAttribute('data-gallery');
    var navIdx       = parseInt(photo.getAttribute('data-gallery-idx'), 10);
    var navItems     = (navKey && galleryData[navKey]) ? galleryData[navKey] : [];

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

/* ============================================
   PHOTO GALLERY MODAL
   Full grid of all photos in a section.
   Opens when the overflow card (+N more) is clicked.
   Individual photos open in the shared lightbox.
   ============================================ */

function initPhotoGallery() {
  if (document.getElementById('photo-gallery-modal')) return;

  var modal = document.createElement('div');
  modal.id        = 'photo-gallery-modal';
  modal.className = 'photo-gallery-modal';
  modal.setAttribute('hidden', '');
  modal.innerHTML =
    '<div class="gallery-backdrop"></div>' +
    '<div class="gallery-content">' +
      '<div class="gallery-header">' +
        '<span class="gallery-title script">All Photos</span>' +
        '<button class="gallery-close-btn" aria-label="Close gallery">&times;</button>' +
      '</div>' +
      '<div class="gallery-grid" id="gallery-grid"></div>' +
    '</div>';
  document.body.appendChild(modal);

  modal.querySelector('.gallery-backdrop').addEventListener('click', closePhotoGallery);
  modal.querySelector('.gallery-close-btn').addEventListener('click', closePhotoGallery);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePhotoGallery();
  });
}

var GALLERY_BATCH  = 24; /* thumbnails rendered per load */
var galleryImages  = []; /* full list for the current open gallery */
var galleryLoaded  = 0;  /* how many have been appended so far */

function openPhotoGallery(galleryKey) {
  var images = galleryData[galleryKey];
  if (!images || !images.length) return;

  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  /* Reset state for this gallery session */
  galleryImages = images;
  galleryLoaded = 0;
  grid.innerHTML = '';

  /* Remove any stale "Load more" button from a previous open */
  var old = document.getElementById('gallery-more-btn');
  if (old) old.remove();

  /* Render the first batch */
  appendGalleryBatch(grid, images);

  var modal = document.getElementById('photo-gallery-modal');
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

/* Append the next GALLERY_BATCH thumbnails to the grid */
function appendGalleryBatch(grid, images) {
  var end = Math.min(galleryLoaded + GALLERY_BATCH, images.length);

  for (var i = galleryLoaded; i < end; i++) {
    (function (item, idx) {
      var isVideo  = (item.type === 'video');
      var thumbSrc = isVideo ? (item.poster || '') : item.src;

      var thumb = document.createElement('div');
      thumb.className = 'gallery-thumb' + (isVideo ? ' gallery-thumb--video' : '');
      /* First batch: eager; subsequent batches: lazy — they're off-screen anyway */
      var loadAttr = (idx < GALLERY_BATCH) ? 'eager' : 'lazy';
      thumb.innerHTML =
        (thumbSrc ? '<img src="' + thumbSrc + '" alt="' + item.caption + '" loading="' + loadAttr + '">' : '') +
        (isVideo   ? '<span class="gallery-play">&#9654;</span>' : '') +
        '<p class="gallery-thumb-caption">' + item.caption + '</p>';

      thumb.addEventListener('click', function () {
        if (isVideo) {
          openLightbox({ type: 'video', src: item.src, caption: item.caption,
                         poster: item.poster || '', items: images, index: idx });
        } else {
          openLightbox({ type: 'image', src: item.src, alt: item.caption,
                         caption: item.caption, items: images, index: idx });
        }
      });

      grid.appendChild(thumb);
    }(images[i], i));
  }

  galleryLoaded = end;

  /* Add / remove the "Load more" button */
  var btn = document.getElementById('gallery-more-btn');
  if (galleryLoaded < images.length) {
    if (!btn) {
      btn = document.createElement('button');
      btn.id        = 'gallery-more-btn';
      btn.className = 'gallery-more-btn';
      btn.addEventListener('click', function () {
        appendGalleryBatch(grid, images);
      });
      grid.parentNode.appendChild(btn);
    }
    var remaining = images.length - galleryLoaded;
    btn.textContent = 'Load ' + Math.min(remaining, GALLERY_BATCH) + ' more  (' + remaining + ' left)';
  } else if (btn) {
    btn.remove();
  }
}

function closePhotoGallery() {
  var modal = document.getElementById('photo-gallery-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}


/* ============================================
   SCROLL REVEAL
   ============================================ */

function initScrollReveal() {
  var items = document.querySelectorAll('.timeline-item');

  /* Fallback for browsers without IntersectionObserver */
  if (!window.IntersectionObserver) {
    items.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); /* fire once only */
      }
    });
  }, {
    threshold: 0.1
  });

  items.forEach(function (item) { observer.observe(item); });
}

/* ============================================
   VIDEO POSTER EXTRACTION
   For every inline <video> that has no poster,
   seek to 2 s, grab a canvas frame, and stamp
   the JPEG data-URL as the poster attribute.
   Also updates galleryData so the photo-grid
   thumbnails benefit from the same frame.
   ============================================ */

function extractAllVideoPosters() {
  var container = document.getElementById('timeline');
  if (!container) return;

  container.querySelectorAll('.timeline-video').forEach(function (videoEl) {
    /* Skip videos that already have a poster defined in the data */
    if (videoEl.getAttribute('poster')) return;

    var sourceEl = videoEl.querySelector('source');
    var src      = sourceEl ? sourceEl.getAttribute('src') : '';
    if (!src) return;

    extractVideoPoster(videoEl, src);
  });
}

function extractVideoPoster(videoEl, src) {
  var probe = document.createElement('video');
  probe.crossOrigin = 'anonymous';
  probe.muted       = true;
  probe.preload     = 'metadata';

  /* Step 1: once we know the duration, seek to min(2s, near-end) */
  probe.addEventListener('loadedmetadata', function () {
    probe.currentTime = Math.min(2, Math.max(0.1, probe.duration - 0.1));
  }, { once: true });

  /* Step 2: once the seek lands, draw the frame */
  probe.addEventListener('seeked', function () {
    var MAX_W  = 640; /* cap thumbnail width to keep data-URL small */
    var scale  = probe.videoWidth ? Math.min(1, MAX_W / probe.videoWidth) : 1;
    var w      = Math.round((probe.videoWidth  || 320) * scale);
    var h      = Math.round((probe.videoHeight || 180) * scale);

    var canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(probe, 0, 0, w, h);

    var posterUrl = canvas.toDataURL('image/jpeg', 0.82);

    /* Apply to the inline polaroid video */
    videoEl.setAttribute('poster', posterUrl);

    /* Propagate into galleryData so the photo-grid shows the same frame */
    Object.keys(galleryData).forEach(function (key) {
      galleryData[key].forEach(function (item) {
        if (item.type === 'video' && item.src === src) {
          item.poster = posterUrl;
        }
      });
    });

    probe.src = ''; /* release the object */
  }, { once: true });

  probe.addEventListener('error', function () { probe.src = ''; }, { once: true });

  probe.src = src;
}