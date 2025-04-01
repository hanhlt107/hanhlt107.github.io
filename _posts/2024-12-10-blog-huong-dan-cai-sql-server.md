---
layout: post
title: Hướng Dẫn Cài Đặt SQL Server Trên Windows
subtitle: Cách Cài Đặt Nhanh Chóng Và Hiệu Quả
cover-img: /assets/img/sql.bin
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
comments: true
---

## Giới Thiệu
<span>SQL Server là một hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mạnh mẽ do Microsoft phát triển. Bài viết này sẽ hướng dẫn bạn cách cài đặt SQL Server trên Windows một cách chi tiết và dễ hiểu.</span>

<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Yêu Cầu Hệ Thống 
Trước khi cài đặt, hãy đảm bảo máy tính của bạn đáp ứng các yêu cầu sau:  
* **Hệ điều hành:** Windows 10, Windows 11 hoặc Windows Server 2016 trở lên.
* **Bộ nhớ RAM:** Tối thiểu 4GB, khuyến nghị 8GB trở lên.  
* **Dung lượng ổ cứng:** Tối thiểu 6GB trống.
* **Vi xử lý:** Tối thiểu 1.4 GHz, hỗ trợ x64.  
<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Tải SQL Server
Truy cập trang web chính thức của Microsoft để tải SQL Server: 👉 [Tải SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)   
Có hai phiên bản phổ biến. Hãy chọn phiên bản phù hợp và tải xuống:  
* **SQL Server Express:** Miễn phí, phù hợp cho ứng dụng nhỏ.  
* **SQL Server Developer:** Miễn phí, đầy đủ tính năng cho mục đích phát triển.  

<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Cài Đặt SQL Server  
**Bước 1: Chạy Trình Cài Đặt**
* Mở tệp **SQLServer2019-SSEI-Dev.exe** (hoặc phiên bản tương ứng).  
* Chọn **Custom** để tùy chỉnh cài đặt hoặc **Basic** để cài đặt nhanh.
* Đọc và chấp nhận điều khoản sử dụng.  
    
**Bước 2: Chọn Đường Dẫn Cài Đặt**   
* Đặt vị trí cài đặt SQL Server.  
* Nhấn **Install** để bắt đầu quá trình cài đặt.

**Bước 3: Cấu Hình SQL Server**
* Sau khi cài đặt xong, mở **SSQL Server Installation Center.** 
* Chọn **New SQL Server stand-alone installation.**
* Chọn **Developer** hoặc **Express** theo phiên bản đã tải.
* Đặt tên cho instance hoặc sử dụng mặc định **(MSSQLSERVER).**
* Chọn chế độ xác thực:
* **Windows Authentication Mode:** Dùng tài khoản Windows để đăng nhập.
* **Mixed Mode:** Cho phép đăng nhập bằng cả tài khoản SQL Server (sa) và Windows.
    
**Bước 4: Hoàn Tất Cài Đặt**  
* Chờ quá trình cài đặt hoàn tất.  
* Nhấn **Close** để kết thúc.

<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Cài Đặt SQL Server Management Studio (SSMS) 
SSMS là công cụ giúp bạn quản lý cơ sở dữ liệu SQL Server dễ dàng.  
  
**Bước 1: Tải SSMS** 👉 [Tải SSMS](https://aka.ms/ssmsfullsetup)   

**Bước 2: Cài Đặt**  
* Chạy tệp vừa tải.  
* Nhấn **Install** và chờ cài đặt hoàn tất.
* Khởi động lại máy tính (nếu cần).

<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Kết Nối SQL Server 
Sau khi cài đặt, mở SQL Server Management Studio và thực hiện:  
* **Server name:** Nhập localhost hoặc MSSQLSERVER.
* **Authentication:** Chọn kiểu xác thực đã cài đặt.
* Nhấn **Connect** để truy cập SQL Server.

<div style="border: 1px solid #e6e6e6; margin:32px 0"></div>

## Lời Kết 
Bạn đã hoàn tất việc cài đặt SQL Server trên Windows! Bây giờ, bạn có thể bắt đầu tạo cơ sở dữ liệu và thực hiện các thao tác quản lý dữ liệu. Nếu có bất kỳ vấn đề nào, hãy kiểm tra lại các bước hoặc tìm kiếm trên Microsoft Docs.  
Chúc bạn thành công! 🚀