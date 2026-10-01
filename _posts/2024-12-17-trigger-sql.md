---
layout: post
title: Toàn Tập Về Trigger Trong SQL Server
subtitle: Tự động hóa logic nghiệp vụ – Duy trì toàn vẹn dữ liệu – Tối ưu quy trình xử lý
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
series: SQL Server
comments: true
---

>**Trigger** - một trong những công cụ "bí mật quyền lực" trong SQL Server giúp bạn tự động hóa xử lý nghiệp vụ, bảo vệ tính toàn vẹn dữ liệu và đảm bảo các quy tắc kinh doanh được tuân thủ chặt chẽ.
Nếu bạn đang làm việc trong hệ thống quản lý sinh viên, quản lý bán hàng, hay bất kỳ hệ thống nào có liên quan đến dữ liệu nhiều bảng, Trigger là công cụ bạn không thể bỏ qua!

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

### Trigger Là Gì?
**Trigger** là một thủ tục được kích hoạt tự động khi có một sự kiện cụ thể diễn ra trên bảng dữ liệu như `INSERT`, `UPDATE`, hoặc `DELETE`. Ví dụ, bạn có thể tạo một trigger để đảm bảo rằng khi xóa một lớp học, toàn bộ sinh viên thuộc lớp đó cũng được xử lý phù hợp trước khi xóa — điều này giúp **duy trì tính toàn vẹn dữ liệu.**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Tác Dụng Của Trigger

* Tự động kiểm tra và xử lý dữ liệu trước hoặc sau thao tác CSDL

* Tự động ghi log lịch sử thao tác người dùng

* Đảm bảo ràng buộc logic nghiệp vụ mà các khóa (foreign key, constraint) không xử lý được

* Hạn chế lỗi phát sinh từ thao tác thủ công của người dùng

* Thực thi nhiều thao tác đồng thời khi một hành động diễn ra

📌 _Ví dụ: Trước khi xóa một lớp học, bạn có thể dùng trigger để kiểm tra xem còn sinh viên nào trong lớp không. Nếu có, yêu cầu phải xử lý sinh viên đó trước mới cho phép xóa lớp._

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Ưu Điểm
* **Tự động hóa logic nghiệp vụ**, tiết kiệm thời gian lập trình

* **Tăng cường bảo mật và toàn vẹn dữ liệu**

* **Giảm rủi ro lỗi do người dùng thao tác sai**

* **Gắn liền với bảng**, không cần sửa code ứng dụng nếu logic thay đổi

* **Ghi log & kiểm soát truy cập dễ dàng**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Nhược Điểm
* **Khó debug:** Trigger chạy "ngầm", nên khó phát hiện lỗi nếu không kiểm tra kỹ

* **Khó bảo trì:** Logic bị ẩn trong database, dễ quên hoặc xung đột với phần mềm

* **Không phù hợp với nghiệp vụ phức tạp nhiều điều kiện**

* **Có thể ảnh hưởng hiệu năng** nếu lạm dụng (đặc biệt là nested trigger)

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Các Loại Trigger Trong SQL Server

<div style='margin-top:24px'></div>

| <small>**Loại Trigger**<small/>     | <small>**Thời Điểm Kích Hoạt**<small/>            | <small>**Mô Tả Ngắn Gọn**<small/>                                                 |
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>**AFTER Trigger**<small/>     | <small>Sau khi thao tác thành công<small/>         | <small>Dùng phổ biến để ghi log, hiển thị thông báo, gửi email, v.v.<small/>       |
| <small>**INSTEAD OF Trigger**<small/>| <small>Thay thế hoàn toàn thao tác<small/>         | <small>Dùng để kiểm tra điều kiện trước khi thực hiện<small/>                      |
| <small>**LOGIN Trigger**<small/>     | <small>Khi người dùng đăng nhập<small/>            | <small>Quản lý bảo mật, theo dõi đăng nhập, kiểm tra IP, v.v.<small/>             |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Câu lệnh mẫu
**1. AFTER Trigger – Thêm Sinh Viên**
```
create trigger trigger_them_sinh_vien
on sinh_vien
after insert
as
begin
    print N'Đã thêm thành công'
end

<!-- Cách gọi -->
insert into sinh_vien(ten_sinh_vien)
values ('XYZ')

<!-- Kết quả -->
Đã thêm thành công
```
<div style="margin:32px 0"></div>

**2. INSTEAD OF Trigger – Kiểm Tra Mã Lớp**
```
create trigger them_sinh_vien
on sinh_vien
instead of insert
as
begin
    select * from inserted

    declare @ma_lop int = (select ma_lop from inserted)
    declare @dem int = (select count(*) from lop where ma_lop = @ma_lop)

    if @dem = 0
        insert into lop(ma_lop, ten_lop) values (@ma_lop, N'Mặc định')

    insert into sinh_vien 
    select * from inserted
end

<!-- Cách gọi -->
insert into sinh_vien(ma_sinh_vien,ten_sinh_vien,ma_lop)
values (10,'XYZ',4)
```
<div style="margin:24px 0"></div>

**Giải thích:**

* Kiểm tra nếu ma_lop chưa tồn tại trong bảng lop

* Nếu chưa có, hệ thống sẽ tự động thêm lớp mới với tên "Mặc định"

* Sau đó thêm sinh viên như bình thường

<div style="margin:32px 0"></div>

**3. Xóa Trigger**
```
drop trigger trigger_them_sinh_vien
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Kết Luận
**Trigger** là một công cụ cực kỳ hữu ích trong SQL Server nếu bạn biết cách khai thác. Trong bài viết này, chúng ta đã khám phá cách sử dụng `AFTER` và `INSTEAD OF` trigger để xử lý các nghiệp vụ quản lý sinh viên như thêm sinh viên hoặc tự động tạo lớp học.

👉 Nếu bạn thấy bài viết hữu ích, đừng quên chia sẻ hoặc lưu lại để áp dụng trong các dự án SQL thực tế nhé!