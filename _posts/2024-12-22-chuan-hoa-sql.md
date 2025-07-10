---
layout: post
title: Chuẩn hóa vs Phi chuẩn hóa - Tư duy đúng khi thiết kế cơ sở dữ liệu
subtitle: Tối ưu hiệu năng mà không đánh đổi tính toàn vẹn – cùng cách xử lý mối quan hệ 1-N, N-N chuyên nghiệp.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

>***Tối ưu không đồng nghĩa với phức tạp. Hiểu đúng về chuẩn hoá, phi chuẩn hoá và cách sử dụng khoá chính - khoá ngoại sẽ giúp bạn thiết kế cơ sở dữ liệu ổn định, dễ mở rộng và hiệu năng cao.***

### 1. Chuẩn hoá là gì? Tại sao cần chuẩn hoá?
**Chuẩn hoá (Normalization)** là quá trình tổ chức dữ liệu trong cơ sở dữu liệu để:  
* Giảm dư thừa dữ liệu
* Tránh mâu thuẫn dữ liệu
* Cải thiện tính toàn vẹn

**Ví dụ đơn giản:**  
Giả sử bạn có bảng `Students`:

| <small>**ID**<small/> | <small>**Name**<small/> | <small>**ClassName**<small/> |<small>**TeacherName**<small/> |
|----------------------|----------------------|----------------------|----------------------|
| <small>1<small/> | <small>An<small/> | <small>10A<small/> |  <small>Cô Hà<small/> | 
| <small>2<small/> | <small>Bình<small/> | <small>10A<small/> |  <small>Cô Hà<small/> | 
| <small>3<small/> | <small>Chi<small/> | <small>10B<small/> | <small>Thầy Sơn<small/> | 
{: style="width:100%; margin-bottom:16px"}

* Vấn đề:  Nếu cô Hà đổi lớp, bạn phải cập nhật ở nhiều dòng, rất dễ sai sót.
* Giải pháp: Chuẩn hoá bằng cách tách ra 2 bảng:  
  * `Classes(ID, ClassName, TeacherName)`
  * `Students(ID, Name, ClassID)` - có khoá ngoại tới `Classes.ID`

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Các mức chuẩn hoá phỏ biến

<div style='margin-bottom:16px'></div>

| <small>**Mức chuẩn**<small/> | <small>**Mục tiêu chính**<small/> | <small>**Tránh lỗi gì?**<small/> |
|----------------------|----------------------|----------------------|
| <small>1NF<small/> | <small>Không chứa danh sách lồng nhau (array)<small/> | <small>Tránh lưu trữ dữ liệu phức tạp<small/> | 
| <small>2NF<small/> | <small>Phụ thuộc đầy đủ vào khóa chính<small/> | <small>Tránh dữ liệu dư khi có khóa tổ hợp<small/> | 
| <small>3NF<small/> | <small>Tránh phụ thuộc bắc cầu (transitive)<small/> | <small>Tránh lặp lại thông tin gián tiếp<small/> |
{: style="width:100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Phi chuẩn hoá là gì? Khi nà dùng?
**Phi chuẩn hoá (Denormalization)** là cố tình làm ngược lại chuẩn hoá để:  
* Tăng hiệu năng truy vấn
* Giảm số lần `JOIN` phức tạp

**Khi nào nên phi chuẩn hoá?**

| <small>**Tình huống thực tế**<small/> | <small>**Giải thích**<small/> |
|----------------------|----------------------|
| <small>Truy vấn phức tạp và quá chậm<small/> | <small>Tránh `JOIN` quá nhiều bảng<small/> |
| <small>Dữ liệu ít thay đổi (ít cập nhật)<small/> | <small>Tránh vấn đề đồng bộ dữ liệu<small/> | 
| <small>Phân tích dữ liệu, báo cáo (OLAP)<small/> | <small>Ưu tiên tốc độ đọc, không cần tối ưu ghi<small/> | 
{: style="width:100%; margin-bottom:16px"}

>**Cảnh báo:** Phi chuẩn hoá có thể gây dư thừa dữ liệu và khó bảo trì nếu không kiểm soát tốt.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Sử dụng khoá chính và khoá ngoại đúng cách
**Khoá chính (Primary Key):**  
* Không được `NULL`
* Dùng để định danh duy nhất mỗi bản ghi
* Nên dùng kiểu `INT`, `UUID` hoặc `AUTO_INCREMENT`

**Khoá ngoại (FOREIGN KEY)**  
* Dùng để liên kết giữa các bảng
* Giúp duy trì tính toàn vẹn dữ liệu
* Có thể khai báo `ON DELETE CASCADE` hoặc `ON UPDATE CASCADE` để xử lý tự động.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Thiết kế mối quan hệ 1-N và N-N hiệu quả
**Quan hệ 1-N(One-to-Many)**  
Ví dụ: 1 lớp học có nhiều học sinh
* Lớp (Class): `ID`, `Name`
* Học sinh (Student): `ID`, `Name`, `ClassID`

```
-- Class table
CREATE TABLE Class (
  ID INT PRIMARY KEY,
  Name VARCHAR(100)
);

-- Student table
CREATE TABLE Student (
  ID INT PRIMARY KEY,
  Name VARCHAR(100),
  ClassID INT,
  FOREIGN KEY (ClassID) REFERENCES Class(ID)
);
```

<div style='margin-bottom:16px'></div>

**Quan hệ N-N (Many-to-Many)**  
Ví dụ: 1 học sinh học nhiều môn, 1 môn có nhiều học sinh
* Tạo bản trung gian `StudentSubject`

```
-- Student
CREATE TABLE Student (
  ID INT PRIMARY KEY,
  Name VARCHAR(100)
);

-- Subject
CREATE TABLE Subject (
  ID INT PRIMARY KEY,
  Title VARCHAR(100)
);

-- StudentSubject (Join table)
CREATE TABLE StudentSubject (
  StudentID INT,
  SubjectID INT,
  PRIMARY KEY (StudentID, SubjectID),
  FOREIGN KEY (StudentID) REFERENCES Student(ID),
  FOREIGN KEY (SubjectID) REFERENCES Subject(ID)
);
```
<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. Tổng kết
* Thiết kế chuẩn hoá trước, rồi phi chuẩn hoá có chọn lọc khi cần tối ưu hiệu năng.
* Luôn dùng khoá chính - khoá ngoại rõ ràng, tránh "thiết kế theo cảm tính".
* Với quan hệ **N-N**, phải có bảng trung gian - không được nhồi `array` vào 1 cột.

Bạn đang thiết kế hệ thống nào? Hãy thử kiểm tra lại xem cơ sở dữ liệu của bạn đã chuẩn hoá đúng mức chưa, và có cần phi chuẩn hoá hợp lý để tăng tốc không nhé.



