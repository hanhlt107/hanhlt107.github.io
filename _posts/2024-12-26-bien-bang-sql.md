---
layout: post
title: Biến Bảng trong SQL Server - Khi "Nhẹ" Lại Là Lợi Thế
subtitle: Table variable không phải là phiên bản "nhẹ" của bảng tạm. Nếu bạn đang dùng `DECLARE @t TABLE`, hãy chắc chắn bạn hiểu rõ cách hoạt động phía sau.
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server, SQL]
comments: true
---

Trong SQL Server, việc xử lý và lưu trữ dữ liệu tạm thời là một nhu vực không thể thiếu đối với bất kỳ lập trình viên hay quản trị viên cơ sở dữ liệu nào. Bên cạnh "người anh em" quen thuộc là bảng tạm (temporary table), SQL Server còn cung câp một công cụ cực kỳ mạnh mẽ và linh hoạt khác, đó chính là biến bảng (Table variable).

Bài viết hôm nay sẽ là một chuyến du hành chi tiết, giúp bạn "làm chủ" hoàn toàn khái niệm này. Chúng ta sẽ cùng nhau khám phá từ những khái niệm cơ bản nhất cho đến các kịch bản sử dụng nâng cao, so sánh ưu nhược điểm và tìm ra khi nào nên "chọn mặt gửi vàng" cho biến bảng.

### 1. Biến bảng: "Chiếc hộp Pandora" lưu trữ dữ liệu tạm thời
Về cơ bản, biến bảng là một loại biến đặc biệt có khả năng lưu trữ một tập hợp các dòng chữ liệu, tương tự như một bảng thông thường. Bạn có thể thực hiện các thao tác như `INSERT`, `UPDATE`, `DELETE`, và `SELECT` trên biến bảng. Tuy nhiên, điểm khác biệt cốt lõi nằm ở vòng đời và phạm vi tồn tại của nó.

Vì là một biến, biến bảng chỉ tồn tại trong phạm vi mà nó được khai báo, chẳng hạn như trong một stored procedure, một function, một trigger hoặc một lô (batch) câu lệnh. Khi ra khỏi phạm vi đó, nó sẽ tự động giải phóng.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 2. Cú pháp khai báo và sử dụng
Việc khai báo một biến bảng khá đơn giản và quen thuộc, tựa như việc bạn tạo một bảng mới với lệnh `CREATE TABLE`.  
Để khai báo một biến bảng, chúng ta sử dụng từ kháo `DECLARE`.

```
DECLARE @Ten_Bien_Bang TABLE
(
    Ten_Cot1 Kieu_Du_Lieu1 [Thuoc_tinh_rang_buoc],
    Ten_Cot2 Kieu_Du_Lieu2 [Thuoc_tinh_rang_buoc],
    ...
);
```

<div style='margin-bottom:16px'></div>

**Trong đó:**
* @Ten_Bien_Bang: Là tên của biến bảng, luôn bắt đầu bằng ký tự @.
* `TABLE`: Là từ khoá chỉ định đây là một biến bảng.
* Ten_Cot, Kieu_Du_Lieu, Thuoc_tinh_rang_buoc: cấu trúc định nghĩa các cột tương tự như khi tạo một bảng thông thường.

**Ví dụ:**

```
DECLARE @DanhSachSanPham TABLE
(
    ID INT PRIMARY KEY,
    TenSanPham NVARCHAR(255) NOT NULL,
    DonGia DECIMAL(18, 2)
);
```

<div style='margin-bottom:16px'></div>

**Các thao tác cơ bản với biến bảng:**
* `INSERT`

```
INSERT INTO @DanhSachSanPham (ID, TenSanPham, DonGia)
VALUES (1, 'Laptop ABC', 25000000),
       (2, 'Chuột không dây XYZ', 500000);
```

<div style='margin-bottom:16px'></div>

* `INSERT` dữ liệu từ một câu lệnh `SELECT`

