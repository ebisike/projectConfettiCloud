/* =============================================
   SHARED PAGE CAROUSEL — js/carousel.js
   Crossfade image carousel for non-countdown pages.
   Uses the same images/fallbacks as the countdown page.

   ROLLBACK: set carouselOnAllPages: false in config.js
   ============================================= */

(function () {

  var carouselIndex  = 0;
  var activeLayer    = 0;
  var layers         = [];

  document.addEventListener('DOMContentLoaded', function () {
    if (!appConfig || !appConfig.carouselOnAllPages) return;
    init();
  });

  function init() {
    var bg     = document.getElementById('page-carousel');
    var images = appConfig.carouselImages;

    if (!bg || !images || images.length === 0) return;

    /* Two layers that crossfade between each other */
    for (var i = 0; i < 2; i++) {
      var layer = document.createElement('div');
      layer.className = 'page-carousel-layer';
      bg.appendChild(layer);
      layers.push(layer);
    }

    setBackground(layers[0], 0);
    layers[0].classList.add('active');

    if (images.length > 1) {
      setInterval(advance, 6000);
    }
  }

  function setBackground(layer, index) {
    var images    = appConfig.carouselImages;
    var fallbacks = appConfig.carouselFallbacks;
    var i         = index % images.length;
    var fallback  = fallbacks[i % fallbacks.length];
    layer.style.backgroundImage = 'url("' + images[i] + '"), ' + fallback;
  }

  function advance() {
    var images     = appConfig.carouselImages;
    var nextIndex  = (carouselIndex + 1) % images.length;
    var nextLayer  = 1 - activeLayer;

    setBackground(layers[nextLayer], nextIndex);
    layers[nextLayer].classList.add('active');
    layers[activeLayer].classList.remove('active');

    carouselIndex = nextIndex;
    activeLayer   = nextLayer;
  }

})();
