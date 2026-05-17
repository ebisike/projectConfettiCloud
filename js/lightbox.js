/* =============================================
   SHARED LIGHTBOX — js/lightbox.js
   Shared by journey.html and wishes.html.

   Provides three globals:
     initLightboxDOM()  — inject HTML + wire close handlers
     openLightbox(opts) — show an image or video
     closeLightbox()    — hide and clean up

   Page-specific click handlers live in each
   page's own JS file (journey.js / wishes.js).
   ============================================= */

/* Navigation state — set by openLightbox when items array is provided */
var lbItems = [];
var lbIndex = -1;

function initLightboxDOM() {
  if (document.getElementById('photo-lightbox')) return; /* already present */

  var lb = document.createElement('div');
  lb.id        = 'photo-lightbox';
  lb.className = 'photo-lightbox';
  lb.setAttribute('hidden', '');
  lb.innerHTML =
    '<div class="lb-backdrop"></div>' +
    '<div class="lb-frame">' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&lsaquo;</button>' +
      '<img class="lb-img" src="" alt="" loading="eager">' +
      '<video class="lb-video" controls playsinline preload="none" hidden></video>' +
      '<p class="lb-caption script"></p>' +
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-next" aria-label="Next">&rsaquo;</button>' +
    '</div>';
  document.body.appendChild(lb);

  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); navigateLightbox(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); navigateLightbox(+1); });

  document.addEventListener('keydown', function (e) {
    var lb = document.getElementById('photo-lightbox');
    if (!lb || lb.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(+1);
  });
}

/* Move to prev (-1) or next (+1) item in the current array */
function navigateLightbox(dir) {
  if (!lbItems.length || lbIndex < 0) return;
  var newIndex = lbIndex + dir;
  if (newIndex < 0 || newIndex >= lbItems.length) return; /* no wrap */

  var item = lbItems[newIndex];
  openLightbox({
    type:    item.type    || 'image',
    src:     item.src,
    alt:     item.caption || '',
    caption: item.caption || '',
    poster:  item.poster  || '',
    items:   lbItems,
    index:   newIndex
  });
}

/* Update prev/next button visibility based on position in array */
function updateNavButtons() {
  var lb = document.getElementById('photo-lightbox');
  if (!lb) return;
  var hasList = lbItems.length > 1;
  lb.querySelector('.lb-prev').style.display = (hasList && lbIndex > 0) ? '' : 'none';
  lb.querySelector('.lb-next').style.display = (hasList && lbIndex < lbItems.length - 1) ? '' : 'none';
}

function openLightbox(opts) {
  var lb = document.getElementById('photo-lightbox');
  if (!lb) return;

  var imgEl     = lb.querySelector('.lb-img');
  var videoEl   = lb.querySelector('.lb-video');
  var captionEl = lb.querySelector('.lb-caption');

  /* Store navigation context so arrow keys work */
  lbItems = opts.items  || [];
  lbIndex = (opts.index !== undefined) ? opts.index : -1;

  captionEl.textContent = opts.caption || '';
  updateNavButtons();

  if (opts.type === 'video') {
    imgEl.setAttribute('hidden', '');
    imgEl.src = '';
    videoEl.removeAttribute('hidden');
    videoEl.setAttribute('poster', opts.poster || '');
    videoEl.src = opts.src;
    videoEl.load();
    /* Auto-play — safe because the lightbox always opens from a user click */
    videoEl.addEventListener('canplay', function onCanPlay() {
      videoEl.removeEventListener('canplay', onCanPlay);
      videoEl.play().catch(function () { /* blocked — user can press play manually */ });
    });
  } else {
    videoEl.setAttribute('hidden', '');
    videoEl.pause();
    videoEl.src = '';
    imgEl.removeAttribute('hidden');
    imgEl.src = opts.src;
    imgEl.alt = opts.alt || '';
  }

  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  /* Pre-fetch the next two and previous one images so they're
     already cached when the user presses the arrow keys. */
  preloadAdjacentImages();
}

/* Silently load images adjacent to the current lightbox position */
function preloadAdjacentImages() {
  if (!lbItems.length || lbIndex < 0) return;
  [lbIndex + 1, lbIndex + 2, lbIndex - 1].forEach(function (idx) {
    if (idx < 0 || idx >= lbItems.length) return;
    var item = lbItems[idx];
    if (item && item.type !== 'video' && item.src) {
      var probe = new Image();
      probe.src = item.src; /* browser caches it for free */
    }
  });
}

function closeLightbox() {
  var lb = document.getElementById('photo-lightbox');
  if (!lb) return;

  var videoEl = lb.querySelector('.lb-video');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }

  lb.setAttribute('hidden', '');

  /* Only restore scroll if the gallery modal is also closed.
     If the user opened the lightbox from inside the gallery,
     the gallery should still be visible when the lightbox closes. */
  var gallery = document.getElementById('photo-gallery-modal');
  if (!gallery || gallery.hasAttribute('hidden')) {
    document.body.style.overflow = '';
  }
}
