---
layout: post
title: Cách explain giúp tôi tối ưu query chạy từ 30s còn 1.5s
subtitle: Khi SQL không sai nhưng lại rất chậm – bạn cần công cụ giúp "soi" bên trong. Và đó chính là explain.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

### 1. Vấn đề thực tế: Truy vấn tưởng đơn giản nhưng "giết chết" hiệu năng
Trong một dự án gần đây, tôi gặp phải tình huống quen thuộc:
Một truy vấn thống kê top khách hàng theo tổng chi tiêu, sử dụng `JOIN`, `GROUP BY`, `ORDER BY` trên bảng dữ liệu lớn.

```
SELECT u.name, SUM(o.amount) AS total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
AND o.created_at BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY u.id
ORDER BY total_spent DESC;
```

<div style='margin-bottom:16px'></div>

Câu truy vẫn chạy được - những phải mất hơn 30s để trả kết quả trên môi trường production (hơn 2 triệu bản ghi trong bảng `orders`).

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Chuẩn đoán: Dùng `EXPLAIN` để hiểu chuyện gì đang xảy ra
Chạy `EXPLAIN` giúp tôi nhìn thấy kế hoạch thực thi truy vấn:

```
EXPLAIN SELECT ...
```

<div style='margin-bottom:16px'></div>

**Kết quả:**

| <small>**id**<small/> | <small>**table**<small/> | <small>**type**<small/> | <small>**key**<small/> | <small>**rows**<small/> | <small>**Extra**<small/> |
|----------------------|----------------------|----------------------|----------------------|----------------------|----------------------|
| <small>1<small/> | <small>orders<small/> | <small>ALL<small/> | <small>NULL<small/> | <small>2,100,000<small/> | <small>Using where<small/> |
| <small>1<small/> | <small>users<small/> |  <small>eq_ref<small/> | <small>PRIMARY<small/> | <small>1<small/> | <small><small/> |
{: style="width:100%; margin-bottom:16px"}

**Phân tích:**
* Bảng `orders` bị quét toàn bộ (`type = ALL`), tức full table scan.
* Không có index nào được sử dụng cho điều kiện `status`, `created_at`, hay `user_id`.
* Đây là nguyên nhân khiến truy vấn cực kỳ chậm.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Nguyên nhân cốt lõi: Thiếu index phù hợp với điều kiện lọc
Mặc dù tôi đã lọc `status` và `created_at`, nhưng do thiếu chỉ mục, MySQL không thể tối ưu việc tìm kiếm -> dẫn đến việc duyệt từng bản ghi một.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Giải pháp: Tạo chỉ mục đa cột phù hợp
Tôi tạo một composite index để hỗ trợ đúng theo thứ tự lọc:

```
CREATE INDEX idx_orders_status_created_at_user_id
ON orders (status, created_at, user_id);
```

<div style='margin-bottom:16px'></div>

**Lý do:**
* `status` và `created_at`: phục vụ điều kiện `WHERE`.
* `user_id`: hỗ trợ cho `JOIN` và `GROUP BY`.

<div style='margin-bottom:16px'></div>

**Kết quả sau khi tối**
Chạy lại `EXPLAIN`:

| <small>**id**<small/> | <small>**table**<small/> | <small>**type**<small/> | <small>**key**<small/> | <small>**rows**<small/> | <small>**Extra**<small/> |
|----------------------|----------------------|----------------------|----------------------|----------------------|----------------------|
| <small>1<small/> | <small>orders<small/> | <small>range<small/> | <small>idx_orders_status_created_at_user_id<small/> | <small>105,000<small/> | <small>Using index condition<small/> |
| <small>1<small/> | <small>users<small/> |  <small>eq_ref<small/> | <small>PRIMARY<small/> | <small>1<small/> | <small><small/> |
{: style="width:100%; margin-bottom:16px"}


**Thời gian thực tế:**
* Trước: ~ 30s
* Sau tối ưu: ~ 1.5s

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Một số ưu ý về `EXPLAIN`
* Với MySQL/PostgreSQL, `EXPLAIN` không thực thi truy vấn - chỉ mô phỏng kế hoạch.
* `rows` là ước lượng, không phải con số tuyệt đối, nhưng rất hữu ích.
* Nên kết hợp với actual query time, `ANALYZE`, hoặc `EXPLAIN ANALYZE` (Postgres).

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. Tổng kết
Việc tối ưu SQL không đơn thuần là chuyện cú pháp.
Bạn cần hiểu sâu cách cơ sở dữ liệu vận hành, và `EXPLAIN` chính là "cửa sổ" để nhìn vào nội tạng của một truy vấn.
>Hãy để `EXPLAIN` trở thành thói quen, chứ đừng đợi đến khi truy vấn chậm mới nhớ đến nó.