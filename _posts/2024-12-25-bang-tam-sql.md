---
layout: post
title: Bảng Tạm trong SQL Server - Không Chỉ Là Lưu Trữ Tạm Thời
subtitle: Tối ưu truy vấn, xử lý dữ liệu phức tạp, và tăng hiệu suất – bảng tạm là công cụ bạn không nên bỏ qua khi làm việc với SQL Server.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

Khi làm việc với SQL Server, có lẽ không ít lần bạn phải đối mặt với những câu truy vấn dài cả trang, lồng nhiều tầng subquery rối rắm. Chúng không chỉ khó viết, khó đọc mà còn là một cơn ác mộng khi cần gỡ lỗi hay bảo trì.

Giữa mớ bòng bong đó, bảng tạm (Temporary Table) nổi lên như một công cụ đắc lực, một "chiếc bàn nháp" cho phép chúng ta chai nhỏ bài toán phức tạp, lưu trữ kết quả trung gian và biến những câu lệnh SQL hỗn độn trở nên sáng sủa, hiệu quả.

Trong bài viết này, chúng ta sẽ đi sâu vào thế giới của bảng tạm, từ cú pháp cơ bản đến những kịch bản nâng cao mà ở đó, nó trở thành giải pháp không thể thay thế.


### 1. Bảng tạm là gì?
Hiểu một cách đơn giản, bảng tạm là một bảng vật lý được tạo ra và lưu trữ trong cơ sở dữ liệu hệ thống đặc biệt có tên là tempdb. Điểm khác biệt cốt lõi của nó là vòng đời: nó chỉ tồn tại tạm thời và sẽ tự động bị huỷ khi phiên làm việc (session) kết thúc.

Có hai loại bảng tạm chính trong SQL Server:  
**a. Bảng tạm cục bộ (Local Temporary Table)**
* Cú pháp: tên bắt đầu bằng một dấu #.
* Phạm vi: chỉ có thể được nhìn thấy và sử dụng bởi phiên làm việc đã tạo ra nó. Một cửa sổ truy vấn khác hay một người dùng khác sẽ không thể truy cập được.
* Ví dụ: CREATE TABLE #danh_sach_san_pham (...)

```
-- Tạo một bảng tạm cục bộ
CREATE TABLE #TopStudents (
    StudentID INT,
    StudentName NVARCHAR(100),
    AverageScore DECIMAL(4, 2)
);

-- Chèn dữ liệu
INSERT INTO #TopStudents VALUES (1, N'Nguyễn Văn An', 9.5);

-- Truy vấn
SELECT * FROM #TopStudents;

-- Khi bạn đóng cửa sổ truy vấn này, #TopStudents sẽ tự động biến mất.
```

<div style='margin-bottom:16px'></div>

**b. Bảng tạm toàn cục (Global Temporary Table)**
* Cú pháp: Tên bắt đầu bằng hai dấu thăng
* Phạm vị: Có thể được nhìn thấy và sử dụng bởi tất cả các phiên làm việc trên SQL Server.
* Vòng đời: Chỉ bị huỷ khi phiên làm việc cuối cùng đã tham chiếu đến nó đóng lại.
* Ví dụ: CREATE TABLE ##thong_tin_khach_hang

>**Cảnh báo:** Hãy hết sức cẩn trọng khi dùng bảng tạm toàn cục. Vì nó có thể được truy cập từ mọi nơi, nó dễ gây ra xung đột tên và các vấn đề về quản lý phiên. Nó thường chỉ được dùng trong các trường hợp đặc thù.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Khi nào nên dùng?
**a. Đơn giản hoá các truy vấn phức tạp**   
Thay vì lồng 3-4 cấp subquery, hãy tách từng bước tính toàn và lưu kết quả vào bảng tạm. Code của bạn sẽ dễ đọc hơn và dễ gỡ lỗi hơn gấp nhiều lần.

**b. Tái sử dụng dữ liệu trung gian**  
Đây chính là sức mạnh code lõi của bảng tạm. Khi bạn cần dùng một tập dữ liệu đã qua xử lý ở nhiều bước khác nhau, bảng tạm là lựa chọn hoàn hảo.

