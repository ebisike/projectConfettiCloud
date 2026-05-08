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

function initLightboxDOM() {
  if (document.getElementById('photo-lightbox')) return; /* already present */

  var lb = document.createElement('div');
  lb.id        = 'photo-lightbox';
  lb.className = 'photo-lightbox';
  lb.setAttribute('hidden', '');
  lb.innerHTML =
    '<div class="lb-backdrop"></div>' +
    '<div class="lb-frame">' +
      '<img class="lb-img" src="" alt="" loading="eager">' +
      '<video class="lb-video" controls playsinline preload="none" hidden></video>' +
      '<p class="lb-caption script"></p>' +
      '<button class="lb-close" aria-label="Close">&times;</button>' +
    '</div>';
  document.body.appendChild(lb);

  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(opts) {
  var lb = document.getElementById('photo-lightbox');
  if (!lb) return;

  var imgEl     = lb.querySelector('.lb-img');
  var videoEl   = lb.querySelector('.lb-video');
  var captionEl = lb.querySelector('.lb-caption');

  captionEl.textContent = opts.caption || '';

  if (opts.type === 'video') {
    imgEl.setAttribute('hidden', '');
    imgEl.src = '';
    videoEl.removeAttribute('hidden');
    videoEl.setAttribute('poster', opts.poster || '');
    videoEl.src = opts.src;
    videoEl.load();
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
  document.body.style.overflow = '';
}
