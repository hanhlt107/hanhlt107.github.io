/* Random post button — jump to a random post, avoiding the current page. */
(function () {
  var btn = document.getElementById('random-post-btn');
  if (!btn) return;

  var urls = window.RANDOM_POST_URLS || [];
  if (!urls.length) { btn.style.display = 'none'; return; }

  btn.addEventListener('click', function () {
    var here = location.pathname.replace(/\/+$/, '');
    var pool = urls.filter(function (u) {
      return u.replace(/\/+$/, '') !== here;
    });
    if (!pool.length) pool = urls;

    var pick = pool[Math.floor(Math.random() * pool.length)];

    // Little spin animation before navigating.
    btn.classList.add('rolling');
    setTimeout(function () { location.href = pick; }, 350);
  });
})();
