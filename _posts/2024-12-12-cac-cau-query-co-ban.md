---
layout: post
title:  Những Câu Lệnh SQL Cơ Bản Mà Mọi Lập Trình Viên Cần Biết
subtitle: 🧠 Làm chủ cơ sở dữ liệu nhanh chóng với các câu query cơ bản
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
series: SQL Server
comments: true
---

>***Dành cho bạn mới bắt đầu học SQL hoặc đang luyện tập thao tác với cơ sở dữ liệu, bài viết này sẽ giúp bạn hệ thống lại kiến thức với các ví dụ cụ thể và dễ hiểu.***

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

### 1. Tạo Database (`CREATE DATABASE`)
_Tạo database_ `quan_ly_nhan_su`
```
CREATE DATABASE quan_ly_nhan_su;
use quan_ly_nhan_su
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Tạo Bảng (`CREATE TABLE`)
_Tạo bảng_ `nhan_vien`
```
CREATE TABLE nhan_vien (
  ma INT AUTO_INCREMENT,
  ten VARCHAR(50),
  PRIMARY KEY(ma)
);
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Thêm Dữ Liệu (`INSERT INTO`)
_TH1: Ghi đầy đủ cả tên cột (bao gồm cả_ `AUTO_INCREMENT`_)_
```
INSERT INTO nhan_vien (ma, ten) VALUES (1, 'abc');
```
<div style='margin-bottom:24px'></div>

_TH2: Chỉ truyền cột không tự tăng (phổ biến nhất)_
```
INSERT INTO nhan_vien (ten) VALUES ('abc');
```
<div style='margin-bottom:24px'></div>

