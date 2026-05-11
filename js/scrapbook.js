/* =============================================
   SCRAPBOOK — js/scrapbook.js
   Collects all media from journeyData and
   wishesData, renders draggable polaroids on
   a canvas. Shuffle scatters them; Tidy Up
   snaps them into a neat grid.
   Click without dragging → lightbox.
   ============================================= */

var globalZ = 10; /* top z-index tracker */

document.addEventListener('DOMContentLoaded', function () {
  initLightboxDOM(); /* shared lightbox from lightbox.js */
  initScrapbook();
});

/* ============================================
   COLLECT MEDIA FROM ALL DATA FILES
   ============================================ */

function collectAllMedia() {
  var all = [];

  /* Journey entries */
  if (typeof journeyData !== 'undefined') {
    journeyData.forEach(function (entry) {
      if (!entry.images || !entry.images.length) return;
      entry.images.forEach(function (item) {
        all.push({
          type:    item.type || 'image',
          src:     item.src,
          caption: item.caption || '',
          poster:  item.poster  || '',
          context: entry.era    || ''
        });
      });
    });
  }

  /* Wish entries */
  if (typeof wishesData !== 'undefined') {
    wishesData.forEach(function (wish) {
      if (!wish.media || !wish.media.length) return;
      wish.media.forEach(function (item) {
        all.push({
          type:    item.type || 'image',
          src:     item.src,
          caption: item.caption || '',
          poster:  item.poster  || '',
          context: wish.sender  || ''
        });
      });
    });
  }

  /* Shuffle the order so journey and wish photos are interleaved */
  return shuffleArray(all);
}

/* ============================================
   BUILD DOM ELEMENT FOR ONE POLAROID
   ============================================ */

function buildPhotoEl(item) {
  var isVideo  = item.type === 'video';
  var figure   = document.createElement('figure');
  figure.className = 'timeline-photo' + (isVideo ? ' timeline-photo--video' : '');

  var mediaHTML = isVideo
    ? '<video class="timeline-video" playsinline preload="none"' +
        (item.poster ? ' poster="' + item.poster + '"' : '') + '>' +
        '<source src="' + item.src + '" type="video/mp4">' +
      '</video>'
    : '<img src="' + item.src + '" alt="' + item.caption + '" loading="lazy">';

  figure.innerHTML =
    '<div class="photo-flipper">' +
      '<div class="photo-front">' + mediaHTML + '</div>' +
      '<div class="photo-back">' +
        '<span class="back-deco">✦</span>' +
        '<p class="photo-caption">' + item.caption + '</p>' +
      '</div>' +
    '</div>';

  /* Image error fallback */
  var img = figure.querySelector('.photo-front img');
  if (img) {
    img.addEventListener('error', function () {
      this.closest('.photo-front').classList.add('no-image');
    });
  }

  return figure;
}

/* ============================================
   INIT SCRAPBOOK
   ============================================ */

function initScrapbook() {
  var canvas = document.getElementById('scrapbook-canvas');
  if (!canvas) return;

  var allMedia = collectAllMedia();
  if (allMedia.length === 0) {
    canvas.innerHTML =
      '<p style="text-align:center;padding:4rem;color:var(--color-text-light);font-style:italic;">' +
      'No media yet — add images and videos to journeyData and wishesData to fill this scrapbook.' +
      '</p>';
    return;
  }

  /* Create and append polaroids */
  var photos = allMedia.map(function (item) {
    var el = buildPhotoEl(item);
    el.style.zIndex = globalZ++;
    canvas.appendChild(el);
    return { el: el, item: item };
  });

  /* Set canvas height based on number of photos */
  var photoH  = 240; /* approx polaroid height in px */
  var cols    = Math.max(3, Math.floor(window.innerWidth / 220));
  var rows    = Math.ceil(photos.length / cols);
  canvas.style.minHeight = Math.max(window.innerHeight * 0.72, rows * (photoH + 24) + 60) + 'px';

  /* Start scattered — like a puzzle waiting to be solved */
  scatterPhotos(photos, canvas);

  /* Make each photo draggable */
  photos.forEach(function (p) { makeDraggable(p.el, p.item, canvas); });

  /* Wire toolbar buttons */
  document.getElementById('btn-shuffle').addEventListener('click', function () {
    var btn = this;
    btn.classList.add('spinning');
    setTimeout(function () { btn.classList.remove('spinning'); }, 500);
    scatterPhotos(photos, canvas);
  });

  document.getElementById('btn-tidy').addEventListener('click', function () {
    tidyPhotos(photos, canvas);
  });
}

