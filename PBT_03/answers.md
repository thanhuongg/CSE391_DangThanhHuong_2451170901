PHẦN A — KIỂM TRA ĐỌC HIỂU (25 điểm)

1. Inline CSS
Cách này nhúng trực tiếp các quy tắc CSS vào trong thuộc tính style của từng thẻ HTML cụ thể.  

- Ví dụ:`<h1 style="color: #2563eb; font-size: 32px;">Tiêu đề màu xanh</h1>`
- Ưu điểm: Có tính ưu tiên cao nhất, hữu ích khi cần ghi đè tạm thời hoặc sửa lỗi khẩn cấp.  

- Nhược điểm: Không thể tái sử dụng code, làm file HTML trở nên cồng kềnh, khó bảo trì và không được trình duyệt lưu vào bộ nhớ đệm.  

- Khi nào nên dùng: Chỉ dùng cho các trường hợp khẩn cấp, chỉnh sửa nhanh một element duy nhất hoặc khi viết email HTML.  

2. Internal CSS
CSS được viết tập trung trong thẻ `<style>`, thường đặt trong phần `<head>` của tệp HTML.
- Ví dụ:
```html
<head>
        <style>
            h1 { color: #2563eb; font-size: 32px; }
        </style>
    </head>
```
- Ưu điểm: Quản lý tập trung các style của một trang web duy nhất tại một chỗ, không cần tạo file riêng
- Nhược điểm: Chỉ có tác dụng cho trang hiện tại, không thể chia sẻ style cho các trang khác trong cùng website
- Khi nào nên dùng: Phù hợp cho các bản mẫu  hoặc các trang web đơn
3. External CSS
Đây là cách chuẩn nhất trong thực tế. Toàn bộ CSS được viết trong một file riêng (đuôi `.css`) và liên kết vào HTML qua thẻ `<link>`

- Ví dụ:  Trong file HTML:`<link rel="stylesheet" href="styles.css">`
        Trong file styles.css:* `h1 { color: #2563eb; font-size: 32px; }`
- Ưu điểm:Tái sử dụng được cho nhiều trang, dễ bảo trì, giúp trang tải nhanh hơn nhờ cơ chế lưu bộ nhớ đệm của trình duyệt
- Nhược điểm: Phải tốn thêm một yêu cầu HTTP để tải file CSS về trong lần đầu tiên truy cập.
- Khi nào nên dùng: Dùng cho mọi dự án thực tế và chuyên nghiệp


Câu 2: 
1. h1   → Chọn: ShopTLU

2. .price   → Chọn: 25.990.000đ và 45.990.000đ

3. #app header   → Chọn: Toàn bộ nội dung bên trong thẻ `<header>` (bao gồm: ShopTLU, Home, Products, About)

4. nav a:first-child   → Chọn: Home

5. .product.featured h2    → Chọn: MacBook Pro

6. article > p     → Chọn: 25.990.000đ, Mô tả sản phẩm... (của iPhone 16) và 45.990.000đ, Mô tả sản phẩm... (của MacBook Pro)

7. a[href="/"]     → Chọn: Home

8. .top-bar.dark h1    → Chọn: ShopTLU
![alt text](screenshot/image.png)



Câu 3:

#### Trường hợp 1: `content-box` (mặc định)

```css
.box-1 {
    width: 400px;    
    padding: 20px;    
    border: 5px solid;
    margin: 10px; 
}
```

```
Chiều rộng hiển thị  = width + padding×2 + border×2
                     = 400 + 40 + 10
                    = 450px

Không gian chiếm trên trang = visible width + margin×2
                            = 450 + 20
                            = 470px
```

#### Trường hợp 2: `border-box`

```css
.box-2 {
    box-sizing: border-box;
    width: 400px;    
    padding: 20px;
    border: 5px solid;
    margin: 10px;
}
```

```
Chiều rộng hiển thị = 400px 

Kích thước content thực tế  = 400 - padding×2 - border×2
                             = 400 - 40 - 10
                             = 350px

Không gian chiếm trên trang = 400 + margin×2
                             = 400 + 20
                             = 420px
```

#### Trường hợp 3: Margin Collapse

```css
.box-a { margin-bottom: 25px; }
.box-b { margin-top: 40px; }
```

```
Khoảng cách giữa box-a và box-b = 40px
```

câu 4:

1. Tính Specificity Score (a, b, c)

