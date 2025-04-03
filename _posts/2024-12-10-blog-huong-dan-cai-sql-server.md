---
layout: post
title: Hướng Dẫn Cài Đặt SQL Server
subtitle: 📌 Học Cách Cài Đặt SQL Server Đúng Chuẩn Chỉ Trong 5 Phút!
cover-img: /assets/img/sql.bin
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
comments: true
---

### 🔥 Giới Thiệu
**SQL Server** là hệ quản trị cơ sở dữ liệu quan hệ **(RDBMS)** mạnh mẽ của Microsoft, giúp lưu trữ và xử lý dữ liệu cho các ứng dụng lớn. Nếu bạn muốn học lập trình, phát triển phần mềm hoặc quản lý dữ liệu, **việc cài đặt SQL Server là bước đầu tiên quan trọng.**

Bài viết này sẽ hướng dẫn bạn từ **A** đến **Z** cách cài đặt SQL Server trên Windows **một cách dễ dàng và nhanh chóng!**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 📌 1. Yêu Cầu Hệ Thống
💡 _Kiểm tra trước khi cài đặt để tránh lỗi không mong muốn!_

🔹 **Cấu Hình Tối Thiểu**  
✅ **Hệ điều hành:** Windows 10, Windows 11, Windows Server 2016 trở lên.  
✅ **RAM:** Tối thiểu **4GB** (khuyến nghị 8GB trở lên).  
✅ **Ổ cứng**: Ít nhất **10GB** trống (khuyến nghị SSD).  
✅ **Bộ xử lý:** CPU **64-bit**, từ **1.4 GHz** trở lên.  

📌 _Nếu máy bạn quá yếu, hãy thử dùng SQL Server trên môi trường Cloud như Azure hoặc Docker!_

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🚀 2. Tải SQL Server Miễn Phí
💡 _Có 2 phiên bản miễn phí, bạn nên chọn bản phù hợp!_

🔗 Tải SQL Server tại đây:  
👉 [https://www.microsoft.com/en-us/sql-server/sql-server-downloads](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

| <small>**Phiên bản**</small>               | <small>**Mô tả**</small>                                             | <small>**Ai nên dùng?**</small>                 |
|-------------------------|--------------------------------------------------|------------------------------|
| <small>**SQL Server Express**</small>  | <small>Nhẹ, giới hạn tài nguyên, miễn phí vĩnh viễn.</small>   | <small>Học tập, dự án nhỏ.</small>          |
| <small>**SQL Server Developer**</small> | <small>Đầy đủ tính năng như bản Enterprise, miễn phí.</small> | <small>Lập trình viên, nghiên cứu.</small> |  
  
<div style="margin-top:16px"></div>

📌 _Khuyên dùng bản **Developer** nếu bạn muốn trải nghiệm đầy đủ tính năng!_

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🛠 3. Cách Cài Đặt SQL Server
💡 _Chỉ cần làm theo hướng dẫn từng bước dưới đây!_

🔹 **Bước 1: Chạy Trình Cài Đặt**  
Sau khi tải xong file **SQLServer2022-SSEI-Expr.exe** hoặc **SQLServer2022-SSEI-Dev.exe**, mở nó lên.

Bạn sẽ thấy **3 lựa chọn cài đặt:**  
1️⃣ **Basic** – Cài đặt nhanh với cấu hình mặc định (khuyên dùng).  
2️⃣ **Custom** – Cho phép tùy chỉnh nhiều thiết lập hơn.  
3️⃣ **Download Media** – Tải file ISO để cài đặt sau.  

📌 _Chọn **Basic** nếu bạn là người mới!_

🔹 **Bước 2: Đồng Ý Điều Khoản & Cài Đặt**
* Nhấn **Accept** để đồng ý điều khoản.

* Chọn vị trí cài đặt hoặc giữ mặc định.

* Nhấn **Install** và chờ quá trình hoàn tất (~10 phút).

🔹 **Bước 3: Cấu Hình SQL Server**
Sau khi cài đặt xong, nhấn **Customize** để tùy chỉnh:

* **Chế độ xác thực:**

  * 🔹 _Windows Authentication Mode_ – Dùng tài khoản Windows (khuyên dùng).

  * 🔹 _Mixed Mode_ – Dùng cả Windows và tài khoản SQL Server (cần đặt mật khẩu).

* **Thêm tài khoản quản trị:** Nhấn **Add Current User** để đặt tài khoản admin.

🎉 **Hoàn tất!** SQL Server đã sẵn sàng hoạt động!

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🖥 4. Cài Đặt SQL Server Management Studio (SSMS)
💡 _SSMS giúp bạn dễ dàng quản lý SQL Server với giao diện trực quan!_

🔗 **Tải SSMS tại đây:**  
👉 [https://aka.ms/ssmsfullsetup](https://aka.ms/ssmsfullsetup)

🔹 **Cách Cài Đặt SSMS**  
1️⃣ Chạy file **SSMS-Setup-ENU.exe.**  
2️⃣ Nhấn **Next** và chọn nơi cài đặt.  
3️⃣ Nhấn **Install** và chờ hoàn tất (~5-10 phút).  

📌 _Sau khi cài xong, mở **SSMS**, nhập **Server Name** là ```localhost``` hoặc ```.\SQLEXPRESS```, rồi nhấn **Connect!**_

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🎯 5. Kiểm Tra SQL Server Sau Khi Cài Đặt
💡 _Đảm bảo SQL Server đã hoạt động đúng cách!_

🔹 **Cách Kiểm Tra SQL Server**   
✅ Mở **SQL Server Configuration Manag**er (tìm trong Start Menu).   
✅ Kiểm tra **SQL Server Services** → Nếu **SQL Server (MSSQLSERVER)** đang chạy, nghĩa là thành công.   
✅ Mở **SSMS**, kết nối với SQL Server, chạy thử lệnh:  

```SELECT 'Chào mừng bạn đến với SQL Server!';```

🎉 Nếu thấy kết quả, chúc mừng bạn đã cài đặt thành công!

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🔥 6. Lời Khuyên Khi Cài SQL Server 
💡 _Một số mẹo giúp bạn tránh lỗi thường gặp!_

✅ **Nếu gặp lỗi cài đặt**, hãy kiểm tra:

* **Windows Update** đã được cập nhật chưa?

* **.NET Framework 4.8** đã có trên máy chưa?

* **Tắt phần mềm diệt virus** có thể gây cản trở cài đặt.

✅ **Nếu SQL Server không chạy**, thử:

Mở **Services** và kiểm tra **SQL Server (MSSQLSERVER)** đã khởi động chưa.

Chạy SSMS với quyền **Administrator**.

Dùng ```localhost``` thay vì ```.\SQLEXPRESS``` khi kết nối.

📌 _Nếu vẫn gặp lỗi, để lại bình luận nhé!_

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🎯 Kết Luận
Chỉ với **vài bước đơn giản**, bạn đã cài đặt thành công **SQL Server** và **SQL Server Management Studio (SSMS)**! 🎉

🚀 Giờ đây, bạn có thể bắt đầu học SQL, thiết kế cơ sở dữ liệu, hoặc xây dựng ứng dụng với SQL Server. Hãy thử tạo **bảng dữ liệu đầu tiên** và thực hành các truy vấn SQL ngay!