/* ============================================
   SCATTER — random positions + rotations
   ============================================ */

function scatterPhotos(photos, canvas) {
  var cW = canvas.offsetWidth;
  var cH = parseInt(canvas.style.minHeight) || canvas.offsetHeight;

  var photoW = 185; /* frame width */
  var photoH = 255; /* frame height */

  photos.forEach(function (p) {
    var x   = rand(12, Math.max(cW - photoW - 12, 12));
    var y   = rand(12, Math.max(cH - photoH - 12, 12));
    var rot = (Math.random() - 0.5) * 36; /* -18° to +18° */

    p.el.style.left      = x + 'px';
    p.el.style.top       = y + 'px';
    p.el.style.transform = 'rotate(' + rot.toFixed(1) + 'deg)';
  });
}

/* ============================================
   TIDY UP — neat grid with slight rotations
   ============================================ */

function tidyPhotos(photos, canvas) {
  var cW    = canvas.offsetWidth;
  var gap   = 20;
  var photoW = 185;
  var photoH = 255;
  var cols   = Math.max(2, Math.floor((cW - gap) / (photoW + gap)));

  photos.forEach(function (p, i) {
    var col = i % cols;
    var row = Math.floor(i / cols);
    var x   = gap + col * (photoW + gap);
    var y   = gap + row * (photoH + gap);
    var rot = (Math.random() - 0.5) * 7; /* slight tilt, ±3.5° */

    p.el.style.left      = x + 'px';
    p.el.style.top       = y + 'px';
    p.el.style.transform = 'rotate(' + rot.toFixed(1) + 'deg)';
    p.el.style.zIndex    = i + 1;
  });

  /* Grow canvas if needed */
  var totalRows = Math.ceil(photos.length / cols);
  var needed    = gap + totalRows * (photoH + gap);
  if (parseInt(canvas.style.minHeight) < needed) {
    canvas.style.minHeight = needed + 'px';
  }
}

/* ============================================
   DRAG — mouse and touch with click detection
   ============================================ */

function makeDraggable(el, item, canvas) {
  var startX, startY, origLeft, origTop;
  var moved = false;

  function startDrag(clientX, clientY) {
    startX   = clientX;
    startY   = clientY;
    origLeft = parseFloat(el.style.left)  || 0;
    origTop  = parseFloat(el.style.top)   || 0;
    moved    = false;

    el.classList.add('dragging');
    el.style.zIndex = ++globalZ;
  }

  function duringDrag(clientX, clientY) {
    var dx = clientX - startX;
    var dy = clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;

    /* Clamp within canvas */
    var cW      = canvas.offsetWidth;
    var cH      = parseInt(canvas.style.minHeight) || canvas.offsetHeight;
    var photoW  = el.offsetWidth  || 185;
    var photoH  = el.offsetHeight || 255;

    var newLeft = Math.min(Math.max(0, origLeft + dx), cW - photoW);
    var newTop  = Math.min(Math.max(0, origTop  + dy), cH - photoH);

    el.style.left = newLeft + 'px';
    el.style.top  = newTop  + 'px';
  }

  function endDrag() {
    el.classList.remove('dragging');
    /* Tiny movement = treat as a click → open lightbox */
    if (!moved) openPhotoLightbox(el, item);
  }

  /* ---- Mouse ---- */
  el.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return; /* left button only */
    e.preventDefault();
    startDrag(e.clientX, e.clientY);

    function onMove(e) { duringDrag(e.clientX, e.clientY); }
    function onUp()   {
      endDrag();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  });

  /* ---- Touch ---- */
  el.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    startDrag(t.clientX, t.clientY);

    function onMove(e) {
      e.preventDefault(); /* block page scroll while dragging */
      var t = e.touches[0];
      duringDrag(t.clientX, t.clientY);
    }
    function onEnd() {
      endDrag();
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend',  onEnd);
    }
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend',  onEnd);
  }, { passive: true });
}

/* ============================================
   LIGHTBOX TRIGGER
   ============================================ */

function openPhotoLightbox(el, item) {
  if (item.type === 'video') {
    openLightbox({ type: 'video', src: item.src, caption: item.caption, poster: item.poster });
  } else {
    var img = el.querySelector('.photo-front img');
    if (!img || el.querySelector('.photo-front.no-image')) return;
    openLightbox({ type: 'image', src: img.src, alt: img.alt, caption: item.caption });
  }
}

/* ============================================
   UTILITIES
   ============================================ */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}
