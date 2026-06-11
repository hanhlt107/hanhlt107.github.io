/* Sparkle cursor trail — small twinkling stars follow the pointer and fade.
 * Only activates on pages with a theme effect (body[data-effect]), on devices
 * with a fine pointer (mouse), and respects prefers-reduced-motion. */
(function () {
  if (!document.body.getAttribute('data-effect')) return;
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // touch device → skip
  }

  var canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H;
  function resize() {
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Sparkle colour: gold on light bg, white-ish on dark.
  function color(a) {
    return document.body.classList.contains('dark-mode')
      ? 'rgba(255,255,255,' + a + ')'
      : 'rgba(255,196,0,' + a + ')';
  }

  var stars = [];
  var lastX = 0, lastY = 0, moved = false;

  window.addEventListener('mousemove', function (e) {
    lastX = e.clientX * dpr;
    lastY = e.clientY * dpr;
    moved = true;
    // Emit a couple of sparkles per move.
    var n = 2;
    for (var i = 0; i < n; i++) {
      stars.push({
        x: lastX + rand(-4, 4) * dpr,
        y: lastY + rand(-4, 4) * dpr,
        vx: rand(-0.4, 0.4) * dpr,
        vy: rand(0.2, 1.1) * dpr,   // drift gently downward
        size: rand(1.5, 3.5) * dpr,
        life: 1,
        decay: rand(0.012, 0.03),
        spikes: Math.random() < 0.5 ? 4 : 5
      });
    }
    if (stars.length > 220) stars.splice(0, stars.length - 220);
  }, { passive: true });

  function drawStar(s) {
    // Simple 4/5-point sparkle.
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    var spikes = s.spikes, outer = s.size, inner = s.size * 0.4;
    for (var i = 0; i < spikes * 2; i++) {
      var r = (i % 2 === 0) ? outer : inner;
      var a = (Math.PI / spikes) * i - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = color(s.life);
    ctx.fill();
    ctx.restore();
  }

  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) loop();
  });

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = stars.length - 1; i >= 0; i--) {
      var s = stars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) { stars.splice(i, 1); continue; }
      drawStar(s);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
