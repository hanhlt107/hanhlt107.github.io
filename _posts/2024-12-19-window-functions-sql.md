---
layout: post
title: Window Functions trong SQL Server
subtitle: Hướng dẫn toàn diện, từ cơ bản đến nâng cao, giúp bạn làm chủ Window Functions trong SQL.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
comments: true
---

>**Window Functions** là một trong những công cụ mạnh mẽ nhất trong SQL Server, cho phép bạn thực hiện các phép tính như tổng, trung bình, xếp hạng, và truy xuất giá trị từ các dòng liên quan trong một tập kết quả mà không cần `GROUP BY`. Trong bài viết này, bạn sẽ tìm hiểu cách hoạt động của **Window Functions**, các loại phổ biến, và ví dụ thực tế dễ hiểu

### 1. Window Functions là gì?
**Window Function** thực hiện tính toán trên một "cửa sổ" của các hàng liên quan đến hàng hiện tại. Khác với **Aggregate Functions** (`SUM`, `AVG`, `COUNT`...), các **Window Function** không làm gộp dữ liệu lại, mà vẫn giữ nguyên từng hàng.

**Cú pháp chung:**
```
<Window_Function>() OVER (
    [PARTITION BY partition_expression]
    [ORDER BY sort_expression]
    [ROWS|RANGE BETWEEN ...]
)
```

<div style='margin-bottom:16px'></div>

* `PARTITION BY`: Chia tập dữ liệu thành các nhóm con (partition).
* `ORDER BY`: Xác định thứ tự trong mỗi partition.
* `ROWS|RANGE`: Xác định phạm vi của cửa số.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Cách sử dụng Window Functions
**2.1** `PARTITION BY` **- Phân nhóm dữ liệu**
* `PARTITION BY` chia dữ liệu thành các nhóm (tương tự `GROUP BY`) nhưng không gộp kết quả.

**Ví dụ:** _Tính tổng doanh thu theo từng phòng ban mà không gộp hàng._
<div style='margin-top:16px'></div>
```
SELECT 
    employee_id,
    department,
    salary,
    SUM(salary) OVER (PARTITION BY department) AS total_salary_by_dept
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Kết quả:**
<div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**total_salary_by_dept**<small/> |
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>5000<small/> | <small>15000<small/>|
| <small>Bình<small/> | <small>Sales<small/> | <small>7000<small/> | <small>15000<small/>|
| <small>Chi<small/> | <small>Sales<small/> | <small>3000<small/> | <small>15000<small/>|
| <small>Dũng<small/> | <small>IT<small/> | <small>6000<small/> | <small>10000<small/>|
| <small>Huy<small/> | <small>IT<small/> | <small>4000<small/> | <small>10000<small/>|

<div style='margin-bottom:16px'></div>

**Giải thích kết quả:**
* Các nhân viên thuộc Sales đều nhận được giá trị `total_salary_by_dept` bằng tổng lương của 3 người 5000 + 7000 + 3000 = 15000.
* Các nhân viên thuộc IT đều nhận được giá trị `total_salary_by_dept` bằng tổng lương của 2 người 6000 + 4000 = 10000.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.2** `ORDER BY` **- Sắp xếp**
* `ORDER BY` xác định thứ tự các hàng trong cửa sổ trước khi áp dụng hàm.

**Ví dụ:** Tính luỹ kế lương theo từng phòng ban.
<div style='margin-top:16px'></div>
```
SELECT 
    employee_id,
    department,
    salary,
    SUM(salary) OVER (
        PARTITION BY department
        ORDER BY employee_id
    ) AS running_total_salary
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Kết quả:**
<div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**running_total_salary**<small/> |
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>5000<small/> | <small>5000<small/>|
| <small>Bình<small/> | <small>Sales<small/> | <small>7000<small/> | <small>12000<small/>|
| <small>Chi<small/> | <small>Sales<small/> | <small>3000<small/> | <small>15000<small/>|
| <small>Dũng<small/> | <small>IT<small/> | <small>6000<small/> | <small>6000<small/>|
| <small>Huy<small/> | <small>IT<small/> | <small>4000<small/> | <small>10000<small/>|

<div style='margin-bottom:16px'></div>

**Giải thích kết quả:**  
Đối với Sales:
* An: lương 5000 => luỹ kế = 5000.
* Bình: lương 7000 => luỹ kế 5000 + 7000 = 12000.
* Chi: lương 3000 => luỹ kế 5000 + 7000 + 3000 = 15000.

