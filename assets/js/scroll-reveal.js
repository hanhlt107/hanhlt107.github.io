/* Scroll reveal — gently fades/slides article blocks in as they scroll into
 * view. Uses IntersectionObserver; degrades gracefully (content stays visible)
 * when unsupported or when reduced motion is preferred. */
(function () {
  var article = document.querySelector('article.blog-post') || document.querySelector('article');
  if (!article) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  // Pick top-level-ish content blocks to animate.
  var selector = 'p, h1, h2, h3, h4, ul, ol, blockquote, pre, img, table, figure, iframe, .highlight';
  var nodes = Array.prototype.slice.call(article.querySelectorAll(selector));

  // Avoid double-marking nested elements (e.g. an <img> inside a <p>).
  var targets = nodes.filter(function (el) {
    return !el.closest('.sr-reveal');
  });
  if (!targets.length) return;

  targets.forEach(function (el) { el.classList.add('sr-reveal'); });

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { obs.observe(el); });

  // Safety net: if anything is still hidden after load (e.g. above-the-fold
  // items already past the observer), reveal items currently in view.
  window.addEventListener('load', function () {
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('sr-visible');
    });
  });
})();