_TH3: Không ghi tên cột, truyền đầy đủ giá trị_
```
INSERT INTO nhan_vien VALUES (2, 'abc');
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Truy Vấn Dữ Liệu (`SELECT`)
_Lấy toàn bộ dữ liệu:_
```
SELECT * FROM nhan_vien;
```
<div style='margin-bottom:24px'></div>
_Lấy riêng cột_ `ten`:
```
SELECT ten FROM nhan_vien;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Cập Nhật Dữ Liệu (`UPDATE`)
<div style='margin-top:16px'></div>
```
UPDATE nhan_vien
SET ten = 'xyz'
WHERE ma = 1;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. ❌ Xoá Dữ Liệu (`DELETE`)
<div style='margin-top:16px'></div>
```
DELETE FROM nhan_vien
WHERE ma = 2;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 7. Thay Đổi Cấu Trúc Bảng (`ALTER TABLE`)
_Đổi kiểu dữ liệu của cột_ `ten` _từ_ `varchar` _sang_ `int`:
```
ALTER TABLE nhan_vien
MODIFY COLUMN ten INT;
```
<div style='margin-bottom:24px'></div>
_Xoá cột_ `ten`:
```
ALTER TABLE nhan_vien
DROP COLUMN ten;
```
<div style='margin-bottom:24px'></div>
_Thêm cột_ `tuoi`:
```
ALTER TABLE nhan_vien
ADD COLUMN tuoi INT;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 8. Khoá Chính & Khoá Ngoại
_Tạo bảng_ `lop`:
```
CREATE TABLE `lop` (
  ma INT AUTO_INCREMENT,
  ten VARCHAR(50),
  PRIMARY KEY (ma)
);
```
<div style='margin-bottom:24px'></div>
_Tạo bảng_ `sinh_vien` _có khoá ngoại tới_ `lop`:
```
CREATE TABLE sinh_vien (
  ma INT AUTO_INCREMENT,
  ten VARCHAR(50),
  ma_lop INT,
  FOREIGN KEY (ma_lop) REFERENCES lop(ma),
  PRIMARY KEY (ma)
);
```
<div style='margin-bottom:24px'></div>
_Tạo bảng_ `diem` _với khoá chính gồm 2 cột:_
```
CREATE TABLE diem (
  ma_sinh_vien INT,
  ma_mon_hoc INT,
  diem FLOAT,
  FOREIGN KEY (ma_sinh_vien) REFERENCES sinh_vien(ma),
  FOREIGN KEY (ma_mon_hoc) REFERENCES mon_hoc(ma),
  PRIMARY KEY (ma_sinh_vien, ma_mon_hoc)
);
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 9. JOIN – Nối Bảng
_Lấy tất cả điểm của sinh viên:_
```
SELECT sinh_vien.ten, mon_hoc.ten, diem
FROM diem
INNER JOIN sinh_vien ON diem.ma_sinh_vien = sinh_vien.ma
INNER JOIN mon_hoc ON diem.ma_mon_hoc = mon_hoc.ma;
```
<div style='margin-bottom:24px'></div>
_Lấy điểm của tất cả sinh viên (kể cả chưa có điểm):_
```
SELECT sinh_vien.ten, mon_hoc.ten, diem
FROM sinh_vien
LEFT JOIN diem ON sinh_vien.ma = diem.ma_sinh_vien
LEFT JOIN mon_hoc ON diem.ma_mon_hoc = mon_hoc.ma;
```
<div style='margin-bottom:24px'></div>
_Lấy điểm của tất cả môn (kể cả môn chưa có sinh viên học):_
```
SELECT mon_hoc.ten, sinh_vien.ten, diem
FROM mon_hoc
LEFT JOIN diem ON mon_hoc.ma = diem.ma_mon_hoc
LEFT JOIN sinh_vien ON sinh_vien.ma = diem.ma_sinh_vien;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 10. Sắp Xếp Dữ Liệu (`ORDER BY`)
_Tăng dần theo tên sinh viên:_
```
SELECT ma, ten
FROM sinh_vien
ORDER BY ten ASC;
```
<div style='margin-bottom:24px'></div>
_Giảm dần theo tên sinh viên:_
```
SELECT ma, ten
FROM sinh_vien
ORDER BY ten DESC;
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 11. Lọc Dữ Liệu (`WHERE`)
_Mã sinh viên > 1:_
```
SELECT ma, ten
FROM sinh_vien
WHERE ma > 1;
```
<div style='margin-bottom:24px'></div>
_Mã sinh viên trong khoảng 5 đến 10:_
```
SELECT ma, ten
FROM sinh_vien
WHERE ma BETWEEN 5 AND 10;
```
<div style='margin-bottom:24px'></div>
_Mã sinh viên thuộc danh sách cụ thể:_
```
SELECT ma, ten
FROM sinh_vien
WHERE ma IN (1, 2, 3, 4);
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 12. Giới Hạn Bản Ghi (`LIMIT`, `OFFSET`)
_Lấy 5 bản ghi đầu tiên:_
```
SELECT * FROM sinh_vien
LIMIT 5;
```
<div style='margin-bottom:24px'></div>
_Bỏ qua 5 bản ghi đầu:_
```
SELECT * FROM sinh_vien
OFFSET 5;
```
<div style='margin-bottom:24px'></div>
_Kết hợp LIMIT + OFFSET (bắt đầu từ bản ghi thứ 3, lấy 2 bản ghi):_
```
SELECT * FROM sinh_vien
LIMIT 2 OFFSET 2;
```
<div style='margin-bottom:24px'></div>
_Hoặc viết tắt:_
```
SELECT * FROM sinh_vien
LIMIT 2, 2;  -- Lấy 2 bản ghi sau khi bỏ qua 2 dòng đầu
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 13. Thống Kê & Nhóm Dữ Liệu (``GROUP BY``)
_Đếm số sinh viên theo lớp:_    
```
SELECT ma_lop, lop.ten, COUNT(*) AS 'số sinh viên'
FROM sinh_vien
JOIN lop ON sinh_vien.ma_lop = lop.ma
GROUP BY ma_lop, lop.ten;
```
<div style='margin-bottom:24px'></div>
🧠 _Lưu ý:_ Nếu `SELECT` có cột không nằm trong hàm tổng hợp (như `COUNT`) thì phải `GROUP BY` theo cột đó.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🎯 Tổng Kết
_Bạn vừa đi qua gần như **tất cả các câu lệnh SQL cơ bản và thường dùng nhất**, từ tạo bảng, thêm dữ liệu, truy vấn, đến xử lý dữ liệu nâng cao như JOIN, GROUP BY,..._

>***Đừng chỉ đọc! Hãy mở thử một trình quản lý CSDL (như MySQL, PostgreSQL, SQLite, hoặc dùng** [https://sqlfiddle.com](https://sqlfiddle.com) **) và bắt tay thực hành để nhớ lâu nhé! 💪***