# Trading Proxy (Cloudflare Worker)

Proxy trung gian để trang [/trading/](../tools/trading.md) trên blog lấy được dữ liệu
chứng khoán VN, vàng và tỷ giá. Blog là static site nên không gọi thẳng các API này
được (CORS / cần key) — Worker này đứng giữa và thêm CORS header.

> Thư mục này **không** deploy lên GitHub Pages (đã thêm vào `exclude` trong `_config.yml`).
> Nó deploy riêng lên Cloudflare.

## Các route

| Route | Mô tả | Ví dụ |
|---|---|---|
| `/vn/quote?symbols=FPT,VCB` | Giá realtime nhiều mã CK VN | giá, %thay đổi, KL |
| `/vn/history?symbol=FPT&days=90` | Nến ngày (cho biểu đồ) | OHLC |
| `/gold?symbols=XAU,XAG` | Giá kim loại quý (USD/oz) | vàng, bạc |
| `/forex?base=USD&symbols=VND,EUR` | Tỷ giá | USD→VND… |
| `/health` | Kiểm tra worker sống | |

## Deploy (lần đầu, ~5 phút)

### 1. Tạo tài khoản Cloudflare (miễn phí)
Vào https://dash.cloudflare.com/sign-up — không cần thẻ tín dụng.

### 2. Cài Wrangler (CLI của Cloudflare)
Cần Node.js. Trong thư mục này chạy:

```bash
npm install -g wrangler
```

### 3. Đăng nhập
```bash
wrangler login
```
(mở trình duyệt, bấm Allow)

### 4. Deploy
```bash
cd trading-proxy
wrangler deploy
```

Wrangler sẽ in ra URL dạng:
```
https://trading-proxy.<tên-bạn>.workers.dev
```

### 5. Nối vào blog
Mở [../tools/trading.md](../tools/trading.md), tìm dòng:

```js
var PROXY_BASE = "https://trading-proxy.YOUR-SUBDOMAIN.workers.dev";
```

Đổi thành URL worker vừa nhận được ở bước 4. Commit + push → xong.

### 6. (Khuyến nghị) Khoá domain
Mở [worker.js](worker.js), sửa mảng `ALLOWED_ORIGINS` cho đúng domain blog của bạn
(mặc định đã có `https://hanhlt107.github.io` và `localhost:4000`). Rồi `wrangler deploy` lại.

## Cập nhật về sau
Sửa `worker.js` rồi chạy lại `wrangler deploy`.

## Lưu ý
- Các API nguồn (VNDirect, gold-api, er-api) là **miễn phí, không chính thức** — có thể
  đổi/ngừng bất kỳ lúc nào. Nếu một route hỏng, kiểm tra lại URL nguồn trong `worker.js`.
- Gói free Cloudflare: 100.000 request/ngày — thừa cho blog cá nhân.
- Response được cache 15 giây (`Cache-Control`) để giảm tải nguồn.
