(function () {
  var PLAYLISTS = [
    { key: 'lofi',  label: 'Yên',     id: '2ay3bL886EFcjPp473EExe' },
    { key: 'us-uk',  label: 'US-UK', id: '22tG2U1D69EgpIRutSYkl9' },
    { key: 'han-trung', label: 'Hàn',     id: '2VokJxe3KnyTg1lcNTZv6B' },
    { key: 'chill',  label: 'Chill', id: '7w1sF2SFEUjG6uqSooO0o5' }
  ];

  var LS_OPEN  = 'rm_open';
  var LS_PL    = 'rm_playlist';

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function embedSrc(id) {
    return 'https://open.spotify.com/embed/playlist/' + id + '?utm_source=blog&theme=0';
  }

  function currentPlaylist() {
    var key = get(LS_PL, PLAYLISTS[0].key);
    for (var i = 0; i < PLAYLISTS.length; i++) {
      if (PLAYLISTS[i].key === key) return PLAYLISTS[i];
    }
    return PLAYLISTS[0];
  }

  var btn = document.createElement('button');
  btn.id = 'reading-mode-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Reading mode — nghe nhạc khi đọc');
  btn.title = 'Reading mode — nghe nhạc khi đọc';
  btn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"' +
    ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'reading-mode-panel';

  var chips = PLAYLISTS.map(function (p) {
    return '<button type="button" class="rm-chip" data-key="' + p.key + '">' + p.label + '</button>';
  }).join('');

  panel.innerHTML =
    '<div class="rm-header">' +
      '<span class="rm-title">🎶 Chữa Lành</span>' +
      '<button type="button" class="rm-close" aria-label="Đóng">&times;</button>' +
    '</div>' +
    '<div class="rm-body">' +
      '<div class="rm-picker">' + chips + '</div>' +
      '<iframe allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"' +
        ' loading="lazy" height="380"></iframe>' +
    '</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var iframe   = panel.querySelector('iframe');
  var closeBtn = panel.querySelector('.rm-close');
  var chipEls  = panel.querySelectorAll('.rm-chip');

  var iframeLoaded = false;

  function loadIframe() {
    if (iframeLoaded) return;
    iframe.src = embedSrc(currentPlaylist().id);
    iframeLoaded = true;
  }

  function selectPlaylist(key) {
    set(LS_PL, key);
    iframeLoaded = false;
    loadIframe();
    chipEls.forEach(function (c) {
      c.classList.toggle('selected', c.getAttribute('data-key') === key);
    });
  }

  function openPanel() {
    panel.classList.add('open');
    btn.classList.add('active');
    set(LS_OPEN, '1');
    loadIframe();
  }

  function closePanel() {
    panel.classList.remove('open');
    btn.classList.remove('active');
    set(LS_OPEN, '0');
  }

  btn.addEventListener('click', function () {
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener('click', closePanel);

  chipEls.forEach(function (c) {
    c.addEventListener('click', function () {
      selectPlaylist(c.getAttribute('data-key'));
    });
  });

  document.addEventListener('mousedown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    closePanel();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  chipEls.forEach(function (c) {
    c.classList.toggle('selected', c.getAttribute('data-key') === currentPlaylist().key);
  });
  if (get(LS_OPEN, '0') === '1') openPanel();
})();
