---
layout: post
title: Hiểu Tường Tận SQL Function
subtitle: Biến đoạn SQL lặp đi lặp lại thành hàm tái sử dụng chỉ với vài dòng code – bạn đã thử chưa?
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
series: SQL Server
comments: true
---

>Trong hành trình làm việc với cơ sở dữ liệu, hẳn bạn từng gặp những truy vấn phải viết đi viết lại nhiều lần, hoặc những đoạn tính toán phức tạp khiến SQL trở nên dài dòng, khó đọc. Vậy tại sao không “đóng gói” chúng lại?
Đó chính là lý do bạn nên làm quen với **User Defined Function trong SQL** – công cụ nhỏ nhưng có võ, giúp bạn viết SQL hiệu quả hơn gấp nhiều lần.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

### SQL Function là gì?
**Function (hàm)** trong SQL là một đoạn mã do bạn tự định nghĩa, có thể nhận tham số đầu vào và trả về **một giá trị** hoặc **một bảng dữ liệu**. Mục đích chính là **tái sử dụng logic** và **giữ cho code SQL ngắn gọn, dễ hiểu**.

Không giống như Stored Procedure, Function không thay đổi dữ liệu mà chỉ xử lý và trả về kết quả. Điều này giúp bạn dễ dàng nhúng function vào bất kỳ truy vấn nào mà không lo phá vỡ logic hiện có.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Tác dụng của Function trong SQL
**Function** là một khối lệnh có thể tái sử dụng và trả về một giá trị duy nhất. Chúng được dùng để:

* Truy vấn dữ liệu một cách linh hoạt

* Dễ dàng kết hợp trong các câu lệnh SELECT

* Tăng khả năng tái sử dụng logic xử lý

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Ưu điểm
* 📌 Có thể nhúng trực tiếp vào câu lệnh `SELECT`, `JOIN`, `WHERE`, giúp truy vấn ngắn gọn và dễ đọc.

* 📌 Tăng khả năng **tái sử dụng logic xử lý** trong nhiều truy vấn khác nhau.

* 📌 Dễ kiểm thử và gỡ lỗi hơn do chỉ tập trung vào logic xử lý đơn giá trị hoặc một tập dữ liệu nhỏ.

* 📌 Tốc độ thực thi cao hơn trong các truy vấn đơn giản.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Nhược điểm 
* ❌ **Không thể thực hiện các thao tác thay đổi dữ liệu** (`INSERT`, `UPDATE`, `DELETE`).

* ❌ Không hỗ trợ `TRY...CATCH` để xử lý lỗi.

* ❌ Không tạo được bảng tạm, không sử dụng transaction.

* ❌ Không thể gọi đến stored procedure khác.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Nên dùng Function khi nào?
* **Cần xử lý logic đơn giản, lặp đi lặp lại:** Ví dụ: kiểm tra số chẵn/lẻ, tính tuổi từ ngày sinh, tính phần trăm...
* **Cần tái sử dụng truy vấn đọc dữ liệu:** Đặc biệt là khi truy vấn theo `id`, `code`, hay thực hiện lookup nhỏ.
* **Muốn tách logic xử lý khỏi truy vấn chính:** Giúp câu lệnh SQL chính sạch sẽ, dễ đọc, dễ bảo trì hơn.
* **Kết hợp dễ dàng trong** `SELECT`**,** `WHERE`**,** `JOIN`**:** Function có thể chèn vào như một phần tử trong truy vấn, giống như gọi một hàm trong ngôn ngữ lập trình.
* **Không cần thao tác ghi dữ liệu:** Vì Function không hỗ trợ các câu lệnh như `INSERT`, `UPDATE`, `DELETE`.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

###  Không nên dùng Function khi nào?
* **Cần thay đổi dữ liệu:** Function không cho phép thực hiện các thao tác `INSERT`, `UPDATE`, `DELETE`, `MERGE`...
* **Cần xử lý logic phức tạp hoặc nhiều bước:** Function không hỗ trợ xử lý lỗi (`try...catch`), không có vòng lặp hay điều kiện nâng cao như Procedure.
* **Cần kiểm soát Transaction:** Function không thể dùng `BEGIN TRAN...COMMIT/ROLLBACK`. Nếu có lỗi giữa chừng thì dễ “gãy” mà không rollback được.
* **Cần gọi Stored Procedure khác:** Function không thể gọi đến Procedure hoặc thực hiện các thao tác “nặng” về logic.
* **Hiệu năng cực kỳ quan trọng:** Dù Function tiện, nhưng gọi hàng loạt function trong truy vấn lớn có thể làm chậm hệ thống nếu không tối ưu tốt.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Cú pháp mẫu
**Hàm trả về 1 giá trị (Scalar Function)**
```
create function cong(@a int, @b int)
returns int
as
begin
  return @a + @b
end

-- Cách gọi:
select dbo.cong(1, 2)
```