Đối với IT:
* Dũng: lương 6000 => luỹ kế = 6000.
* Huy: lương 4000 => luỹ kế 6000 + 4000 = 10000.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.3 Hàm xếp hạng:** `RANK()` **vs** `DENSE_RANK()`  
Cả hai hàm `RANK()` và `DENSE_RANK()` đều dùng để xếp hạng các hàng trong một nhóm. Khác biệt chính:
* `RANK()`: Nếu có nhiều hàng bằng nhau, chúng nhận cùng một hạng, và thứ hạng tiếp theo sẽ bị bỏ qua.
* `DENSE_RANK()`: Cũng gán hạng băng nhau cho các giá trị giống nhau, nhưng không nhảy thứ hạng kế tiếp.

**Ví dụ:**
<div style='margin-top:16px'></div>

```
SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Giải thích:**
* `PARTITION BY department` Nhân viên được nhóm theo phòng ban.
* `ORDER BY salary DESC` Trong mỗi phòng ban, sắp xếp theo lương giảm dẫn.
* `RANK()` gán thứ hạng, nhưng nếu có **giá trị trùng nhau**, thì các dòng đó **chia sẻ cùng một hạng và nhảy qua hạng tiếp theo**.
* `DENSE_RANK()` cũng gán cùng hạng cho các giá trị trùng, nhưng **không nhảy hạng**.

**Kết quả:**

<div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**rank**<small/> | <small>**dense_rank**<small/> |
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>1<small/> | <small>1<small/> |
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>1<small/> | <small>1<small/> |
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>3<small/> | <small>2<small/> |
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>1<small/> | <small>1<small/> |
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>2<small/> | <small>2<small/> |

<div style='margin-bottom:16px'></div>

**Giải thích kết quả:**  
Đối với Sales:
* An và Bình đều có lương 8000, nên:
    * Cả hai đều được `RANK` = `DENSE_RANK` = 1.
    * Với `RANK()`, hạng tiếp theo sau hai người hạng 1 sẽ là hạng 3 (vì đã chiếm 2 dòng).
    * Với `DENSE_RANK()`, hạng tiếp theo vẫn là hạng 2 (không bị nhảy).
* Chi có lương 6000, thấp hơn:
    * `RANK` = 3.
    * `DENSE_RANK)` = 2.

Đối với IT:
* Dũng:  có lương cao nhất (7000), nên `RANK` = `DENSE_RANK` = 1
* Huy: có lương thấp hơn (6800), nên:   
    * `RANK` = `DENSE_RANK` = 2
    * Không có trùng lương trong nhóm này, nên `RANK()` và `DENSE_RANK()` cho ra kết quả giống nhau.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.4** `ROW_NUMBER()` **- Đánh số thứ tự duy nhất**
* Hàm `ROW_NUMBER()` gán số thứ tự duy nhất cho từng hàng trong mỗi partition, không quan tâm đến giá trị có trùng nhau.

**Ví dụ:**
<div style='margin-top:16px'></div>
```
SELECT
    name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Giải thích:**
* Dữ liệu được chia theo từng phòng ban
* Sắp xếp lương giảm dần.
* Mỗi hàng được đánh số từ 1 tăng dần, không nhảy số.

**Kết quả:**
<div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**row_num**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>1<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>2<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>3<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>1<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>2<small/> | 

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.4** `NTILE(n)` **- Chia nhóm phần bằng nhau**
* `NTILE(n)` chia dữ liệu thành `n` nhóm có kích thước bằng nhau.

**Ví dụ:**
<div style='margin-top:16px'></div>

