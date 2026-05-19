(function () {
  var btn = document.getElementById('dark-mode-toggle');
  var STORAGE_KEY = 'dark-mode';

  function applyDark(on) {
    document.body.classList.toggle('dark-mode', on);
  }

  // Khôi phục preference
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'on') applyDark(true);
  else if (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches) applyDark(true);

  if (!btn) return;

  btn.addEventListener('click', function () {
    var isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(STORAGE_KEY, isDark ? 'on' : 'off');
  });
})();
