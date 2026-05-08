/* =============================================
   JOURNEY PAGE — js/journey.js
   Renders timeline from journeyData.
   Each entry supports multiple photos with captions.
   Handles scroll-reveal via IntersectionObserver.
   Depends on: journeyData.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  renderTimeline();
  initScrollReveal();
  initLightbox();
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
}

function buildTimelineItem(item, index) {
  var isLeft = item.align === 'left';

  var photosHTML = buildPhotosHTML(item.images);

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

function buildPhotosHTML(images) {
  if (!images || images.length === 0) return '';

  var photosHTML = '<div class="timeline-photos">';

  images.forEach(function (mediaObj) {
    var isVideo = (mediaObj.type === 'video');

    /* Build the front-face media element */
    /* Inline video: no controls, no pointer events — acts as a poster thumbnail.
       Clicking the polaroid opens the lightbox where the video can be played. */
    var mediaHTML = isVideo
      ? '<video class="timeline-video" playsinline preload="none"' +
          (mediaObj.poster ? ' poster="' + mediaObj.poster + '"' : '') + '>' +
          '<source src="' + mediaObj.src + '" type="video/mp4">' +
        '</video>'
      : '<img src="' + mediaObj.src + '" alt="' + mediaObj.caption + '" loading="lazy">';

    photosHTML +=
      '<figure class="timeline-photo' + (isVideo ? ' timeline-photo--video' : '') + '">' +
        '<div class="photo-flipper">' +
          '<div class="photo-front">' +
            mediaHTML +
          '</div>' +
          '<div class="photo-back">' +
            '<span class="back-deco">✦</span>' +
            '<p class="photo-caption">' + mediaObj.caption + '</p>' +
          '</div>' +
        '</div>' +
      '</figure>';
  });

  photosHTML += '</div>';
  return photosHTML;
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