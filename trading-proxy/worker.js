/**
 * Cloudflare Worker — Trading data proxy cho blog Jekyll.
 *
 * Vì blog là static site (GitHub Pages), JS phía client KHÔNG gọi thẳng được
 * các API chứng khoán VN / vàng (bị chặn CORS hoặc cần key). Worker này đứng
 * giữa: nhận request từ blog -> gọi API nguồn -> thêm CORS header trả về.
 *
 * Nguồn dữ liệu (đều miễn phí, không cần API key — đã test 2026-06):
 *   - CK VN realtime : api-finfo.vndirect.com.vn  (giá, %thay đổi, OHLC ngày)
 *   - CK VN lịch sử  : dchart-api.vndirect.com.vn  (nến cho biểu đồ)
 *   - Vàng           : api.gold-api.com            (XAU, XAG... USD/oz)
 *   - Forex/Tỷ giá   : open.er-api.com             (USD -> VND, EUR, JPY...)
 *
 * Routes:
 *   GET /vn/quote?symbols=FPT,VCB,VNM   -> giá realtime nhiều mã
 *   GET /vn/history?symbol=FPT&days=90  -> nến ngày cho biểu đồ
 *   GET /gold?symbols=XAU,XAG           -> giá kim loại (USD/oz)
 *   GET /forex?base=USD&symbols=VND,EUR -> tỷ giá
 *   GET /health                         -> kiểm tra worker sống
 */

// CHỈ cho phép các domain này gọi proxy (chống lạm dụng). Sửa cho đúng domain blog của bạn.
const ALLOWED_ORIGINS = [
  "https://hanhlt107.github.io",
  "http://localhost:4000",   // jekyll serve local
  "http://127.0.0.1:4000",
];

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=15",
  };
}

function json(data, origin, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...corsHeaders(origin) },
  });
}

function err(message, origin, status = 502) {
  return json({ error: message }, origin, status);
}

