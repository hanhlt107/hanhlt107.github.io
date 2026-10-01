---
layout: post
title: Tổng Quan về Các Ràng Buộc (Constraints) trong SQL – Cẩm Nang Cần Thiết Cho Người Mới
subtitle: 🔒 Hiểu rõ các ràng buộc trong SQL vững chắc và hiệu quả.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
series: SQL Server
comments: true
---

### ✨ Giới thiệu
**SQL (Structured Query Language)** là ngôn ngữ tiêu chuẩn dùng để thao tác và quản lý cơ sở dữ liệu quan hệ (RDBMS). Một trong những khái niệm quan trọng khi thiết kế cơ sở dữ liệu chính là **ràng buộc (constraints)** – công cụ giúp đảm bảo tính toàn vẹn và hợp lệ của dữ liệu.

Trong bài viết này, chúng ta sẽ cùng khám phá:

* Các loại **ràng buộc dữ liệu (constraints)** phổ biến trong SQL.

* Các **kiểu dữ liệu thường dùng.**

* Những lưu ý khi làm việc với **SQL Server.**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 📌 Constraints là gì?
**Constraints** là những quy tắc được áp dụng lên cột (hoặc nhiều cột) trong bảng, nhằm **giới hạn giá trị dữ liệu** được phép nhập vào. Mục tiêu là đảm bảo rằng dữ liệu trong bảng luôn **đúng, hợp lệ, và nhất quán**.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🧭 Bảng Tổng Hợp Ràng Buộc và Kiểu Dữ Liệu trong SQL

<div style='margin-top:24px'></div>

| <small>**Ràng buộc / Kiểu dữ liệu**</small> | <small>**Tên**</small>           | <small>**Ý nghĩa**</small>                                                 | <small>**Trong SQL Server**</small>                                  |
|-----------------------------|-------------------|-------------------------------------------------------------|--------------------------------------------------------|
| <small>`UNIQUE`</small>                    | <small>Duy nhất</small>          | <small>Không trùng lặp, được phép null</small>                            | <small>✔️ </small>                                                    |
| <small>`PRIMARY KEY`</small>              | <small>Khóa chính</small>        | <small>Không trùng, không null, định danh duy nhất mỗi dòng</small>       | <small>✔️</small>                                                     |
| <small>`FOREIGN KEY`</small>              | <small>Khóa ngoại</small>        | <small>Kết nối với khóa chính bảng khác, cho phép null</small>            | <small>✔️ </small>                                                   |
| <small>`NOT NULL`</small>                 | <small>Khác null</small>         | <small>Không được để trống dữ liệu</small>                                | <small>✔️</small>                                                     |
| <small>`UNSIGNED`</small>                 | <small>Không dấu âm</small>      | <small>Không được âm (số dương)<</small>                                    | <small>❌ Không hỗ trợ trong SQL Server</small>                      |
| <small>`INT`</small>                      | <small>Số nguyên</small>         | <small>VD: 10, 20, 30</small>                                               | <small>✔️</small>                                                     |
| <small>`FLOAT`</small>                    | <small>Số thực</small>           | <small>VD: 1.5, 2.9</small>                                                 | <small>✔️</small>                                                     |
| <small>`VARCHAR(n)`</small>               | <small>Chuỗi động</small>        | <small>Tối đa n ký tự; tự động co giãn bộ nhớ </small>                     | <small>✔️ `NVARCHAR(n)` cho chuỗi có dấu</small>                     |
| <small>`CHAR(n)`</small>                  | <small>Chuỗi cố định</small>     | <small>Cố định n ký tự, chiếm đủ bộ nhớ</small>                            | <small>✔️ `NCHAR(n)` cho chuỗi có dấu</small>                        |
| <small>`BOOLEAN`</small>                  | <small>Đúng/Sai</small>          | <small>0 hoặc 1</small>                                                     | <small>✔️ `BIT` thay cho `BOOLEAN`</small>                          |
| <small>`TEXT`</small>                     | <small>Chuỗi dài</small>         | <small>Không giới hạn ký tự, dùng cho văn bản dài</small>                  | <small>✔️ `NTEXT` cho chuỗi có dấu</small>                          |
| <small>`DATE`</small>                     | <small>Ngày</small>              | <small>VD: `2025-04-08`</small>                                             | <small>✔️</small>                                                     |
| <small>`DATETIME`</small>                 | <small>Ngày + giờ</small>        | <small>VD: `2025-04-08 23:59:59`</small>                                    | <small>✔️</small>                                                     |
| <small>`TIME`</small>                     | <small>Giờ:phút:giây</small>     | <small>VD: `23:59:59`</small>                                               | <small>✔️</small>                                                     |
| <small>`AUTO_INCREMENT`</small>           | <small>Tự động tăng</small>      | <small>Tăng tự động mỗi khi thêm dòng</small>                             | <small>✔️ Dùng `IDENTITY` trong SQL Server </small>                  |
| <small>`CHECK`</small>                    | <small>Kiểm tra điều kiện</small>| <small>Giới hạn giá trị hợp lệ</small>                                      | <small>✔️</small>                                                     |
| <small>`DEFAULT`</small>                  | <small>Giá trị mặc định</small>  | <small>Gán giá trị nếu không nhập</small>                                  | <small>✔️</small>                                                     |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🔑 Các Ràng Buộc Phổ Biến Trong SQL – Giải Thích Chi Tiết
##### 1. `PRIMARY KEY` – Khóa chính
* Dùng để xác định duy nhất mỗi dòng.

