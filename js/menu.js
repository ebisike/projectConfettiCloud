/* =============================================
   MENU PAGE — js/menu.js
   Handles: card expand/collapse toggle
   No data rendering needed — cards are in HTML
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  initCards();
});

/* ============================================
   CARD EXPAND / COLLAPSE
   CSS hover handles expansion on pointer devices.
   JS click-toggle is for touch/mobile only.
   ============================================ */

function initCards() {
  /* Skip the click handler only on true desktop-mouse devices.
     (hover: hover) alone is unreliable — many mobile browsers now
     report it as true. Combining with (pointer: fine) correctly
     targets mouse/trackpad only; touch screens stay coarse. */
  var isDesktopMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktopMouse) return;

  var cards = document.querySelectorAll('.menu-card');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      /* Let the CTA anchor navigate without toggling */
      if (e.target.closest('.card-cta')) return;

      var isAlreadyExpanded = card.classList.contains('is-expanded');

      /* Collapse every card first */
      cards.forEach(function (c) {
        c.classList.remove('is-expanded');
        c.setAttribute('aria-expanded', 'false');
      });

      /* Expand the clicked card if it wasn't already open */
      if (!isAlreadyExpanded) {
        card.classList.add('is-expanded');
        card.setAttribute('aria-expanded', 'true');

        /* Scroll card into view so the revealed content is visible */
        setTimeout(function () {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    });
  });
}
