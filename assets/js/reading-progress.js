(function () {
  var bar = document.getElementById('reading-progress-bar');
  var badge = document.getElementById('reading-progress-badge');
  var circleFill = document.getElementById('rp-circle-fill');
  var percentEl = document.getElementById('rp-percent-text');

  if (!bar || !badge) return;

  var CIRCUMFERENCE = 75.4; // 2 * π * 12

  function getScrollPercent() {
    var article = document.querySelector('article.blog-post');
    if (!article) return 0;

    var rect = article.getBoundingClientRect();
    var articleTop = rect.top + window.pageYOffset;
    var articleHeight = article.offsetHeight;
    var windowH = window.innerHeight;
    var scrolled = window.pageYOffset - articleTop + windowH * 0.1;
    var total = articleHeight - windowH * 0.9;

    if (total <= 0) return 100;
    var pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    return Math.round(pct);
  }

  function update() {
    var pct = getScrollPercent();

    // top bar
    bar.style.width = pct + '%';

    // circle arc
    if (circleFill) {
      circleFill.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * pct / 100);
    }

    // percentage text
    if (percentEl) {
      percentEl.textContent = pct + '%';
    }

    // badge visibility
    badge.classList.toggle('at-top', pct < 3);
    badge.classList.toggle('at-bottom', pct >= 99);
    badge.classList.toggle('visible', pct >= 3 && pct < 99);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