```
INSERT INTO @DanhSachSanPham (ID, TenSanPham, DonGia)
SELECT ProductID, ProductName, Price 
FROM Products 
WHERE CategoryID = 1;
```

<div style='margin-bottom:16px'></div>

* `SELECT`

```
SELECT * FROM @DanhSachSanPham;

SELECT TenSanPham, DonGia 
FROM @DanhSachSanPham 
WHERE DonGia > 1000000;
```

<div style='margin-bottom:16px'></div>

* `UPDATE`

```
UPDATE @DanhSachSanPham
SET DonGia = 26000000
WHERE ID = 1;
```

<div style='margin-bottom:16px'></div>

* `DELETE`

```
DELETE FROM @DanhSachSanPham
WHERE ID = 2;
```

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 3. Phạm vi hoạt động và vòng đời: Ngắn ngủi nhưng hiệu quả
Như đã đề cập, phạm vi của biến bảng bị giới hạn trong khối lệnh mà nó được khia báo. Điều này có nghĩa là:  
* Nếu bạn khai báo một biến bảng trong một Stored Procedure, nó chỉ có thể được truy cập bên trong Stored Procedure đó. Khi Stored Procedure kết thúc, biến bảng sẽ biến mất.
* Tương tự, nếu khai báo trong một batch câu lệnh, nó sẽ không tồn tại ở batch tiếp theo.

Cả biến bảng và bảng tạm đều được tạo trong cơ sở dữ liệu `tempdb`. Do đó, việc truy xuất dữ liệu từ biến bảng không nhất thiết nhanh hơn bảng tạm, vì cả hai đều có thể được lưu trong bộ nhớ hoặc bỉ đẩy ra đĩa cứng khi cần thiết.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 4. Ưu và nhược điểm của biến bảng
Việc lựa chọn sử dụng biến bảng hay bảng tạm phụ thuộc vào nhiều ngữ cảnh cụ thể. Hãy cùng phân tích ưu và nhược điểm của biến bảng để có quyết định sáng suốt.

**Ưu điểm:**
* Ít recompilation hơn: việc sử dụng biến bảng trong các Stored Procedure có thể giúp chương trình hoạt động tốt hơn vì SQL Server ít phải biên dịch lại (recompile) hơn so với việc sử dụng bảng tạm.
* Sử dụng ít tài nguyên hơn: biến bảng thường sử dụng ít tài nguyên hơn về mặt ghi log và khoá.
* Phạm vi rõ ràng: vòng đời của biến bảng được quản lý tự động, giúp tránh các vấn đề tiềm ẩn về tài nguyên không được giải phóng.

**Nhược điểm:**
* Hạn chế về cấu trúc: bạn không thể sử dụng lệnh `ALTER TABLE` để thay đổi cấu trúc của biến bảng sau khi đã khai báo. Toàn bộ cấu trúc phải được định nghĩa ngya từ đầu.
* Không thể tạo Non-Clustered Index: mặc dù bạn có thể tạo `primary key` và `unique` constraint (tự động tạo Clustered hoặc None-Clustered Index), việc tạo các Non-Clustered Index một cách tường minh trên bên bảng không được hỗ trợ ở các phiên bản cũ.
* Hạn chế trong thống kê: biến bảng không có các thống kê phân phối dữ liệu, điều này có thể khiến bộ tối ưu hoá truy vấn của SQL Server đưa ra các kế hoạch thực thi không hiệu quả, đặc biệt với dữ liệu lớn.
* Không thể sử dụng trong một số ngữ cảnh: bạn không thể dử dụng biến bảng làm tham số đầu vào hoặc đầu ra của một Stored Procedure một cách trực tiếp.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 5. Ví dụ
Hãy tưởng tượng chúng ta đang quản lý một cơ sở dữ liệu bán hàng đơn giản. Ban giám đốc yêu cầu một báo cáo nhanh: 
>**"Tính tổng giá trị đơn hàng cho một khách hàng cụ thể trong một khoảng thời gian, nhưng có áp dụng chính sách khuyến mãi đặc biệt."**

