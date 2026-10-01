---
layout: post
title: Hướng Dẫn Toàn Diện Về Stored Procedure Trong SQL Server
subtitle: Tối ưu hiệu năng và bảo mật trong xử lý dữ liệu với Stored Procedure
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
series: SQL Server
comments: true
---

>**Stored Procedure** là công cụ mạnh mẽ giúp lập trình viên tương tác hiệu quả với hệ quản trị cơ sở dữ liệu, giảm thiểu lỗi, tăng hiệu suất và tăng cường tính bảo mật. Trong bài viết này, chúng ta sẽ tìm hiểu từ cơ bản đến nâng cao về Stored Procedure, bao gồm cú pháp, ví dụ thực tế, ưu nhược điểm và các tình huống sử dụng hiệu quả.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

### Stored Procedure Là Gì?
**Stored Procedure** là một tập hợp các câu lệnh SQL được lưu sẵn trong cơ sở dữ liệu, cho phép gọi ra để thực thi một cách nhanh chóng, giúp đóng gói logic xử lý và tái sử dụng dễ dàng.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

###  Ưu Điểm Của Stored Procedure

<div style='margin-top:24px'></div>

| <small>**Ưu điểm**<small/>            | <small>**Mô tả**<small/>  |
|--------------------------|-------------------------|
| <small> Tái sử dụng được<small/>                 | <small>Viết một lần, gọi nhiều lần ở bất kỳ đâu<small/>                  |
| <small> Bảo mật<small/>                    | <small>Hạn chế quyền truy cập trực tiếp vào bảng dữ liệu<small/>                |
| <small>Hiệu suất cao<small/>          | <small>Được biên dịch sẵn, giảm chi phí phân tích lại câu lệnh<small/>             |
| <small>Tách biệt xử lý<small/>             | <small>Giúp phân chia logic ứng dụng và dữ liệu rõ ràng<small/>                |
| <small> Dễ bảo trì<small/>          | <small>Cập nhật logic xử lý không ảnh hưởng đến client<small/>              |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Nhược Điểm Của Stored Procedure

<div style='margin-top:24px'></div>

| <small>**Nhược điểm**<small/>            | <small>**Mô tả**<small/>  |
|--------------------------|-------------------------|
| <small> Khó kiểm soát phiên bản<small/>                 | <small>Viết một lần, gọi nhiều lần ở bất kỳ đâu<small/>                  |
| <small> Không linh hoạt bằng code phía ứng dụng<small/>                    | <small>Hạn chế quyền truy cập trực tiếp vào bảng dữ liệu<small/>                |
| <small> Gỡ lỗi (debug) khó khăn hơn<small/>          | <small>Được biên dịch sẵn, giảm chi phí phân tích lại câu lệnh<small/>             |
| <small>Có thể gây "thắt cổ chai" nếu quá phức tạp<small/>             | <small>Giúp phân chia logic ứng dụng và dữ liệu rõ ràng<small/>                |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Khi Nào Nên Dùng Stored Procedure?

<div style='margin-top:24px'></div>

| <small>**Trường hợp**<small/>            | <small>**Nên dùng**<small/>  |
|--------------------------|-------------------------|
| <small>Cần xử lý logic phức tạp<small/>                 | <small>Gộp nhiều truy vấn, kiểm tra, tính toán<small/>                  |
| <small>Tác vụ lặp lại nhiều lần<small/>                    | <small>Như tìm kiếm, lọc, thống kê<small/>                |
| <small>Cần kiểm soát quyền truy cập<small/>          | <small>Hạn chế user truy cập trực tiếp bảng<small/>             |
| <small>Tối ưu hiệu suất<small/>             | <small>Với lượng truy vấn lớn, thủ tục được biên dịch trước<small/>                |
| <small>Cần chia sẻ logic xử lý cho nhiều ứng dụng khác nhau<small/>          |              |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Khi Nào Không Nên Dùng Stored Procedure?

<div style='margin-top:24px'></div>

| <small>**Trường hợp**<small/>            | <small>**Không nên dùng**<small/>  |
|--------------------------|-------------------------|
| <small>Logic thay đổi thường xuyên<small/>                 | <small>Dễ gây khó khăn khi cập nhật<small/>                  |
| <small>Tác vụ thử nghiệm nhỏ, đơn giản<small/>                    | <small>Không cần thiết phải tạo stored procedure<small/>                |
| <small>Nhiều vòng lặp và logic động<small/>          | <small>Nên xử lý ở phía ứng dụng sẽ linh hoạt hơn<small/>             |
| <small>Cần debug từng dòng<small/>             | <small>Stored Procedure không thân thiện cho debug từng bước<small/>                |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Cú Pháp Tạo Stored Procedure

