---
layout: post
title: TransactionSQL - Đảm Bảo Tính Toàn Vẹn Dữ Liệu Khi Xảy Ra Lỗi
subtitle: Làm chủ transaction để tránh mất mát dữ liệu và xử lý lỗi hiệu quả trong hệ quản trị cơ sở dữ liệu
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
comments: true
---

>Khi làm việc với cơ sở dữ liệu, nhất là trong các hệ thống lớn có liên quan đến nhiều bảng, thao tác cập nhật hoặc xoá dữ liệu thường rất phức tạp. Một sai sót nhỏ có thể làm dữ liệu trở nên không đồng nhất. **Transaction** trong SQL chính là “tấm khiên” giúp bạn tránh khỏi điều đó.

<div style="border: 1px solid #e6e6e6; margin:48px 0"></div>

### Transaction là gì?
**Transaction** (giao dịch) là một tập hợp các thao tác SQL được nhóm lại và thực hiện như **một đơn vị duy nhất**. Nếu một phần trong transaction thất bại, toàn bộ giao dịch sẽ bị huỷ và dữ liệu được khôi phục về trạng thái ban đầu.

>✨ **"Tất cả hoặc không gì cả" – Một transaction phải được thực hiện hoàn chỉnh, hoặc không thực hiện gì cả.**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Tại sao cần sử dụng Transaction?  
Transaction giúp:

* **Đảm bảo dữ liệu chuẩn:** Nếu có lỗi xảy ra, dữ liệu sẽ được khôi phục về trạng thái ban đầu, như chưa từng thay đổi.

* **Tránh mất mát dữ liệu:** Nếu một phần trong chuỗi thao tác thất bại, toàn bộ giao dịch bị huỷ.

* **Đảm bảo tính nhất quán của hệ thống.**

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Ưu điểm của Transaction
* **Rollback dễ dàng:** Khôi phục dữ liệu nhanh chóng nếu có lỗi.

* **Đảm bảo toàn vẹn dữ liệu:** Không gây mất mát dữ liệu quan trọng.

* **Quản lý tốt các thao tác phức tạp:** Rất hiệu quả khi nhiều bảng liên quan lẫn nhau.

* **Tăng độ tin cậy hệ thống:** Người dùng không phải lo về lỗi nửa chừng.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Nhược điểm của Transaction
* **Cần viết cẩn thận:** Sai sót trong logic có thể làm giao dịch rollback không đúng cách.

* **Tốn tài nguyên:** Các giao dịch kéo dài lâu sẽ chiếm tài nguyên hệ thống.

* **Có thể gây deadlock:** Nếu nhiều giao dịch tranh chấp tài nguyên cùng lúc.

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Ví dụ cụ thể
Giả sử bạn có một lớp học gồm 2 sinh viên. Khi muốn xoá lớp học đó, bạn cần đảm bảo rằng **không còn sinh viên nào thuộc lớp đó**. Nếu còn, hệ thống sẽ báo lỗi và huỷ bỏ toàn bộ giao dịch xoá để đảm bảo không có sinh viên bị mất dữ liệu.

**Câu lệnh mẫu:**
```
begin transaction tran_xoa_lop_va_sinh_vien
begin try
    delete from sinh_vien where ma_sinh_vien = 1
    delete from lop where ma_lop = 1
    delete from sinh_vien where ma_sinh_vien = 2
    commit
end try
begin catch
    print N'Không xoá được'
    rollback
end catch
```
<div style="margin:24px 0"></div>

**Giải thích:**
* **Bước 1:** Xoá sinh viên có mã `1`.

* **Bước 2:** Xoá lớp có mã `1`. Tuy nhiên, do còn sinh viên mã `2` thuộc lớp này nên thao tác xoá lớp **thất bại**.

* **Bước 3:** Vì có lỗi xảy ra, hệ thống chuyển sang `catch`, hiển thị `"Không xoá được"` và thực hiện `rollback` — khôi phục lại trạng thái ban đầu (cả hai sinh viên vẫn còn, lớp vẫn còn).

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### Kết luận
**Transaction** là công cụ quan trọng giúp đảm bảo dữ liệu nhất quán và an toàn khi xảy ra lỗi. Dù đơn giản hay phức tạp, hãy luôn dùng transaction khi thao tác với nhiều bảng để tránh rủi ro không mong muốn.
> **💡 Hãy luôn nhớ: "Có thể chưa cần transaction hôm nay, nhưng khi xảy ra sự cố – bạn sẽ ước mình đã dùng nó sớm hơn!"**