```
SELECT
    name,
    department,
    salary,
    NTILE(4) OVER (ORDER BY salary DESC) AS salary_quartile
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Giải thích:**
* Toàn bộ dữ liệu được sắp xếp theo lương giảm dần
* Chia thành 4 nhóm (quartiles).
* Nhóm 1 có mức lương cao nhât, nhóm 4 thấp nhất.

**Kết quả:**
<div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**salary_quartile**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>1<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>1<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>2<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>1<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>2<small/> | 

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.5** `LAG()` **và** `LEAD()` **- Truy xuất dòng trước hoặc sau**
* `LAG()`: Lấy giá trị của hàng trước đó trog cùng partition.
* `LEAD()`: Lấy giá trị của hàng kế tiếp trong cùng partiton.

**Ví dụ** `LAG()`: Lấy  mức lương của nhân viên trước đó trong phòng ban để so sánh.
<div style='margin-top:16px'></div>

```
SELECT
    name,
    department,
    salary,
    LAG(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS prev_salary
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Kết quả:**
 <div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**prev_salary**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>NULL<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>8000<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>8000<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>NULL<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>7000<small/> | 

<div style='margin-bottom:16px'></div>

**Ví dụ** `LEAD()`: Lấy mức lương của nhân viên kế tiếp trong phòng ban để so sánh.
<div style='margin-top:16px'></div>
```
SELECT
    name,
    department,
    salary,
    LEAD(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS next_salary
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Kết quả:**
 <div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**next_salary**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>8000<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>6000<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>NULL<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>6800<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>NULL<small/> | 

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

**2.6 Các hàm tổng hợp:** `SUM()`, `AVG()`, `MIN()`, `MAX()`

**Ví dụ:** _Tổng lương được cộng dồn theo thứ tự lương giảm dần trong mỗi phòng ban._
<div style='margin-top:16px'></div>
```
SELECT
    name,
    department,
    salary,
    SUM(salary) OVER (PARTITION BY department ORDER BY salary DESC) AS running_total
FROM employees;
```
<div style='margin-bottom:16px'></div>

**Kết quả:**
 <div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**running_total**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>8000<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>16000<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>22000<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>7000<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>13800<small/> | 

<div style='margin-bottom:16px'></div>

**Giải thích kết quả:**  
Đối với Sales:
* An: có lương 8000 =>  tổng tích lũy là 8000
* Bình: cũng có lương 8000 => cộng thêm vào tổng → 8000 + 8000 = 16000.
* Chi: có lương 6000 => tổng cộng dồn là 8000 + 8000 + 6000 = 22000.

Đối với IT:
* Dũng: có lương 7000 =>  tổng tích lũy là 7000
* Huy: có lương 6800 => cộng thêm vào → 7000 + 6800 = 13800.

**Ví dụ:** _Trung bình lương được tính tích luỹ từ dòng đầu đến dòng hiện tại._
<div style='margin-top:16px'></div>
```
SELECT
    name,
    department,
    salary,
    AVG(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_avg
FROM employees;
```
<div style='margin-top:16px'></div>

**Kết quả:**
 <div style='margin-top:16px'></div>

| <small>**name**<small/> | <small>**department**<small/> | <small>**salary**<small/> | <small>**running_avg**<small/> | 
|----------------------|-------------------------------------|---------------------------------------------------------------------|
| <small>An<small/> | <small>Sales<small/> | <small>8000<small/> | <small>8000.00<small/> | 
| <small>Bình<small/> | <small>Sales<small/> | <small>8000<small/> | <small>8000.00<small/> | 
| <small>Chi<small/> | <small>Sales<small/> | <small>6000<small/> | <small>7333.33<small/> | 
| <small>Dũng<small/> | <small>IT<small/> | <small>7000<small/> | <small>7000.00<small/> | 
| <small>Huy<small/> | <small>IT<small/> | <small>6800<small/> | <small>6900.00<small/> | 

<div style='margin-bottom:16px'></div>

**Giải thích kết quả:**  
Đối với Sales:
* An: chỉ có 1 dòng => trung bình = 8000
* Bình: AVG(8000, 8000) = 8000
* Chi: AVG(8000, 8000, 6000) = (8000 + 8000 + 6000)/3 = 7333.33

Đối với IT:
* Dũng: chỉ có 1 dòng => 7000
* Huy: AVG(7000, 6800) = (7000 + 6800)/2 = 6900

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Lưu ý khi sử dụng Window Functions  
* Luôn cần từ khóa `OVER()`.
* Không thể sử dụng trực tiếp trong `WHERE` (dùng trong `SELECT` hoặc `ORDER BY`).
* Hiệu suất phụ thuộc vào việc phân vùng và sắp xếp dữ liệu.
* Tối ưu chỉ khi có chỉ mục phù hợp và dữ liệu không quá lớn.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Tổng kết 
**Window Functions** là công cụ mạnh mẽ giúp bạn xử lý các bài toán phức tạp trong SQL Server mà không cần phải viết nhiều câu lệnh con hay join phức tạp. Hiểu rõ cách hoạt động và áp dụng đúng cách sẽ giúp bạn tối ưu hiệu suất và mở rộng khả năng phân tích dữ liệu.






