---
layout: page
title: Trading
subtitle: Giá chứng khoán VN, hàng hoá & tỷ giá — cập nhật trực tiếp
permalink: /trading/
---

<!--
  Trang lấy dữ liệu LIVE qua Cloudflare Worker proxy (xem thư mục trading-proxy/).
  Sau khi deploy worker, đổi PROXY_BASE bên dưới thành URL worker của bạn.
-->

<style>
.tr-hero{padding:22px 20px;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e293b 55%,#0b3d2e);color:#fff;margin:4px 0 18px;box-shadow:0 6px 18px rgba(0,0,0,.15)}
.tr-hero h2{margin:0 0 6px;font-weight:800}
.tr-hero p{margin:0;opacity:.85;font-size:.95rem}
.tr-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
.tr-tab{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:7px 16px;font-weight:600;color:#374151;cursor:pointer;font-size:.9rem}
.tr-tab.active{background:#0b3d2e;border-color:#0b3d2e;color:#fff}
.tr-panel{display:none}
.tr-panel.active{display:block}
.tr-bar{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.tr-bar input{flex:1 1 220px;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:.92rem}
.tr-bar button{padding:9px 18px;background:#0b3d2e;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer}
.tr-bar button:hover{background:#0a5a40}
.tr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.tr-card{border:1px solid #e6e6e6;border-radius:12px;padding:14px 16px;background:#fff}
.tr-card .sym{font-weight:800;font-size:1.05rem}
.tr-card .px{font-size:1.5rem;font-weight:800;margin:4px 0}
.tr-card .meta{font-size:.78rem;color:#6b7280}
.tr-chg{font-weight:700;font-size:.9rem}
.up{color:#0b9d54}.down{color:#dc2626}.flat{color:#6b7280}
.tr-live{display:inline-flex;align-items:center;gap:6px}
.tr-dot{width:8px;height:8px;border-radius:50%;background:#0b9d54;box-shadow:0 0 0 0 rgba(11,157,84,.6);animation:tr-pulse 1.8s infinite}
@keyframes tr-pulse{0%{box-shadow:0 0 0 0 rgba(11,157,84,.6)}70%{box-shadow:0 0 0 7px rgba(11,157,84,0)}100%{box-shadow:0 0 0 0 rgba(11,157,84,0)}}
@keyframes tr-flash-up{0%{background:rgba(11,157,84,.22)}100%{background:transparent}}
@keyframes tr-flash-down{0%{background:rgba(220,38,38,.18)}100%{background:transparent}}
.flash-up{animation:tr-flash-up .9s ease-out}
.flash-down{animation:tr-flash-down .9s ease-out}
.tr-note{font-size:.78rem;color:#9ca3af;margin-top:14px}
.tr-status{font-size:.85rem;color:#6b7280;margin:8px 0;min-height:1.2em}
table.tr-fx{width:100%;border-collapse:collapse;font-size:.92rem}
table.tr-fx th,table.tr-fx td{padding:9px 12px;border-bottom:1px solid #eee;text-align:left}
table.tr-fx td.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}
body.dark-mode .tr-tab{background:#21262d;border-color:#30363d;color:#c9d1d9}
body.dark-mode .tr-card,body.dark-mode .tr-bar input{background:#161b22;border-color:#30363d;color:#c9d1d9}
body.dark-mode table.tr-fx th,body.dark-mode table.tr-fx td{border-color:#30363d}
</style>

<div class="tr-hero">
  <h2>📈 Bảng giá Trading</h2>
  <p>Chứng khoán Việt Nam, hàng hoá (vàng, dầu, xăng…) và tỷ giá — dữ liệu trực tiếp, cập nhật theo thời gian thực.</p>
</div>

<div class="tr-tabs">
  <button class="tr-tab active" data-tab="vn">🇻🇳 Chứng khoán VN</button>
  <button class="tr-tab" data-tab="cmd">🛢️ Hàng hoá</button>
  <button class="tr-tab" data-tab="fx">💱 Tỷ giá</button>
</div>

<!-- ===== Chứng khoán VN ===== -->
<div class="tr-panel active" id="panel-vn">
  <div class="tr-bar">
    <input id="vn-input" type="text" placeholder="Nhập mã, cách nhau dấu phẩy. Bỏ trống = mã top. VD: FPT,VCB,VNM" value="FPT,VCB,VIC,VHM,HPG,MWG,VNM,MBB,TCB,SSI">
    <button id="vn-go">Xem giá</button>
  </div>
  <div class="tr-status" id="vn-status"></div>
  <div class="tr-grid" id="vn-grid"></div>
</div>

<!-- ===== Hàng hoá ===== -->
<div class="tr-panel" id="panel-cmd">
  <div class="tr-status" id="cmd-status"></div>
  <div class="tr-grid" id="cmd-grid"></div>
  <p class="tr-note">Vàng/bạc tính theo USD/ounce. Dầu USD/thùng. Khí gas USD/MMBtu. Xăng USD/gallon. 1 lượng vàng ≈ 1.20565 oz.</p>
</div>

<!-- ===== Tỷ giá ===== -->
<div class="tr-panel" id="panel-fx">
  <div class="tr-status" id="fx-status"></div>
  <table class="tr-fx">
    <thead><tr><th>Tiền tệ</th><th style="text-align:right">1 USD =</th></tr></thead>
    <tbody id="fx-body"></tbody>
  </table>
</div>

<p class="tr-note">
  Dữ liệu chỉ mang tính tham khảo, có thể trễ. Nguồn: VNDirect (CK), Yahoo Finance (hàng hoá), ExchangeRate-API (tỷ giá).
  Đây không phải lời khuyên đầu tư.
</p>

<script>
(function () {
  // ⚠️ ĐỔI dòng này thành URL Cloudflare Worker của bạn sau khi deploy.
  // VD: "https://trading-proxy.tenban.workers.dev"
  var PROXY_BASE = "https://trading-proxy.hanhlt107.workers.dev";

  function fmt(n, d) {
    if (n == null || isNaN(n)) return "—";
    return Number(n).toLocaleString("vi-VN", { maximumFractionDigits: d == null ? 2 : d });
  }
  function chgClass(v) { return v > 0 ? "up" : v < 0 ? "down" : "flat"; }
  function arrow(v) { return v > 0 ? "▲" : v < 0 ? "▼" : "■"; }

  async function api(path) {
    var res = await fetch(PROXY_BASE + path);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  // ---- Tabs ----
  var tabs = document.querySelectorAll(".tr-tab");
  var loaded = { vn: false, cmd: false, fx: false };
  var activeTab = "vn"; // tab đang xem — chỉ tab này được auto-refresh

  // Lưu giá lần trước để so sánh -> flash xanh/đỏ khi đổi.
  var prev = { vn: {}, cmd: {}, fx: {} };

  // Mã CK VN mặc định khi ô input để trống (nhóm vốn hoá / thanh khoản top hiện nay).
  var VN_DEFAULT = "FPT,VCB,VIC,VHM,HPG,MWG,VNM,MBB,TCB,SSI";

  function flash(el, dir) {
    if (!el || !dir) return;
    var cls = dir > 0 ? "flash-up" : "flash-down";
    el.classList.remove("flash-up", "flash-down");
    void el.offsetWidth; // reset animation
    el.classList.add(cls);
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      document.querySelectorAll(".tr-panel").forEach(function (p) { p.classList.remove("active"); });
      t.classList.add("active");
      var key = t.getAttribute("data-tab");
      activeTab = key;
      document.getElementById("panel-" + key).classList.add("active");
      loaded[key] = true;
      loaders[key](); // luôn tải lại khi chuyển sang tab để có số mới nhất
      resetCountdown();
    });
  });

  // ---- VN stocks ----
  function loadVN(silent) {
    var input = document.getElementById("vn-input");
    var syms = input.value.trim();
    if (!syms) { syms = VN_DEFAULT; input.value = VN_DEFAULT; } // trống -> tự điền mã top
    var status = document.getElementById("vn-status");
    var grid = document.getElementById("vn-grid");
    if (!silent) { status.textContent = "Đang tải…"; grid.innerHTML = ""; }
    return api("/vn/quote?symbols=" + encodeURIComponent(syms))
      .then(function (d) {
        if (!d.quotes || !d.quotes.length) { status.textContent = "Không có dữ liệu."; return; }
        status.textContent = "Cập nhật: " + (d.quotes[0].date || "") + " " + (d.quotes[0].time || "");
        grid.innerHTML = d.quotes.map(function (q) {
          var c = chgClass(q.pctChange);
          return '<div class="tr-card" data-sym="' + q.symbol + '">' +
            '<div class="sym">' + q.symbol + ' <span class="meta">' + (q.floor || "") + '</span></div>' +
            '<div class="px">' + fmt(q.price) + '</div>' +
            '<div class="tr-chg ' + c + '">' + arrow(q.pctChange) + ' ' +
              fmt(q.change) + ' (' + fmt(q.pctChange) + '%)</div>' +
            '<div class="meta">C: ' + fmt(q.high) + ' · T: ' + fmt(q.low) +
              ' · KL: ' + fmt(q.volume, 0) + '</div>' +
          '</div>';
        }).join("");
        // Flash card nào có giá đổi so với lần trước
        d.quotes.forEach(function (q) {
          var old = prev.vn[q.symbol];
          if (old != null && old !== q.price) {
            flash(grid.querySelector('[data-sym="' + q.symbol + '"]'), q.price - old);
          }
          prev.vn[q.symbol] = q.price;
        });
      })
      .catch(function (e) { status.textContent = "Lỗi tải dữ liệu: " + e.message; });
  }
  document.getElementById("vn-go").addEventListener("click", function () { loadVN(); resetCountdown(); });
  document.getElementById("vn-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { loadVN(); resetCountdown(); }
  });

  // ---- Hàng hoá (vàng, bạc, dầu, xăng, khí, đồng, cà phê...) ----
  function loadCommodities(silent) {
    var status = document.getElementById("cmd-status");
    var grid = document.getElementById("cmd-grid");
    if (!silent) status.textContent = "Đang tải…";
    return api("/commodities")
      .then(function (d) {
        status.textContent = "";
        var list = (d.commodities || []).filter(function (m) { return !m.error; });
        if (!list.length) { status.textContent = "Không có dữ liệu."; return; }
        grid.innerHTML = list.map(function (m) {
          var c = chgClass(m.pctChange);
          return '<div class="tr-card" data-sym="' + m.key + '">' +
            '<div class="sym">' + m.name + '</div>' +
            '<div class="px">$' + fmt(m.price) + '</div>' +
            '<div class="tr-chg ' + c + '">' + arrow(m.pctChange) + ' ' +
              fmt(m.change) + ' (' + fmt(m.pctChange) + '%)</div>' +
            '<div class="meta">' + (m.unit || "") + '</div>' +
          '</div>';
        }).join("");
        list.forEach(function (m) {
          var old = prev.cmd[m.key];
          if (old != null && old !== m.price) {
            flash(grid.querySelector('[data-sym="' + m.key + '"]'), m.price - old);
          }
          prev.cmd[m.key] = m.price;
        });
      })
      .catch(function (e) { status.textContent = "Lỗi tải dữ liệu: " + e.message; });
  }

  // ---- Forex ----
  function loadFX(silent) {
    var status = document.getElementById("fx-status");
    var body = document.getElementById("fx-body");
    if (!silent) status.textContent = "Đang tải…";
    return api("/forex?base=USD&symbols=VND,EUR,JPY,CNY,KRW,GBP,THB,SGD")
      .then(function (d) {
        status.textContent = "Cập nhật: " + (d.updatedAt || "");
        var label = { VND: "🇻🇳 VND", EUR: "🇪🇺 EUR", JPY: "🇯🇵 JPY", CNY: "🇨🇳 CNY",
          KRW: "🇰🇷 KRW", GBP: "🇬🇧 GBP", THB: "🇹🇭 THB", SGD: "🇸🇬 SGD" };
        body.innerHTML = Object.keys(d.rates).map(function (k) {
          var dec = k === "VND" || k === "KRW" || k === "JPY" ? 0 : 4;
          return '<tr data-sym="' + k + '"><td>' + (label[k] || k) + '</td><td class="num">' +
            fmt(d.rates[k], dec) + '</td></tr>';
        }).join("");
        Object.keys(d.rates).forEach(function (k) {
          var old = prev.fx[k];
          if (old != null && old !== d.rates[k]) {
            flash(body.querySelector('[data-sym="' + k + '"]'), d.rates[k] - old);
          }
          prev.fx[k] = d.rates[k];
        });
      })
      .catch(function (e) { status.textContent = "Lỗi tải dữ liệu: " + e.message; });
  }

  var loaders = { vn: loadVN, cmd: loadCommodities, fx: loadFX };

  // ---- Auto-refresh engine (15s) ----
  var INTERVAL = 15;
  var left = INTERVAL;
  var cdEl = document.getElementById("tr-countdown");

  function resetCountdown() { left = INTERVAL; renderCountdown(); }
  function renderCountdown() {
    if (cdEl) cdEl.textContent = " · làm mới sau " + left + "s";
  }

  function tick() {
    // Không refresh khi tab trình duyệt đang ẩn (tiết kiệm request).
    if (document.hidden) return;
    left -= 1;
    if (left <= 0) {
      loaders[activeTab](true); // refresh ngầm tab đang xem
      left = INTERVAL;
    }
    renderCountdown();
  }
  setInterval(tick, 1000);

  // Khi quay lại tab trình duyệt, làm mới ngay cho tươi.
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) { loaders[activeTab](true); resetCountdown(); }
  });

  // Tải tab đầu tiên ngay khi mở trang.
  loaded.vn = true;
  loadVN();
  resetCountdown();
})();
</script>