<div style="margin:24px 0"></div>

```
create procedure ten_thu_tuc
as
-- nội dung SQL
```

<div style="margin:24px 0"></div>

Gọi thực thi:

```
exec ten_thu_tuc
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Các Trường Hợp Cụ Thể
**Không Truyền Tham Số**
```
create procedure danh_sach_sinh_vien
as
select * from sinh_vien

<!-- Cách gọi -->
exec danh_sach_sinh_vien
```

<div style="margin:32px 0"></div>

**Có Truyền Tham Số**
```
create procedure danh_sach_sinh_vien
@ma_sinh_vien int,
@ma_lop int
as
select * from sinh_vien
where ma_sinh_vien > @ma_sinh_vien
and ma_lop = @ma_lop

<!-- Cách gọi -->
danh_sach_sinh_vien @ma_sinh_vien = 2, @ma_lop = 2
```

<div style="margin:32px 0"></div>

**Truyền Tham Số Với Giá Trị Mặc Định**
```
create procedure them_sinh_vien
@ten_sinh_vien nvarchar(50) = 'ABC'
as
insert into sinh_vien(ten_sinh_vien) values (@ten_sinh_vien)
  
<!-- Cách gọi -->
them_sinh_vien
```

<div style="margin:32px 0"></div>

**Lấy tất cả nếu tham số truyền vào trống**

```
create procedure xem_nhan_vien
@ma_nhan_vien int = null,
@ten_nhan_vien nvarchar(50) = null
as
select * from nhan_vien
where
ten_nhan_vien = case when @ten_nhan_vien is null then ten_nhan_vien
else @ten_nhan_vien end
and
ma_nhan_vien = case when @ma_nhan_vien is null then ma_nhan_vien
else @ma_nhan_vien end

<!-- Cách gọi -->
xem_nhan_vien
<!-- hoặc -->
xem_nhan_vien @ma_nhan_vien = 1
```

<div style="margin:32px 0"></div>

**Chỉ sửa những cột có tham số truyền vào, còn lại giữ nguyên giá trị cũ**

```
create procedure sua_nhan_vien
@ma_nhan_vien int,
@ten_nhan_vien nvarchar(50) = null,
@ngay_sinh date = null,
@ma_cong_ty int = null
as
update nhan_vien
set
ten_nhan_vien = case when @ten_nhan_vien is null or @ten_nhan_vien = '' then ten_nhan_vien
else @ten_nhan_vien end,
ngay_sinh = case when @ngay_sinh is null or @ngay_sinh = '' then ngay_sinh
else @ngay_sinh end,
ma_cong_ty = case when @ma_cong_ty is null or @ma_cong_ty = '' then ma_cong_ty
else @ma_cong_ty end
where
ma_nhan_vien = @ma_nhan_vien

<!-- Cách gọi -->
sua_nhan_vien @ten_nhan_vien = 'ABC', @ma_nhan_vien = 1
```

<div style="margin:32px 0"></div>

**Gọi proc lồng proc**

```
create procedure xem_sinh_vien
as
select * from sinh_vien


create procedure them_sinh_vien
@ten_sinh_vien nvarchar(50),
@ma_lop int = 1
as
begin
insert into sinh_vien
(ten_sinh_vien,ma_lop)
values (@ten_sinh_vien,@ma_lop)
exec xem_sinh_vien
end

<!-- Cách gọi -->
them_sinh_vien @ten_sinh_vien = N'ABCXYZ', @ma_lop = 1
```

<div style="margin:32px 0"></div>

**Xóa proc**

```
drop procedure danh_sach_sinh_vien
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Kết luận 
>**Hãy xem Stored Procedure như một công cụ hỗ trợ đắc lực cho hiệu suất, bảo mật và tổ chức mã nguồn — nhưng đừng "giao trứng cho ác" nếu bạn đang cần sự linh hoạt và thay đổi nhanh chóng trong logic nghiệp vụ.**

Và như mọi công cụ tốt – **dùng đúng nơi, đúng lúc**, bạn sẽ thấy sức mạnh thật sự của nó. 🚀