**Chính sách khuyến mãi như sau:**
* Đối với nhữung đơn hàng trong khoảng thời gian được chọn, nếu tổng giá trị của một sản phẩm vượt quá 50,000,000 VNĐ thì tất cả các dòng hàng của sản phầm đó trong báo cáo sẽ được giảm giá 10%.

**Đây là yêu cầu cần sử dụng biến bảng vì:**
* Cần một nơi để chứa dữ liệu tạm thời (các đơn hàng của khách hàng).
* Tập dữ liệu này thường không quá lớn (chỉ có một khách hàng).
* Chúng ta cần thực hiện nhiều bước xử lý trung gian trên tập dữ liệu này.

```
--============= BƯỚC 1: TẠO BẢNG VÀ DỮ LIỆU MẪU =============

-- Xóa bảng nếu đã tồn tại để chạy lại ví dụ dễ dàng
IF OBJECT_ID('DonHangChiTiet', 'U') IS NOT NULL DROP TABLE DonHangChiTiet;
IF OBJECT_ID('SanPham', 'U') IS NOT NULL DROP TABLE SanPham;
IF OBJECT_ID('KhachHang', 'U') IS NOT NULL DROP TABLE KhachHang;

-- Tạo bảng KhachHang
CREATE TABLE KhachHang (
    ID INT PRIMARY KEY,
    TenKhachHang NVARCHAR(100)
);

-- Tạo bảng SanPham
CREATE TABLE SanPham (
    ID INT PRIMARY KEY,
    TenSanPham NVARCHAR(100),
    DonGia DECIMAL(18, 2)
);

-- Tạo bảng DonHangChiTiet
CREATE TABLE DonHangChiTiet (
    ID INT PRIMARY KEY IDENTITY(1,1),
    IDKhachHang INT FOREIGN KEY REFERENCES KhachHang(ID),
    IDSanPham INT FOREIGN KEY REFERENCES SanPham(ID),
    SoLuong INT,
    NgayDatHang DATE
);
GO

-- Chèn dữ liệu mẫu
INSERT INTO KhachHang (ID, TenKhachHang) VALUES
(1, N'Công ty A'),
(2, N'Cửa hàng B');

INSERT INTO SanPham (ID, TenSanPham, DonGia) VALUES
(101, N'Màn hình Dell UltraSharp', 12000000),
(102, N'Bàn phím cơ Logitech', 3500000),
(103, N'Chuột không dây Microsoft', 1200000),
(104, N'Laptop Gaming XYZ', 45000000);

-- Chèn dữ liệu đơn hàng cho Khách hàng 1 (Công ty A)
INSERT INTO DonHangChiTiet (IDKhachHang, IDSanPham, SoLuong, NgayDatHang) VALUES
(1, 101, 3, '2025-07-10'), -- Màn hình: 3 * 12tr = 36tr
(1, 102, 5, '2025-07-11'), -- Bàn phím: 5 * 3.5tr = 17.5tr
(1, 101, 2, '2025-07-15'), -- Màn hình: 2 * 12tr = 24tr -> Tổng màn hình = 60tr (> 50tr) -> ĐƯỢC GIẢM GIÁ
(1, 104, 1, '2025-07-18'), -- Laptop: 1 * 45tr = 45tr -> KHÔNG được giảm giá
(1, 102, 2, '2025-07-20'); -- Bàn phím: 2 * 3.5tr = 7tr -> Tổng bàn phím = 24.5tr -> KHÔNG được giảm giá

-- Chèn dữ liệu đơn hàng cho Khách hàng 2 để kiểm tra
INSERT INTO DonHangChiTiet (IDKhachHang, IDSanPham, SoLuong, NgayDatHang) VALUES
(2, 104, 2, '2025-07-16');
GO

--============= BƯỚC 2: TẠO STORED PROCEDURE VỚI BIẾN BẢNG =============

CREATE OR ALTER PROCEDURE usp_TinhGiaTriDonHangVoiKhuyenMai
    @IDKhachHang INT,
    @NgayBatDau DATE,
    @NgayKetThuc DATE
AS
BEGIN
    SET NOCOUNT ON; -- Ngăn SQL Server trả về số dòng bị ảnh hưởng, giúp tăng hiệu năng

    -- === BIẾN BẢNG 1: Lưu trữ các đơn hàng hợp lệ của khách hàng ===
    -- Mục đích: Lọc ra các đơn hàng cần xử lý ngay từ đầu.
    DECLARE @DonHangHopLe TABLE (
        IDSanPham INT,
        TenSanPham NVARCHAR(100),
        SoLuong INT,
        DonGia DECIMAL(18, 2),
        ThanhTien DECIMAL(18, 2)
    );

    INSERT INTO @DonHangHopLe (IDSanPham, TenSanPham, SoLuong, DonGia, ThanhTien)
    SELECT
        sp.ID,
        sp.TenSanPham,
        dh.SoLuong,
        sp.DonGia,
        dh.SoLuong * sp.DonGia AS ThanhTien
    FROM DonHangChiTiet dh
    JOIN SanPham sp ON dh.IDSanPham = sp.ID
    WHERE
        dh.IDKhachHang = @IDKhachHang
        AND dh.NgayDatHang BETWEEN @NgayBatDau AND @NgayKetThuc;

    -- Nếu không có đơn hàng nào, thoát sớm
    IF NOT EXISTS (SELECT 1 FROM @DonHangHopLe)
    BEGIN
        SELECT 0 AS TongGiaTriCuoiCung;
        RETURN;
    END;

    -- === BIẾN BẢNG 2: Tính tổng giá trị cho mỗi sản phẩm ===
    -- Mục đích: Xác định sản phẩm nào đủ điều kiện nhận khuyến mãi.
    DECLARE @TongGiaTriTheoSanPham TABLE (
        IDSanPham INT,
        TongGiaTri DECIMAL(18, 2)
    );

    INSERT INTO @TongGiaTriTheoSanPham (IDSanPham, TongGiaTri)
    SELECT
        IDSanPham,
        SUM(ThanhTien)
    FROM @DonHangHopLe
    GROUP BY IDSanPham;

    -- === BƯỚC TÍNH TOÁN CUỐI CÙNG: Áp dụng khuyến mãi và tính tổng ===
    -- Mục đích: Join các biến bảng lại với nhau để tính toán kết quả cuối cùng.
    DECLARE @TongGiaTriCuoiCung DECIMAL(18, 2);

    SELECT
        @TongGiaTriCuoiCung = SUM(
            CASE
                -- Nếu IDSanPham tồn tại trong bảng @TongGiaTriTheoSanPham VÀ có TongGiaTri > 50tr
                WHEN EXISTS (SELECT 1 FROM @TongGiaTriTheoSanPham ts
                             WHERE ts.IDSanPham = dhl.IDSanPham AND ts.TongGiaTri > 50000000)
                THEN dhl.ThanhTien * 0.9 -- Thì giảm 10% (nhân với 0.9)
                ELSE dhl.ThanhTien -- Ngược lại giữ nguyên giá
            END
        )
    FROM @DonHangHopLe dhl;

    -- Trả về kết quả
    SELECT @TongGiaTriCuoiCung AS TongGiaTriCuoiCung;

END
GO

--============= BƯỚC 3: THỰC THI VÀ XEM KẾT QUẢ =============

EXEC usp_TinhGiaTriDonHangVoiKhuyenMai
    @IDKhachHang = 1,
    @NgayBatDau = '2025-07-01',
    @NgayKetThuc = '2025-07-31';
```

