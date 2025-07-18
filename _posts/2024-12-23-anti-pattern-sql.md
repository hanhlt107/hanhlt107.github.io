---
layout: post
title: Anti-pattern trong SQL - Bạn có đang đi vào vết xe đổ?
subtitle: Viết SQL thì dễ, nhưng viết đúng – nhanh – dễ bảo trì thì không. Cùng điểm mặt những lỗi mà developer nào cũng từng dính.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

>**Code SQL chạy được không có nghĩa là tốt**

Trong quá trình làm việc với cơ sở dữ liệu, có rất nhiều "thói quen xấu" mà chúng ta - dù mới học hay đã đi làm - vô tình mắc phải. Những anti-pattern này thường không gây lỗi ngay, nhưng về lâu dài, chúng có thể khiến hệ thống chậm chạp, khó maintain, hoặc dễ gây lỗi nghiêm trọng.  
Trong vài viết này, chúng ta sẽ cùng điểm qua những anti-pattern SQL phổ biến, vì sao chúng nguy hiểm, và cách thay thế phù hợp hơn.


### 1. `SELECT *` - Khi bạn mời cả nhà hàng chỉ để uống ly nước lọc
**Anti-pattern:**  

```
SELECT * FROM users;
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* Tốn băng thông không cần thiết, đặc biệt khi bảng có nhiều cột.
* Làm hệ thống backend hoặc frontend phụ thuộc vào thứ tự/tên cột - dễ gãy nếu schema đổi.
* Khó optimize query khi làm việc với `JOIN`, `GROUP BY`, hay index.

**Cách tốt hơn:**

```
SELECT id, name, email 
FROM users;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. `NOT IN (NULL)` - Tưởng thông minh mà lại "quê độ"
**Anti-pattern:**

```
SELECT * FROM orders
WHERE status NOT IN (NULL);
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* `NULL` trong `NOT IN` khiến kết quả trả về rỗng - không như bạn nghĩ.
* Đây là lỗi logic âm thầm cực kỳ dễ lặp lại.

**Cách tốt hơn:**

```
SELECT * FROM orders
WHERE status IS NOT NULL;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Quên tạo Index - Để database "chạy bộ" thay vì "đi xe"
**Anti - pattern:**

```
SELECT * FROM orders 
WHERE user_id = 123;
-- Nhưng cột user_id chưa có index
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* Khi bảng lớn, truy vấn sẽ quét toàn bộ bảng (Full Table Scan)
* Làm hệ thống chậm kinh khủng khi có hàng triệu bản ghi.

**Cách tốt hơn:**

```
-- Thêm index:
CREATE INDEX idx_orders_user_id 
ON orders(user_id);
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. `JOIN` không điều kiện - Bạn vừa tạo một "quái vật Cartesian"
**Anti - pattern:**

```
SELECT * FROM products p 
JOIN categories c;
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* Nếu `p` có 1000 dòng và `c` có 10 dòng -> bạn nhận 10.000 dòng!
* Không có điều kiện `ON` sẽ tạo ra Cartesian product, gần như không bao giờ là điều bạn muốn.

**Cách tốt hơn:**

```
SELECT * FROM products p
JOIN categories c ON p.category_id = c.id;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Dùng `HAVING` thay cho `WHERE` - Xài búa đập muỗi
**Anti - pattern:**

```
SELECT name FROM users
GROUP BY name
HAVING name LIKE 'A%';
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* `HAVING` chỉ nên dùng sau khi `GROUP BY`, để lọc kết quả đã nhóm.
* Dùng `HAVING` như trên làm truy vấn tốn công nhóm rồi mới lọc, rất không tối ưu.

**Cách tốt hơn:**

```
SELECT name FROM users
WHERE name LIKE 'A%'
GROUP BY name;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. Quá phụ thuộc vào ORMs - Quên mất SQL thuần là gì
**Anti - pattern:**

```
// Sequelize, Prisma... bạn viết code dễ đọc, nhưng không biết nó sinh ra SQL gì
const users = await db.user.findMany({ where: { email: { contains: 'gmail' } } });
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* Dễ gây ra các vẫn đề hiệu năng như N + 1 query, truy vẫn thừa, không tận dụng index...
* Developer không hiểu SQL thật sự đang làm gì.

**Cách tốt hơn:**
* Hiểu SQL do ORM sinh ra (enable logging).
* Khi cần, viết raw SQL cho truy vấn phức tạp.
* Tránh `include` nhiều tầng nếu không cần thiết.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 7. Không kiểm soát transaction - Dữ liệu "bay màu" lúc nào không hay
**Anti - pattern:**

```
UPDATE accounts SET balance = balance - 100 
WHERE id = 1;

UPDATE accounts SET balance = balance + 100 
WHERE id = 2;
-- Không dùng transaction!
```

<div style='margin-bottom:16px'></div>

**Vấn đề:**
* Nếu giữa 2 lệnh này hệ thống crash -> dữ liệu mất đồng bộ.
* Vi phạm tính toàn vẹn dữ liệu.

**Cách tốt hơn:**

```
BEGIN;

UPDATE accounts SET balance = balance - 100 
WHERE id = 1;

UPDATE accounts SET balance = balance + 100 
WHERE id = 2;

COMMIT;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 8. Kết luận
SQl tường là dễ, nhưng viết đúng -viết bền - viết nhanh thì không dễ. Những anti-pattern trên là "vết xe đổ" mà rất nhiều developer từng mắc. Biết sớm, tránh sớm - bạn sẽ tiết kiệm được rất nhiều giờ debugging và tối ưu vè sau.

>Nếu bạn thấy mình từng rơi vào 1 trong các trường hợp trên, đừng lo - ai cũng từng như vậy. Quan trọng là học được gì và cải thiện từng ngày.