**c. Cải thiện hiệu năng**  
Với các tập dữ liệu lớn, SQL Server có thể tạo ra các thống kê trên bảng tạm. Điều này giúp tối ưu hoá truy vấn, đưa ra kế hoạch thực thi tốt hơn. Hơn nữa, bạn có thể tạo Index trực tiếp trên bảng tạm để tăng tốc các thao tác JOIN hoặc WHERE sau đó.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Ví dụ
Hãy tưởng tượng một quy trình nghiệp vụ cuối tháng:
* Xác định những "khách hàng vàng" của tháng. Tiêu chí là: có trên 3 đơn hàng và tổng chi tiêu trên 20,000,000.
* Cập nhật (`UPDATE`) cột CustomerType trong bảng `Customers` thành 'VIP' cho những khách hàng này.
* Ghi nhật ký (`INSERT`) hành động này vào bảng `PromotionLog` để bộ phận marketing theo dõi.
* Hiển thị (`SELECT`) danh sách các khách hàng vừa được nâng hạng để báo cáo.

Đây là một quy trình gồm nhiều hàng động (`UPDATE`, `INSERT`, `SELECT`) nhưng đều dựa trên một danh sách khách hàng VIP duy nhất.

```
-- Tạo các bảng cần thiết
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName NVARCHAR(50),
    CustomerType NVARCHAR(10) DEFAULT 'Standard'
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    OrderAmount DECIMAL(18, 0)
);

CREATE TABLE PromotionLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT,
    LogMessage NVARCHAR(200),
    LogDate DATETIME DEFAULT GETDATE()
);

-- Chèn dữ liệu mẫu
-- Khách hàng 1: An (sẽ là VIP)
INSERT INTO Customers (CustomerID, CustomerName) VALUES (1, N'Nguyễn Văn An');
INSERT INTO Orders VALUES (101, 1, '2024-10-05', 10000000), (102, 1, '2024-10-15', 8000000), (103, 1, '2024-10-25', 5000000), (104, 1, '2024-10-28', 2000000);

-- Khách hàng 2: Bình (chi tiêu nhiều nhưng ít đơn hàng)
INSERT INTO Customers (CustomerID, CustomerName) VALUES (2, N'Trần Thị Bình');
INSERT INTO Orders VALUES (201, 2, '2024-10-10', 25000000);

-- Khách hàng 3: Dũng (nhiều đơn hàng nhưng chi tiêu ít)
INSERT INTO Customers (CustomerID, CustomerName) VALUES (3, N'Lê Văn Dũng');
INSERT INTO Orders VALUES (301, 3, '2024-10-02', 1000000), (302, 3, '2024-10-12', 1000000), (303, 3, '2024-10-22', 1000000), (304, 3, '2024-10-29', 1000000);

-- -------- BƯỚC 1: TÍNH TOÁN VÀ LƯU KẾT QUẢ VÀO BẢNG TẠM --------
-- Tính toán phức tạp để tìm ra "khách hàng vàng"
-- Lưu danh sách ID của họ vào một bảng tạm để sử dụng lại ở các bước sau.

CREATE TABLE #GoldenCustomers (
    CustomerID INT PRIMARY KEY
);

INSERT INTO #GoldenCustomers (CustomerID)
SELECT
    CustomerID
FROM Orders
GROUP BY CustomerID
HAVING
    COUNT(OrderID) > 3                -- Có trên 3 đơn hàng
    AND SUM(OrderAmount) > 20000000;  -- Tổng chi tiêu trên 20,000,000

-- Giờ đây, bảng tạm #GoldenCustomers đang chứa ID của những khách hàng thỏa mãn điều kiện (trong ví dụ này là khách hàng có ID = 1).
-- Chúng ta sẽ sử dụng lại nó nhiều lần.


-- -------- BƯỚC 2: UPDATE BẢNG CHÍNH --------
-- Dùng danh sách trong bảng tạm để cập nhật bảng Customers.

UPDATE C
SET C.CustomerType = 'VIP'
FROM Customers C
JOIN #GoldenCustomers GC ON C.CustomerID = GC.CustomerID;


-- -------- BƯỚC 3: INSERT VÀO BẢNG LOG --------
-- Dùng lại danh sách trong bảng tạm để ghi nhật ký.

INSERT INTO PromotionLog (CustomerID, LogMessage)
SELECT
    CustomerID,
    N'Khách hàng được nâng hạng VIP trong đợt khuyến mãi cuối tháng'
FROM #GoldenCustomers;


-- -------- BƯỚC 4: SELECT ĐỂ BÁO CÁO --------
-- Dùng lại lần cuối danh sách trong bảng tạm để hiển thị kết quả.

SELECT
    C.CustomerID,
    C.CustomerName,
    C.CustomerType
FROM Customers C
JOIN #GoldenCustomers GC ON C.CustomerID = GC.CustomerID;


-- Đừng quên dọn dẹp sau khi hoàn tất
DROP TABLE #GoldenCustomers;
```

