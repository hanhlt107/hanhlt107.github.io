(function () {
  var PROXY_BASE = "https://trading-proxy.hanhlt107.workers.dev";

  var box = document.getElementById('read-aloud');
  if (!box) return;
  var article = document.querySelector('article.blog-post') || document.querySelector('article');
  if (!article) { box.style.display = 'none'; return; }

  var playBtn  = box.querySelector('.ra-play');
  var stopBtn  = box.querySelector('.ra-stop');
  var rateSel  = box.querySelector('.ra-rate select');
  var hint     = box.querySelector('.ra-hint');

  var VOICE = 'vi-VN-Wavenet-A';

  var PLAY_LABEL   = '▶︎ Nghe bài viết';
  var PAUSE_LABEL  = '⏸ Tạm dừng';
  var RESUME_LABEL = '▶︎ Tiếp tục';
  var LOAD_LABEL   = '⏳ Đang tải giọng…';

  var CHUNK = 1800;
  var blockEls = [];
  article.querySelectorAll('p, h1, h2, h3, h4, li, blockquote').forEach(function (el) {
    var txt = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt.length > 1) blockEls.push({ el: el, text: txt });
  });
  if (!blockEls.length) { box.style.display = 'none'; return; }

  var chunks = [];
  (function buildChunks() {
    var buf = '', firstBlock = 0, started = false;
    blockEls.forEach(function (b, bi) {
      var piece = b.text + ' ';
      if (!started) { firstBlock = bi; started = true; }
      if ((buf + piece).length > CHUNK && buf) {
        chunks.push({ text: buf.trim(), blockIndex: firstBlock });
        buf = ''; firstBlock = bi;
      }
      buf += piece;
    });
    if (buf.trim()) chunks.push({ text: buf.trim(), blockIndex: firstBlock });
  })();

  var idx = 0;
  var playing = false;
  var audio = new Audio();
  var cache = {};
  var useFallback = false;
  var lastBlock = -1;

  function clearHighlight() { blockEls.forEach(function (b) { b.el.classList.remove('ra-speaking'); }); }
  function highlight(bi) {
    if (bi === lastBlock) return;
    clearHighlight(); lastBlock = bi;
    var b = blockEls[bi];
    if (b) {
      b.el.classList.add('ra-speaking');
      b.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function fetchChunk(i) {
    if (cache[i]) return Promise.resolve(cache[i]);
    return fetch(PROXY_BASE + '/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunks[i].text, voice: VOICE, rate: parseFloat(rateSel.value) || 1 })
    })
    .then(function (r) { if (!r.ok) throw new Error('tts ' + r.status); return r.json(); })
    .then(function (d) {
      if (!d.audioContent) throw new Error('no audio');
      var blob = b64ToBlob(d.audioContent, 'audio/mpeg');
      var u = URL.createObjectURL(blob);
      cache[i] = u;
      return u;
    });
  }

  function b64ToBlob(b64, type) {
    var bin = atob(b64);
    var len = bin.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: type });
  }

  function playFrom(i) {
    if (i >= chunks.length) { stop(); return; }
    idx = i;
    highlight(chunks[i].blockIndex);
    playBtn.textContent = LOAD_LABEL;

    fetchChunk(i).then(function (url) {
      if (!playing) return;
      playBtn.textContent = PAUSE_LABEL;
      audio.src = url;
      audio.playbackRate = parseFloat(rateSel.value) || 1;
      audio.play();
      if (i + 1 < chunks.length) fetchChunk(i + 1).catch(function () {});
    }).catch(function () {
      useFallback = true;
      startFallback(i);
    });
  }

  audio.addEventListener('ended', function () { if (playing && !useFallback) playFrom(idx + 1); });

  function startFallback(fromChunk) {
    if (!('speechSynthesis' in window)) { stop(); return; }
    if (hint) {
      hint.style.display = '';
      hint.textContent = '⚠️ Không kết nối được giọng AI, tạm dùng giọng của trình duyệt.';
    }
    var synth = window.speechSynthesis;
    function speak(i) {
      if (!playing || i >= chunks.length) { stop(); return; }
      idx = i; highlight(chunks[i].blockIndex);
      var u = new SpeechSynthesisUtterance(chunks[i].text);
      u.lang = 'vi-VN';
      u.rate = parseFloat(rateSel.value) || 1;
      u.onend = function () { if (playing) speak(i + 1); };
      u.onerror = function () { if (playing) speak(i + 1); };
      playBtn.textContent = PAUSE_LABEL;
      synth.speak(u);
    }
    speak(fromChunk);
  }

  function startPlaying() {
    playing = true;
    stopBtn.disabled = false;
    if (useFallback) startFallback(idx);
    else playFrom(idx);
  }

  function stop() {
    playing = false;
    audio.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    clearHighlight(); lastBlock = -1;
    idx = 0;
    playBtn.textContent = PLAY_LABEL;
    stopBtn.disabled = true;
  }

  function reset() {
    var wasPlaying = playing;
    stop();
    Object.keys(cache).forEach(function (k) { URL.revokeObjectURL(cache[k]); });
    cache = {};
    if (wasPlaying) startPlaying();
  }

  playBtn.addEventListener('click', function () {
    if (!playing) {
      if (!useFallback && audio.src && audio.paused && audio.currentTime > 0 && !audio.ended) {
        playing = true; audio.play(); playBtn.textContent = PAUSE_LABEL; return;
      }
      if (useFallback && window.speechSynthesis && window.speechSynthesis.paused) {
        playing = true; window.speechSynthesis.resume(); playBtn.textContent = PAUSE_LABEL; return;
      }
      startPlaying();
    } else {
      playing = false;
      if (useFallback && window.speechSynthesis) window.speechSynthesis.pause();
      else audio.pause();
      playBtn.textContent = RESUME_LABEL;
    }
  });

  stopBtn.addEventListener('click', stop);
  stopBtn.disabled = true;

  rateSel.addEventListener('change', function () {
    var r = parseFloat(rateSel.value) || 1;
    if (!useFallback) audio.playbackRate = r;
    else if (playing) { window.speechSynthesis.cancel(); startFallback(idx); }
  });

  window.addEventListener('beforeunload', function () {
    audio.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  });
})();