<div style="margin:32px 0"></div>

**Hàm trả về bảng (Table-valued Function)**
```
create function xem_sinh_vien(@ma_sinh_vien int)
returns table
as
  return (
    select * from sinh_vien
    where ma_sinh_vien = @ma_sinh_vien
  )

-- Gọi:
select * from dbo.xem_sinh_vien(1)
```

<div style="margin:32px 0"></div>

**Hàm có logic điều kiện (CASE)**
```
create function chia_het(@ma_sinh_vien int, @so_chia int)
returns int
as
begin
  return case
    when @so_chia = 0 then 0
    when @ma_sinh_vien % @so_chia = 0 then @ma_sinh_vien
    else 0
  end
end

-- Gọi hàm:
select * from sinh_vien
where ma_sinh_vien = dbo.chia_het(ma_sinh_vien, 4)
```

<div style="margin:32px 0"></div>

**Xoá Function**
```
drop function chia_het
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### So sánh User Defined Function vs Stored Procedure

<div style='margin-top:24px'></div>

| <small>**Tiêu chí**<small/>                        | <small>**User Defined Function**<small/>                                      | <small>**Stored Procedure**<small/>                                            |
|------------------------------------|----------------------------------------------------------------|-----------------------------------------------------------------|
| <small>**Giá trị trả về**<small/>                 | <small>Phải trả về **1 giá trị**<small/>                                      | <small>Không bắt buộc trả về giá trị<small/>                                   |
| <small>**Loại câu lệnh hỗ trợ**<small/>           | <small>Chỉ dùng được `SELECT`, không dùng `INSERT`, `UPDATE`, `DELETE`<small/>| <small>Dùng được cả `DML`, `DDL` (`Insert`, `Update`, `Delete`...)<small/>          |
| <small>**Thay đổi tham số**<small/>               | <small>Không thay đổi giá trị tham số<small/>                                 | <small>Có thể thay đổi<small/>                                                |
| <small>**Xử lý lỗi (try-catch)**<small/>          | <small>Không hỗ trợ<small/>                                                   | <small>Có hỗ trợ đầy đủ <small/>                                              |
| <small>**Transaction**<small/>                    | <small>Không dùng Transaction<small/>                                         | <small>Có thể dùng Transaction<small/>                                        |
| <small>**Tạo bảng tạm (Temporary Table)**<small/> | <small>Không hỗ trợ <small/>                                                  | <small>Có thể tạo bảng tạm thông thường <small/>                              |
| <small>**Gọi từ SELECT**<small/>                  | <small>Có thể gọi trực tiếp trong `SELECT`<small/>                            | <small>Không thể gọi từ `SELECT`, `WHERE`, `HAVING`<small/>                   |
| <small>**Gọi Procedure khác**<small/>             | <small>Không gọi Procedure khác<small/>                                       | <small>Có thể gọi cả Procedure và Function khác<small/>                       |
| <small>**Dùng trong JOIN**<small/>                | <small>Có thể dùng<small/>                                                    | <small>Không dùng được trực tiếp<small/>                                      |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Khi nào nên dùng Function và khi nào dùng Stored Procedure?
**Nên dùng Function khi:**
* Cần thực hiện tính toán hoặc lọc dữ liệu nhỏ, có thể lồng vào câu truy vấn.

* Logic xử lý đơn giản, không cần xử lý lỗi hoặc thay đổi dữ liệu.

* Cần tái sử dụng nhiều lần cùng một logic xử lý trong nhiều truy vấn khác nhau.

**Nên dùng Stored Procedure khi:**
* Cần thao tác dữ liệu (`insert`/`update`/`delete`).

* Cần thực hiện logic phức tạp, có thể kết hợp nhiều lệnh SQL.

* Muốn kiểm soát lỗi, transaction, và sử dụng bảng tạm.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Kết luận
**SQL Function** là vũ khí lợi hại cho lập trình viên CSDL, nhưng chỉ **khi bạn dùng đúng chỗ**. Hãy xem Function như "dao cạo": rất bén nhưng không phải dùng cho tất cả mọi việc. Biết rõ giới hạn và thế mạnh sẽ giúp bạn viết những truy vấn **gọn gàng, nhanh gọn và chuyên nghiệp hơn.**