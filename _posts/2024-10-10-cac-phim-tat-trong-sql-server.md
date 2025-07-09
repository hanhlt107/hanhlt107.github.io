---
layout: post
title: Phím Tắt Hữu ích Trong SQL Server Management Studio (SSMS)
subtitle: 🎯 Làm Việc Thông Minh Hơn, Nhanh Hơn Với SSMS
cover-img: /assets/img/code-sql.jpg
thumbnail-img: /assets/img/sql-thumb.png
share-img: /assets/img/sql.bin
tags: [books, blogs, SQL Server]
comments: true
---

### Giới thiệu
Nếu bạn là một nhà phát triển SQL hoặc quản trị viên cơ sở dữ liệu (**DBA**), chắc chắn bạn hiểu rằng **tốc độ và hiệu suất** là yếu tố quan trọng. SQL Server Management Studio (**SSMS**) cung cấp nhiều **phím tắt hữu ích** giúp bạn làm việc nhanh hơn, chuyên nghiệp hơn và giảm thiểu thao tác thừa. Dưới đây là những phím tắt quan trọng nhất mà bạn không thể bỏ qua!

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🚀 1. Mở nhanh cửa sổ truy vấn mới
* **Ctrl + N** – Tạo ngay một cửa sổ Query Editor mới để viết câu lệnh SQL.  

![mo-cua-so-moi](/assets/img/mo-cua-so-moi.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🔄 2. Chuyển đổi giữa các cửa sổ SQL
* **Ctrl + Tab** – Dễ dàng chuyển đổi giữa các cửa sổ làm việc mà không cần dùng chuột.

![cua-so-lam-viec](/assets/img/cua-so-lam-viec.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 📊 3. Ẩn/Hiện kết quả truy vấn
* **Ctrl + R** – Tăng không gian làm việc bằng cách ẩn hoặc hiển thị kết quả truy vấn nhanh chóng.

![an-ket-qua](/assets/img/an-ket-qua.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### ⚡ 4. Chạy và dừng truy vấn nhanh hơn
* **F5** – Chạy (Execute) toàn bộ truy vấn.

* **Ctrl + E** – Chạy truy vấn đang chọn.

* **Alt + X** – Một cách khác để chạy truy vấn.

* **Ctrl + Break** – Dừng truy vấn ngay lập tức khi cần thiết.

![chay-tung-cau-lenh](/assets/img/chay-tung-cau-lenh.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### ❌ 5. Hủy bỏ truy vấn đang chạy
* **Alt + Break** hoặc **Alt + Scroll Lock** – Hủy truy vấn khi mất quá nhiều thời gian để xử lý.

![huy-bo-query-chay](/assets/img/huy-bo-query-chay.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### ✍️ 6. Định dạng văn bản SQL
* **Ctrl + Shift + U** – Chuyển văn bản thành CHỮ HOA.

* **Ctrl + Shift + L** – Chuyển văn bản thành chữ thường.

![viet-hoa-thuong](/assets/img/viet-hoa-thuong.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🔍 7. Xem kế hoạch thực thi truy vấn
* **Ctrl + L** – Hiển thị kế hoạch thực thi giúp tối ưu hóa truy vấn.

* **Ctrl + M** – Xem chi tiết về hiệu suất của truy vấn khi chạy.

![hien-thi-ket-qua-va-qua-trinh](/assets/img/hien-thi-ket-qua-va-qua-trinh.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🤖 8. Gợi ý mã lệnh SQL thông minh
* **Ctrl + Space** hoặc **Tab** – Gợi ý nhanh lệnh SQL, tên bảng, cột, giúp giảm lỗi nhập liệu.

![goi-y](/assets/img/goi-y.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### ⏩ 9. Di chuyển nhanh đến dòng mong muốn
* **Ctrl + G** – Nhập số dòng và nhảy đến đó ngay lập tức.

![chuyen-dong](/assets/img/chuyen-dong.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 📝 10. Comment và bỏ comment nhanh chóng
* **Ctrl + K + C** – Comment nhiều dòng hoặc đoạn code SQL.

* **Ctrl + K + U** – Bỏ comment dễ dàng chỉ với một thao tác.

![comment](/assets/img/comment.gif){: style="width: 100%"}

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### ✨ 10. Thực Hành Ngay
<div id="editor" style="height: 300px; margin-top:24px; box-shadow: 0px 0px 10px 0px #00000019; background: #f4f4f4;"></div>
<button onclick="runSQL()" style="margin-top: 10px;background-color: #2ea44f;border-color: #1b1f2326; outline:none; box-shadow: 0 1px 0 #1b1f231a, inset 0 1px 0 #ffffff08; color: #fff; border-radius:4px;">Execute</button>
<pre id="sql-output" style="display: none; background: #f4f4f4; padding: 10px; margin-top: 10px;"></pre>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.1/min/vs/loader.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>
<script>
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.32.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
    window.editor = monaco.editor.create(document.getElementById('editor'), {
        value: "SELECT 'Hello, SQL!';",
        language: 'sql',
        theme: 'vs-light'
    });

    document.getElementById('editor').style.backgroundColor = '#f4f4f4';
});

async function runSQL() {
    const SQL = await initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}` });
    const db = new SQL.Database();
    const input = window.editor.getValue();
    let resultText = '';

    try {
        const result = db.exec(input);
        if (result.length > 0) {
            resultText += 'Kết quả:\n';
            result.forEach(queryResult => {
                const columns = queryResult.columns;
                const values = queryResult.values;
                resultText += 'Columns: ' + columns.join(', ') + '\n';
                values.forEach(row => {
                    resultText += row.join(', ') + '\n';
                });
            });
            document.getElementById("sql-output").style.display = "block";
        } else {
            document.getElementById("sql-output").style.display = "none";
        }
    } catch (e) {
        resultText = 'Lỗi: ' + e.message;
        document.getElementById("sql-output").style.display = "block";
    }

    document.getElementById("sql-output").innerText = resultText;
}
</script>

<div style="border: 1px solid #e6e6e6; margin:64px 0"></div>

### 🎯 Tổng kết
Nắm vững các **phím tắt trong SQL Server Management Studio (SSMS)** sẽ giúp bạn **làm việc nhanh hơn, hiệu quả hơn và chuyên nghiệp hơn.** Hãy thử áp dụng ngay hôm nay và tận hưởng sự khác biệt!

💡 **Mẹo:** Nếu bạn mới làm quen với SQL, hãy bắt đầu bằng cách sử dụng một số phím tắt quan trọng như **Ctrl + N**, **F5**, **Ctrl + R**, và **Ctrl + Space**. Dần dần, bạn sẽ thành thạo hơn và tăng tốc đáng kể công việc của mình!

🚀 **Bạn có mẹo hay nào khác? Hãy chia sẻ ngay trong phần bình luận!**