<div style='margin-bottom:16px'></div>

**Phân tích kết quả:**  
***Sản phẩm Màn hình Dell (ID 101):***
* Đơn hàng 1: 3 * 12,000,000 = 36,000,000
* Đơn hàng 2: 2 * 12,000,000 = 24,000,000
* Tổng giá trị: 36,000,000 + 24,000,000 = 60,000,000 VND.
* Vì 60,000,000 > 50,000,000, nên sản phẩm này ĐƯỢC GIẢM GIÁ 10%.
* Giá trị sau giảm: 60,000,000 * 0.9 = 54,000,000 VND.

***Sản phẩm Bàn phím cơ (ID 102):***
* Đơn hàng 1: 5 * 3,500,000 = 17,500,000
* Đơn hàng 2: 2 * 3,500,000 = 7,000,000
* Tổng giá trị: 17,500,000 + 7,000,000 = 24,500,000 VND.
* Vì 24,500,000 < 50,000,000, nên sản phẩm này KHÔNG ĐƯỢC GIẢM GIÁ.
* Giá trị sau giảm: 24,500,000 VND.

***Sản phẩm Laptop Gaming (ID 104):***
* Đơn hàng 1: 1 * 45,000,000 = 45,000,000 VND.
* Vì 45,000,000 < 50,000,000, nên sản phẩm này KHÔNG ĐƯỢC GIẢM GIÁ.
* Giá trị sau giảm: 45,000,000 VND.