// Helper: fetch JSON từ nguồn, có timeout + User-Agent (vài API chặn request không có UA).
async function fetchJSON(url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (trading-proxy)",
        Accept: "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// ---------- Handlers ----------

// CK VN realtime: lấy bản ghi giá mới nhất của mỗi mã.
async function vnQuote(url, origin) {
  const symbols = (url.searchParams.get("symbols") || "")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (!symbols.length) return err("Thiếu tham số symbols", origin, 400);

  // finfo trả nhiều ngày; lấy 2 ngày gần nhất mỗi mã rồi gom bản mới nhất.
  const codeFilter = symbols.join(",");
  const api =
    "https://api-finfo.vndirect.com.vn/v4/stock_prices?" +
    `q=code:${codeFilter}&sort=date:desc&size=${symbols.length * 2}`;
  const raw = await fetchJSON(api);
  const rows = raw.data || [];

  const latest = {};
  for (const r of rows) {
    if (!latest[r.code]) {
      latest[r.code] = {
        symbol: r.code,
        floor: r.floor,
        date: r.date,
        time: r.time,
        price: r.close,
        open: r.open,
        high: r.high,
        low: r.low,
        refPrice: r.basicPrice,
        ceiling: r.ceilingPrice,
        floorPrice: r.floorPrice,
        change: r.change,
        pctChange: r.pctChange,
        volume: r.nmVolume,
      };
    }
  }
  return json({ source: "vndirect", quotes: Object.values(latest) }, origin);
}

// CK VN lịch sử: nến ngày để vẽ biểu đồ.
async function vnHistory(url, origin) {
  const symbol = (url.searchParams.get("symbol") || "").toUpperCase().trim();
  if (!symbol) return err("Thiếu tham số symbol", origin, 400);
  const days = Math.min(parseInt(url.searchParams.get("days") || "90", 10), 730);

  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 86400 - 86400 * 10; // dư phòng ngày nghỉ
  const api =
    "https://dchart-api.vndirect.com.vn/dchart/history?" +
    `symbol=${symbol}&resolution=D&from=${from}&to=${to}`;
  const d = await fetchJSON(api);
  if (d.s !== "ok" || !Array.isArray(d.t))
    return err("Không có dữ liệu lịch sử", origin, 404);

  const candles = d.t.map((t, i) => ({
    time: t,
    open: d.o[i],
    high: d.h[i],
    low: d.l[i],
    close: d.c[i],
    volume: d.v ? d.v[i] : null,
  }));
  return json({ source: "vndirect", symbol, candles }, origin);
}

// Giá kim loại quý (USD/oz).
async function gold(url, origin) {
  const symbols = (url.searchParams.get("symbols") || "XAU")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
  const results = await Promise.all(
    symbols.map(async (sym) => {
      try {
        const d = await fetchJSON(`https://api.gold-api.com/price/${sym}`);
        return {
          symbol: sym,
          name: d.name,
          price: d.price, // USD / troy ounce
          updatedAt: d.updatedAt,
        };
      } catch {
        return { symbol: sym, error: true };
      }
    })
  );
  return json({ source: "gold-api", metals: results }, origin);
}

// Hàng hoá (vàng, bạc, dầu, xăng, khí, đồng, nông sản...) qua Yahoo Finance.
// Mỗi mặt hàng là 1 mã future của Yahoo (vd CL=F = dầu WTI).
const COMMODITY_MAP = {
  gold:     { y: "GC=F", name: "Vàng",       unit: "USD/oz" },
  silver:   { y: "SI=F", name: "Bạc",        unit: "USD/oz" },
  copper:   { y: "HG=F", name: "Đồng",       unit: "USD/lb" },
  wti:      { y: "CL=F", name: "Dầu WTI",    unit: "USD/thùng" },
  brent:    { y: "BZ=F", name: "Dầu Brent",  unit: "USD/thùng" },
  gas:      { y: "NG=F", name: "Khí gas",    unit: "USD/MMBtu" },
  gasoline: { y: "RB=F", name: "Xăng RBOB",  unit: "USD/gal" },
  corn:     { y: "ZC=F", name: "Ngô",        unit: "cent/giạ" },
  coffee:   { y: "KC=F", name: "Cà phê",     unit: "cent/lb" },
};

async function commodities(url, origin) {
  // Mặc định: nhóm phổ biến nhất.
  const keys = (url.searchParams.get("symbols") ||
    "gold,silver,wti,brent,gas,gasoline,copper,coffee")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter((s) => COMMODITY_MAP[s])
    .slice(0, 12);

  const results = await Promise.all(
    keys.map(async (key) => {
      const m = COMMODITY_MAP[key];
      try {
        const d = await fetchJSON(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(m.y)}`
        );
        const meta = d.chart.result[0].meta;
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose;
        const change = prevClose != null ? price - prevClose : null;
        const pct = prevClose ? (change / prevClose) * 100 : null;
        return {
          key,
          name: m.name,
          unit: m.unit,
          price,
          change,
          pctChange: pct,
        };
      } catch {
        return { key, name: m.name, unit: m.unit, error: true };
      }
    })
  );
  return json({ source: "yahoo", commodities: results }, origin);
}

// Forex / tỷ giá.
async function forex(url, origin) {
  const base = (url.searchParams.get("base") || "USD").toUpperCase().trim();
  const want = (url.searchParams.get("symbols") || "VND,EUR,JPY,CNY,KRW,GBP")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const d = await fetchJSON(`https://open.er-api.com/v6/latest/${base}`);
  if (d.result !== "success") return err("Lỗi nguồn tỷ giá", origin);
  const rates = {};
  for (const c of want) if (d.rates[c] != null) rates[c] = d.rates[c];
  return json(
    { source: "er-api", base, updatedAt: d.time_last_update_utc, rates },
    origin
  );
}

// ---------- Router ----------

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS")
      return new Response(null, { headers: corsHeaders(origin) });
    if (request.method !== "GET")
      return err("Chỉ hỗ trợ GET", origin, 405);

    try {
      switch (url.pathname) {
        case "/health":
          return json({ ok: true, ts: Date.now() }, origin);
        case "/vn/quote":
          return await vnQuote(url, origin);
        case "/vn/history":
          return await vnHistory(url, origin);
        case "/gold":
          return await gold(url, origin);
        case "/commodities":
          return await commodities(url, origin);
        case "/forex":
          return await forex(url, origin);
        default:
          return err("Route không tồn tại", origin, 404);
      }
    } catch (e) {
      return err("Proxy error: " + (e.message || "unknown"), origin);
    }
  },
};
