/* Star rating — stores the reader's own rating per post in localStorage. */
(function () {
  var box = document.getElementById('star-rating');
  if (!box) return;

  var stars  = box.querySelectorAll('.sr-star');
  var thanks = box.querySelector('.sr-thanks');
  var KEY = 'rating_' + location.pathname;

  function paint(n) {
    stars.forEach(function (s) {
      s.classList.toggle('on', Number(s.getAttribute('data-val')) <= n);
    });
  }

  function showThanks(n) {
    thanks.textContent = '🎉 Cảm ơn bạn đã đánh giá ' + n + ' sao!';
    thanks.classList.add('show');
  }

  // Restore prior rating.
  var saved = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (saved > 0) { paint(saved); showThanks(saved); }

  stars.forEach(function (s) {
    s.addEventListener('click', function () {
      var n = Number(s.getAttribute('data-val'));
      localStorage.setItem(KEY, String(n));
      paint(n);
      showThanks(n);
    });
  });
})();
