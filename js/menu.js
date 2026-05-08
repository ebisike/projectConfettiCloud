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
  /* On devices that support true hover (desktops), CSS :hover already
     expands the card — the click handler would fight that, so skip it. */
  var hasHover = window.matchMedia('(hover: hover)').matches;
  if (hasHover) return;

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