| Rule | Selector | ID (a) | Class (b) | Type (c) | Specificity Score |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Rule A| `p` | 0 | 0 | 1 | `(0, 0, 1)`|
| Rule B| `.price` | 0 | 1 | 0 | `(0, 1, 0)`|
| Rule C| `#main-price` | 1 | 0 | 0 |`(1, 0, 0)`|
| Rule D| `p.price` | 0 | 1 | 1 | `(0, 1, 1)`|

2. Element sẽ có màu đỏ.

- Giải thích: Trình duyệt so sánh điểm số từ trái sang phải (ID -> Class -> Type).Rule C có 1 ID (a=1), trong khi các Rule khác đều có a=0. Vì ID có trọng số cao nhất trong các bộ chọn CSS, nên Rule C sẽ chiến thắng bất kể các rule khác có bao nhiêu Class hay Tag đi chăng nữa.

3. Element sẽ có màu cam.

- Giải thích: Inline style có độ ưu tiên cao hơn tất cả các bộ chọn nằm trong file CSS bên ngoài hoặc trong thẻ `<style>`. Điểm số của nó có thể coi là (1, 0, 0, 0) nếu tính thêm cột thứ 4 ở phía trước ID.

4. Element sẽ có màu đen.

- Giải thích: Mặc dù Rule A (p) có specificity thấp nhất (0, 0, 1), nhưng từ khóa !important không thuộc về thang đo specificity thông thường.!important là một "phá vỡ quy tắc". Khi được sử dụng, nó sẽ ghi đè lên tất cả các khai báo khác, bao gồm cả ID selector và thậm chí là Inline style.


PHẦN C — DEBUG & SUY LUẬN (20 điểm)


### Câu C1 — Debug `debug_layout.html` (3 lỗi tìm được)

**Lỗi 1: Tổng chiều rộng vượt container**
```css
/* Lỗi: */
.sidebar { width: 300px; padding: 20px; border: 1px solid; float: left; }
.content { width: 660px; padding: 30px; border: 1px solid; float: left; }
/* Thực tế: 342px + 722px = 1064px > 1000px → content bị xuống dòng */

/* Sửa — Cách 1: box-sizing */
.sidebar { box-sizing: border-box; width: 300px; padding: 20px; border: 1px solid; float: left; }
.content { box-sizing: border-box; width: 660px; padding: 30px; border: 1px solid; float: left; }
```

**Lỗi 2: Container không bọc được float children**
```css
/* Lỗi: sidebar và content đều float left → container có height = 0 */
.container { width: 1000px; }  /* không có clearfix */

/* Sửa — thêm clearfix: */
.container::after { content: ""; display: table; clear: both; }
/* Hoặc dùng: overflow: hidden; trên .container */
```

**Lỗi 3: `position: relative` thiếu trên container của element `position: absolute`**
```css
/* Lỗi: .badge dùng position: absolute nhưng container không có position: relative */
.card { width: 200px; }              /* không có position */
.badge { position: absolute; top: 0; right: 0; }  /* absolute so với viewport! */

/* Sửa: */
.card { width: 200px; position: relative; }
.badge { position: absolute; top: 0; right: 0; }
```

---

### Câu C2 — Cascade Puzzle — Dự đoán màu cuối cùng

**Code CSS gốc:**
```css
.card        { color: blue; }
.card .title { font-size: 20px; }
.highlight   { color: green !important; }
#featured    { border: 2px solid gold; }
.card p      { color: inherit; }
```

**Phân tích từng element:**

| Element | Selector nào match | Specificity | Màu cuối |
|---|---|---|---|
| `h2.title.highlight` trong `#featured` | `.highlight { color: green !important }` | !important vô địch | 🟢 **green** |
| `p` (không có class) trong `#featured` | `.card p { color: inherit }` → inherit từ `.card { color: blue }` | (0,1,1) | 🔵 **blue** |
| `h2.title` trong `.card` thứ 2 | `.card .title` không set color → kế thừa `.card { color: blue }` | (0,1,1) | 🔵 **blue** |
| `p.highlight` trong `.card` thứ 2 | `.highlight { color: green !important }` | !important | 🟢 **green** |

**Bài học từ Cascade Puzzle:**
- `!important` thắng tất cả, kể cả ID selector (specificity 1,0,0).
- `color: inherit` không phải "không có màu" — nó chủ động lấy màu từ element cha.
- Khi không có color được set trực tiếp, element kế thừa (inherit) màu từ cha gần nhất.
