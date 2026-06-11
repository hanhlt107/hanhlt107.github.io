/* Easter egg — type the Konami code (↑↑↓↓←→←→ B A) to trigger an emoji
 * rain across the screen. Also works by tapping the secret on mobile via a
 * 10-tap on the page title (optional, lightweight). */
(function () {
  var SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  var running = false;

  document.addEventListener('keydown', function (e) {
    // Ignore typing inside inputs.
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) { pos = 0; trigger(); }
    } else {
      // Allow restart if the wrong key was actually the first key.
      pos = (key === SEQ[0]) ? 1 : 0;
    }
  });

  function toast(msg) {
    var t = document.getElementById('egg-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'egg-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  function trigger() {
    if (running) return;
    running = true;
    toast('🎬 Bạn vừa mở khóa Easter Egg! 🍿');

    var EMOJIS = ['🎬','🍿','⭐','🎞️','🎉','✨','🦸','👾','🚀','❤️'];
    var canvas = document.createElement('canvas');
    canvas.id = 'egg-canvas';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = canvas.width = Math.floor(window.innerWidth * dpr);
    var H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    function rand(a, b) { return a + Math.random() * (b - a); }

    var drops = [];
    for (var i = 0; i < 70; i++) {
      drops.push({
        x: rand(0, W),
        y: rand(-H, 0),
        sp: rand(2, 6) * dpr,
        size: rand(18, 34) * dpr,
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.05, 0.05),
        ch: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      });
    }

    var start = null;
    var DURATION = 4500; // ms

    function frame(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += d.sp;
        d.rot += d.spin;
        if (d.y > H + d.size) { d.y = -d.size; d.x = rand(0, W); }
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.font = d.size + 'px serif';
        ctx.fillText(d.ch, 0, 0);
        ctx.restore();
      }
      if (elapsed < DURATION) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
        running = false;
      }
    }
    requestAnimationFrame(frame);
  }
})();
