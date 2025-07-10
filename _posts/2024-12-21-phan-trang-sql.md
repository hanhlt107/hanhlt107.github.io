---
layout: post
title: Phân Trang Dữ Liệu Trong SQL
subtitle: Phân Trang Dữ Liệu Trong SQL - LIMIT, OFFSET và Những Vấn Đề Tiềm Ẩn
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

Khi xây dựng các ứng dụng web có hiẻn thị danh sách dữ liệu (sản phẩm, bài viết, bình luận,... ), phân trang (pagination) là kỹ thuật thiết yếu giúp:  
* Tránh việc tải quá nhiều dữ liệu gây nặng trang.
* Tăng tốc độ phản hồi của hệ thống.
* Cải thiện trải nghiệm người dùng.

Trong SQL, `LIMIT` và `OFFSET` là hai công cụ phổ biến để phân trang, Tuy nhiên, nếu không dùng đúng cách, chúng có thẻ dẫn đến **hiệu suất kém** hoặc **dữ liệu sai lệch**.

### 1. Cách dùng `LIMIT` và `OFFSET`
Giả sử bạn có bảng `posts` với hàng nghìn bài viết. Câu truy vấn sau sẽ lấy 10 bài viết đầu tiên:
 
```
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 10;
```

<div style='margin-bottom:16px'></div>

Để lấy từ bài thứ 11 đến 20:

```
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 10 OFFSET 10;
```

<div style='margin-bottom:16px'></div>

* `LIMIT`: số lượng bản ghi cần lấy.
* `OFFSET`: Bỏ qua bao nhiêu bản ghi đầu tiên.

**Công thức phổ biến:**

```
SELECT * FROM table_name
ORDER BY some_column
LIMIT page_size OFFSET (page_number - 1) * page_size;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Vấn đề tiềm ẩn với `OFFSET`
**Hiệu suất kém ở trang sau**  
Với `OFFSET` lớn, database *vẫn phải đọc qua các dòng bị bỏ qua*, rồi mới trả về dữ liệu:

```
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 10 OFFSET 10000;
```

<div style='margin-bottom:16px'></div>

Câu này buộc DB phải duyệt 10.000 bản ghi đầu dù chỉ cần lấy 10 dòng cuối. Điều này khiến **hiệu suất giảm nghiêm trọng** khi dữ liệu lớn.

**Dữ liệu bị "Trôi" khi có thêm/sửa**  
Ví dụ bạn đang ở trang 3 (`OFFSET 20 LIMIT 10`), nhưng trong lúc đó có người thêm bài mới vào trang 1. Lúc bạn bấm sang trang 3, dữ liệu sẽ bị lệch, có thể thiếu hoặc trùng bài.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Giải pháp tốt hơn: Phân trang dựa trên "Con Trỏ"  
Thay vì `OFFSET`, bạn có thể phân trang dựa trên giá trị khoá chính hoặc cột có thứ tự tăng dần (thường là `id` hoặc `created_id`).  
Ví dụ: lấy 10 bài mới nhất sau bài cuối bạn đã có (`last_id = 105`):

```
SELECT * FROM posts
WHERE id < 105
ORDER BY id DESC
LIMIT 10;
```

<div style='margin-bottom:16px'></div>

**Ưu điểm:**  
* Nhanh hơn nhiều vì dùng chỉ số thay vì duyệt bỏ dữ liệu.
* Ổn định hơn, tránh dữ liệu bị trôi.

*-> Kỹ thuật này thường gọi là "**keyset paginstion**"*

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Khi nào nên dùng `OFFSET`
* Khi bạn thực sự cần nhảy tới một trang cụ thể (via dụ: trang 100).
* Khi dữ liệu ít (chỉ vài trăm dòng) và tốc độ không phải vấn đề lớn.

Trong các trường hợp khác, hãy **ưu tiên dùng phân trang dạng con trỏ** để tăng tốc và độ ổn định.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Gợi ý khi xây API phân trang
Khi xây dựng api trả dữ liệu phân trang, bạn nên:

| <small>**Thuộc tính**<small/> | <small>**Dùng OFFSET**<small/> | <small>**Dùng Con trỏ (id, timestamp)**<small/> |
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>Dễ hiểu<small/> | <small>OK<small/> | <small>Cần thêm logic<small/> | 
| <small>Truy cập trang cụ thể<small/> | <small>OK<small/> | <small>Khó nhảy trang bất kỳ<small/> |
| <small>Hiệu suất tốt<small/> | <small>Kém ở trang sâu<small/> | <small>OK<small/> | 
| <small>Tránh dữ liệu bị trôi<small/> | <small>X<small/> | <small>OK<small/> |
{: style="width:100%; margin-bottom:16px"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. Kết luận
Phân trang dữ liệu là bước quan trọng trong việc tối ưu hiệu suất và trải nghiệm người dùng. Dưới đây là tóm tắt: 
* Dùng `LIMIT` + `OFFSET` cho dữ liệu nhỏ, dễ triển khai.
* Dùng keyset pagination (con trỏ) cho dữ liệu lớn hoặc yêu cầu tốc độ cao.
* Tránh dùng `OFFSET` với số lớn nếu không thật cần thiết

Nếu bạn đang xây dựng web dùng SQL, hy vọng bài viết này giúp bạn chọn giải pháp phân trang phù hợp, tránh các lỗi tiềm ẩn và tăng hiệu quả cho ứng dụng của mình.




