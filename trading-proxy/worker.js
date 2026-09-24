const ALLOWED_ORIGINS = [
  "https://hanhlt107.github.io",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
];

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

async function vnQuote(url, origin) {
  const symbols = (url.searchParams.get("symbols") || "")
    .toUpperCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (!symbols.length) return err("Thiếu tham số symbols", origin, 400);

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

async function vnHistory(url, origin) {
  const symbol = (url.searchParams.get("symbol") || "").toUpperCase().trim();
  if (!symbol) return err("Thiếu tham số symbol", origin, 400);
  const days = Math.min(parseInt(url.searchParams.get("days") || "90", 10), 730);

  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 86400 - 86400 * 10;
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
          price: d.price,
          updatedAt: d.updatedAt,
        };
      } catch {
        return { symbol: sym, error: true };
      }
    })
  );
  return json({ source: "gold-api", metals: results }, origin);
}

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

const TTS_MAX_CHARS = 4800;
const TTS_DEFAULT_VOICE = "vi-VN-Wavenet-A";
const TTS_FREE_MAX = 190;

async function tts(request, origin, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return err("Body phải là JSON { text }", origin, 400);
  }

  const text = (body.text || "").toString().slice(0, TTS_MAX_CHARS).trim();
  if (!text) return err("Thiếu text", origin, 400);

  const voiceName = (body.voice || TTS_DEFAULT_VOICE).toString();
  let rate = parseFloat(body.rate);
  if (!(rate >= 0.25 && rate <= 4)) rate = 1;

  const audioContent = (env && env.GOOGLE_TTS_KEY)
    ? await ttsGoogleCloud(text, voiceName, rate, env)
    : await ttsFree(text);

  return new Response(JSON.stringify({ audioContent }), {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      ...corsHeaders(origin),
      "Cache-Control": "public, max-age=86400",
    },
  });
}

async function ttsGoogleCloud(text, voiceName, rate, env) {
  const payload = {
    input: { text },
    voice: { languageCode: "vi-VN", name: voiceName },
    audioConfig: { audioEncoding: "MP3", speakingRate: 1 },
  };
  const res = await fetch(
    "https://texttospeech.googleapis.com/v1/text:synthesize?key=" +
      encodeURIComponent(env.GOOGLE_TTS_KEY),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error("Google TTS " + res.status + " " + detail.slice(0, 200));
  }
  const data = await res.json();
  return data.audioContent;
}

async function ttsFree(text) {
  const parts = splitForTTS(text, TTS_FREE_MAX);
  const buffers = [];
  for (const part of parts) {
    const u =
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob" +
      "&q=" + encodeURIComponent(part) + "&textlen=" + part.length;
    const r = await fetch(u, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://translate.google.com/",
      },
    });
    if (!r.ok) throw new Error("Translate TTS " + r.status);
    buffers.push(new Uint8Array(await r.arrayBuffer()));
  }
  let total = 0;
  for (const b of buffers) total += b.length;
  const merged = new Uint8Array(total);
  let off = 0;
  for (const b of buffers) { merged.set(b, off); off += b.length; }
  return bytesToBase64(merged);
}

function splitForTTS(text, max) {
  const sentences = text.match(/[^.!?…\n]+[.!?…]?/g) || [text];
  const out = [];
  let buf = "";
  const push = (s) => { if (s.trim()) out.push(s.trim()); };
  for (let s of sentences) {
    s = s.trim();
    if (!s) continue;
    if (s.length > max) {
      if (buf) { push(buf); buf = ""; }
      const words = s.split(/\s+/);
      let line = "";
      for (const w of words) {
        if ((line + " " + w).trim().length > max) { push(line); line = w; }
        else line = (line + " " + w).trim();
      }
      if (line) buf = line;
    } else if ((buf + " " + s).trim().length > max) {
      push(buf); buf = s;
    } else {
      buf = (buf + " " + s).trim();
    }
  }
  push(buf);
  return out;
}

function bytesToBase64(bytes) {
  let bin = "";
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  }
  return btoa(bin);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS")
      return new Response(null, {
        headers: {
          ...corsHeaders(origin),
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
      });

    try {
      if (request.method === "POST") {
        if (url.pathname === "/tts") return await tts(request, origin, env);
        return err("Route POST không tồn tại", origin, 404);
      }

      if (request.method !== "GET")
        return err("Chỉ hỗ trợ GET/POST", origin, 405);

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