<div style='margin-bottom:16px'></div>

Trong kịch bản này, các giải pháp thay thế như CTE hay subquery đều thất bại vì chúng chỉ tồn tại trong một câu lệnh duy nhất. Bạn sẽ phải lặp lại logic tính toán phức tạp ở cả 3 bước, gây ra sự trùng lặp code vaf suy giảm hiệu năng nghiêm trọng.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Bảng tạm vs "Họ Hàng": Cuộc so tài tay đôi
Lựa chọn đúng công cụ cho đúng công việc là chìa khoá của một lập trình viên chuyên nghiệp.

| <small>**Tiêu chí**<small/> | <small>**Bảng Tạm (#table)**<small/> |  <small>**Biến Bảng (@table)**<small/> |  <small>**CTE (WITH ...)**<small/> | 
|----------------------|-------------------------------------|
| <small>Lý tưởng cho<small/> | <small>Tập dữ liệu lớn, cần tái sử dụng nhiều lần.<small/> |<small>Tập dữ liệu rất nhỏ (dưới 1000 dòng).<small/> | <small>Logic phức tạp cần đơn giản hóa cho một câu lệnh duy nhất.<small/> | 
| <small>Hiệu năng<small/> | <small>Tốt hơn với dữ liệu lớn vì có Statistics.<small/> | <small>Có thể kém với dữ liệu lớn vì không có Statistics chi tiết.<small/> | <small>Không lưu trữ vật lý, được "mở rộng" vào câu lệnh chính.<small/> | 
| <small>Tạo Index<small/> | <small>Rất linh hoạt, có thể tạo sau khi có dữ liệu.<small/> | <small>Hạn chế, chỉ định nghĩa lúc `DECLARE`.<small/> | <small>Không thể.<small/> | 
| <small>Phạm vi<small/> | <small>Toàn bộ phiên làm việc (session).<small/> |<small>Chỉ trong batch/procedure hiện tại.<small/> | <small>Chỉ trong một câu lệnh ngay sau nó.<small/> | 
| <small>Giao dịch (Tx)<small/> | <small>Chịu ảnh hưởng đầy đủ của transaction.<small/> |<small>Ít bị ảnh hưởng hơn.<small/> | <small>Là một phần của transaction của câu lệnh chính.<small/> | 
{: style="width:100%; margin-bottom:16px"}

>**Quy tắc ngón tay cái: Nếu bạn phân vân, hãy dùng bảng tạm (#table). Nó an toàn và có hiệu năng ổn định hơn. Chỉ dùng biến bảng (@table) khi bạn chắc chắn tập dữ liệu cực nhỏ.**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Lời kết
Bảng tạm không chỉ là một nơi lưu trữ dữ liệu tạm thời. Nó là một công cụ thiết kế mạnh mẽ, một phương pháp để cấu trúc hoá logic, cải thiện hiệu năng và tăng cường khả năng bảo trì cho mã SQL của bạn. Bằng cách làm chủ nó, bạn không chỉ giải quyết được những bào toán phức tạp một cách thanh lịch, mà còn chứng tỏ được tư duy lập trình bài bản và chuyên nghiệp của mình.

