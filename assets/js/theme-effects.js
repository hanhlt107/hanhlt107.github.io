/* Theme effects — lightweight ambient canvas animations.
 * Activated by <body data-effect="stars|snow|matrix">. Respects
 * prefers-reduced-motion and pauses when the tab is hidden. */
(function () {
  var effect = document.body.getAttribute('data-effect');
  if (!effect) return;

  // Honour users who prefer no motion.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('has-theme-effect');

  var canvas = document.createElement('canvas');
  canvas.id = 'theme-effect-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');

  var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  // Pseudo-random helpers (no Math.random restriction here — runs in browser).
  function rand(a, b) { return a + Math.random() * (b - a); }

  // Particle colour adapts to light/dark background so it's always visible.
  function isDark() { return document.body.classList.contains('dark-mode'); }
  function particleRGB() { return isDark() ? '255,255,255' : '120,130,170'; }

  var particles = [];
  var draw;

  if (effect === 'stars') {
    // Twinkling starfield — great for Star Wars / space themes.
    for (var i = 0; i < 90; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.4, 1.6) * dpr,
        a: rand(0.2, 1), tw: rand(0.005, 0.03), dir: Math.random() < 0.5 ? 1 : -1
      });
    }
    draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.a += p.tw * p.dir;
        if (p.a > 1) { p.a = 1; p.dir = -1; }
        if (p.a < 0.15) { p.a = 0.15; p.dir = 1; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + particleRGB() + ',' + p.a + ')';
        ctx.fill();
      }
    };
  } else if (effect === 'snow') {
    // Gentle falling flakes — romantic / winter themes.
    for (var j = 0; j < 70; j++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        r: rand(1, 3) * dpr, sp: rand(0.3, 1.1) * dpr, sway: rand(0, Math.PI * 2),
        swaySp: rand(0.005, 0.02), a: rand(0.3, 0.8)
      });
    }
    draw = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.sp;
        p.sway += p.swaySp;
        var x = p.x + Math.sin(p.sway) * 8 * dpr;
        if (p.y > H + 5) { p.y = -5; p.x = rand(0, W); }
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + particleRGB() + ',' + p.a + ')';
        ctx.fill();
      }
    };
  } else if (effect === 'matrix') {
    // Falling green glyphs — The Matrix / tech themes.
    var fontSize = 14 * dpr;
    var cols = Math.floor(W / fontSize);
    var drops = [];
    for (var c = 0; c < cols; c++) drops.push(rand(0, H / fontSize));
    var glyphs = 'ｱｲｳｴｵｶｷｸ0123456789ABCDEF<>/{}[]';
    draw = function () {
      // Fade previous frame: dark trail on dark bg, light trail on light bg.
      ctx.fillStyle = isDark() ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.10)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = isDark() ? '#00cc6a' : '#0a8a4a';
      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
  } else {
    return; // unknown effect → do nothing
  }

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) loop();
  });

  function loop() {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
})();
