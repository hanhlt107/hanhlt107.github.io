/* Resume reading — remembers scroll position per post and offers to jump back.
 * Only meaningful on long posts; ignores tiny scrolls and near-finished reads. */
(function () {
  var article = document.querySelector('article.blog-post') || document.querySelector('article');
  if (!article) return;

  var KEY = 'resume_' + location.pathname;
  var MIN_SAVE = 600;        // don't bother saving until scrolled this far (px)
  var NEAR_END = 0.92;       // if read past this fraction, treat as finished

  function maxScroll() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  // ---- Save scroll position (throttled) ----
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    setTimeout(function () {
      ticking = false;
      var y = window.pageYOffset;
      var frac = y / maxScroll();
      if (y < MIN_SAVE || frac >= NEAR_END) {
        localStorage.removeItem(KEY);   // too early or basically done → forget
      } else {
        localStorage.setItem(KEY, String(Math.round(y)));
      }
    }, 400);
  }, { passive: true });

  // ---- Offer to resume on load ----
  var saved = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (!saved || saved < MIN_SAVE) return;
  // If the page is short, or saved point is already in view, skip.
  if (saved <= window.pageYOffset + window.innerHeight * 0.5) return;

  var pct = Math.round((saved / maxScroll()) * 100);

  var bar = document.createElement('div');
  bar.id = 'resume-reading';
  bar.innerHTML =
    '<span class="rr-text">📖 Bạn đang đọc dở (<b>' + pct + '%</b>)</span>' +
    '<button type="button" class="rr-go">Đọc tiếp</button>' +
    '<button type="button" class="rr-close" aria-label="Bỏ qua">&times;</button>';
  document.body.appendChild(bar);

  requestAnimationFrame(function () { bar.classList.add('show'); });

  function dismiss() {
    bar.classList.remove('show');
    setTimeout(function () { bar.remove(); }, 320);
  }

  bar.querySelector('.rr-go').addEventListener('click', function () {
    window.scrollTo({ top: saved, behavior: 'smooth' });
    dismiss();
  });
  bar.querySelector('.rr-close').addEventListener('click', dismiss);

  // Auto-hide after a while if ignored.
  setTimeout(function () {
    if (document.body.contains(bar)) dismiss();
  }, 8000);
})();