* Không được trùng và không được NULL.

```
CREATE TABLE SinhVien (
    ma_sinh_vien INT PRIMARY KEY,
    ho_ten NVARCHAR(100)
);
```
<div style='margin-bottom:32px'></div>

##### 2. `UNIQUE` – Duy nhất
* Đảm bảo không có giá trị trùng lặp.

* Có thể dùng cho cột chứa NULL.

```
CREATE TABLE NhanVien (
    ma_nv INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);
```
<div style='margin-bottom:32px'></div>

##### 3. `FOREIGN KEY` – Khóa ngoại
* Tạo mối quan hệ giữa hai bảng.

* Giúp đảm bảo dữ liệu liên kết hợp lệ.

```
CREATE TABLE Lop (
    ma_lop INT PRIMARY KEY,
    ten_lop NVARCHAR(50)
);

CREATE TABLE SinhVien (
    ma_sinh_vien INT PRIMARY KEY,
    ma_lop INT,
    FOREIGN KEY (ma_lop) REFERENCES Lop(ma_lop)
);
```
<div style='margin-bottom:32px'></div>

##### 4. `NOT NULL` – Không được null

<div style='margin-top:16px'></div>

```
CREATE TABLE DonHang (
    ma_don INT PRIMARY KEY,
    ngay_dat DATE NOT NULL
);
```  
<div style='margin-bottom:32px'></div>

##### 5. `CHECK` – Kiểm tra điều kiện
* Dùng để giới hạn giá trị được nhập vào.

```
CREATE TABLE Diem (
    ma_sv INT,
    diem FLOAT CHECK (diem >= 0 AND diem <= 10)
);

CREATE TABLE SinhVien (
    ten_sinh_vien NVARCHAR(50) CHECK (LEN(ten_sinh_vien) > 5)
);
```
<div style='margin-bottom:32px'></div>

##### 6. `DEFAULT` – Giá trị mặc định

<div style='margin-top:16px'></div>

```
CREATE TABLE Diem (
    ma_sinh_vien INT PRIMARY KEY,
    diem FLOAT DEFAULT 5
);

-- Chèn dữ liệu không có điểm
INSERT INTO Diem (ma_sinh_vien) VALUES (1); 
-- => điểm = 5
```
<div style='margin-bottom:32px'></div>

##### 7. `AUTO_INCREMENT` (MySQL) / `IDENTITY` (SQL Server)

<div style='margin-top:16px'></div>

```
CREATE TABLE HoaDon (
    ma_hd INT PRIMARY KEY IDENTITY(1,1),
    ngay_lap DATE
);
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 📚 Lưu ý khi dùng SQL Server

<div style='margin-top:24px'></div>

| <small>**Tính năng**<small/>            | <small>**Tên gọi SQL Server**<small/>  |
|--------------------------|-------------------------|
| <small>`BOOLEAN`<small/>                 | <small>`BIT`<small/>                  |
| <small>`TEXT`<small/>                    | <small>`NTEXT`<small/>                |
| <small>`VARCHAR` có dấu<small/>          | <small>`NVARCHAR`<small/>             |
| <small>`CHAR` có dấu<small/>             | <small>`NCHAR` <small/>                |
| <small>`AUTO_INCREMENT`<small/>          | <small>`IDENTITY`<small/>              |
| <small>Không hỗ trợ `UNSIGNED`<small/>  | <small>❌</small>                       |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🧠 Kết luận
Việc hiểu rõ **constraints và kiểu dữ liệu** không chỉ giúp bạn viết được cấu trúc bảng vững chắc, mà còn **ngăn chặn sai sót dữ liệu ngay từ đầu**. Đây là bước không thể thiếu trong bất kỳ hệ thống quản lý cơ sở dữ liệu nào.
>💡 _Hãy thực hành bằng cách tạo bảng có đầy đủ ràng buộc và thử chèn dữ liệu để kiểm chứng!_