/* =============================================
   PAGE TRANSITIONS — js/transitions.js
   Intercepts internal link clicks and fades the
   current page out before navigating.
   Works on all pages without any configuration.
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
  var page = document.querySelector('.page');

  /* ---- Intercept internal link clicks ---- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');

    /* Skip: external URLs, anchors, mailto, tel */
    if (!href) return;
    if (href.startsWith('http') || href.startsWith('//')) return;
    if (href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;

    e.preventDefault();

    if (page) {
      page.classList.add('page-leaving');
      setTimeout(function () {
        window.location.href = href;
      }, 280);
    } else {
      window.location.href = href;
    }
  });
});