***Tổng giá trị cuối cùng phải trả:***
* 54,000,000 (Màn hình) + 24,500,000 (Bàn phím) + 45,000,000 (Laptop) = 123,500,000 VND.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 6. Biến bảng VS Bảng tạm

**Dưới đây là bảng so sánh nhanh để bạn dễ dàng hình dung:**

| <small>**Tiêu chí**<small/> | <small>**Biến bảng (@table)**<small/> |  <small>**Bảng tạm (#table)**<small/> | 
|----------------------|----------------------|----------------------|
| <small>Phạm vi<small/> | <small>Chỉ trong batch, stored procedure, function hiện tại<small/> | <small>Tồn tại trong session hiện tại, có thể truy cập từ các nested procedure<small/> |
| <small>Transaction<small/> | <small>Ít bị ảnh hưởng bởi rollback của transaction<small/> |  <small>Các thay đổi trên bảng tạm sẽ bị rollback nếu transaction thất bại<small/> |
| <small>Index<small/> | <small>Có thể tạo `PRIMARY KEY`, `UNIQUE` constraint. Hỗ trợ inline index.<small/> |  <small>Có thể tạo tất cả các loại index như bảng thông thường<small/> |
| <small>Thống kê<small/> | <small>Không có<small/> | <small>Có<small/> |
| <small>Sử dụng trong Stored Procedure<small/> | <small>Ít gây recompile hơn<small/> | <small>Có thể gây recompile<small/> |
| <small>Thay đổi cấu trúc<small/> | <small>Không thể `ALTER TABLE`<small/> | <small>Có thể `ALTER TABLE`<small/> |
| <small>Lưu trữ<small/> | <small>`tempdb`<small/> | <small>`tempdb`<small/> |
{: style="width:100%; margin:16px 0"}


**Vậy khi nào nên chọn cái nào?**  

***Biến bảng:***
* Tập dữ liệu nhỏ. Đây là kịch bản lý tưởng nhất.
* Bạn không cần các chỉ mục phức tạp.
* Bạn muốn tránh việc recompile các stored procedure.
* Sử dụng bên trong các hàm (user-defined function), nơi mà bảng tạm không được phép tạo.

***Bảng tạm:***
* Tập dữ liệu lớn.
* Cần tạo nhiều chỉ mục để tối ưu hoá truy vấn phức tạp.
* Cần sử dụng dữ liệu tạm thời qua nhiều Stored Procedure khác nhau trong cùng một session.
* Cần thực hiện các thao tác DDL (Data Definition Language) như `ALTER TABLE`.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 7. Lời kết
Biến bảng là một công cụ vô cùng hữu ích trong "kho vũ khí" của một lập trình viên SQL Server. Hiểu rõ bản chất, cách sử dụng, cũng như ưu và nhược điểm của nó so với bảng tạm sẽ giúp bạn viết ra những đoạn mã T-SQL hiệu quả, tối ưu và dễ bảo trì hơn.




