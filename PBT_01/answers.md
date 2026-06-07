Đặng Thanh Hưởng - 66KTPM1

Phần A — KIỂM TRA ĐỌC HIỂU

Câu A1:
1. Các bước xảy ra khi gõ https://shopee.vn vào trình duyệt và nhấn Enter(Nguồn tham chiếu: File 01_introduction_html_universe.md, Phần "Cuộc Hành Trình 0.3 Giây Xuyên Đại Dương"):

-Request xuất phát từ laptop hoặc thiết bị đang dùng và đi qua router WiFi.

-Tín hiệu tiếp tục truyền qua nhà mạng VNPT và chạy xuyên qua hệ thống cáp quang.

-Request được gửi đến data center của Shopee.

-Server của Shopee tiếp nhận và xử lý yêu cầu.

-Server trả về kết quả, dữ liệu chạy ngược lại: đường cáp quang → VNPT → router và về lại thiết bị đang dùng.

-Trình duyệt nhận các file HTML, CSS, JS từ server: → render để hiển thị ra giao diện hoàn chỉnh

2. Thông tin trong tab Network của Chrome DevTools - (Nguồn tham chiếu: File 01_introduction_html_universe.md, Phần "4.3. Developer Tools (F12) — 'Kính hiển vi' cho website")

-Tab Network cho thấy các thông tin về requests và responses.

![Kết quả bài 1](screenshots/BaiA1.png)

Câu A2:

- Trang web trên bị Google đánh giá SEO thấp vì đoạn code đang lạm dụng thẻ "div" thay vì sử dụng các thẻ semantic phù hợp mục đích (04_visible_part_html.md, Phần "Semantic HTML5 — Bản đồ Semantic Elements")

- Việc sử dụng đúng thẻ semantic tương ứng với từng mục đích sẽ giúp Google hiểu rõ được nội dung cấu trúc của trang web, từ đó giúp tối ưu hóa SEO tốt hơn (04_visible_part_html.md, Phần "Trang Web Trống Rỗng Vs Trang Web Sống Động'")

Lỗi 1: Sử dụng (div class="header") cho phần đầu trang chứa logo và menu chính thay vì sử dụng thẻ "header" - (04_visible_part_html.md, Phần "Semantic HTML5 — Bản đồ Semantic Elements")

-Lỗi 2: Sử dụng (div class="menu") cho phần chứa các liên kết điều hướng thay vì sử dụng thẻ "nav" - (04_visible_part_html.md, Phần "Semantic HTML5 — Bản đồ Semantic Elements")

-Lỗi 3: Sử dụng (div class="main") để bọc toàn bộ vùng nội dung chính thay vì sử dụng thẻ "main" - (04_visible_part_html.md, Phần "Semantic HTML5 — Bản đồ Semantic Elements")

-Lỗi 4: Sử dụng (div class="product") cho một khối thông tin sản phẩm độc lập thay vì sử dụng thẻ "article" -  (04_visible_part_html.md, Phần "Bản đồ Semantic Elements")

-Lỗi 5: Sử dụng (div class="footer") cho phần thông tin bản quyền (copyright) ở cuối trang thay vì sử dụng thẻ "footer" -(04_visible_part_html.md, Phần "Semantic HTML5 — Bản đồ Semantic Elements")

-Sửa lại code: 
<header>
    <div class="logo">ShopTLU</div>
    <nav>
        <div><a href="/">Trang chủ</a></div>
        <div><a href="/products">Sản phẩm</a></div>
    </nav>
</header>
<main>
    <article>
        <div class="title">iPhone 16 Pro</div>
        <div class="price">25.990.000đ</div>
        <div class="image"><img src="iphone.jpg" loading="lazy"></div>
    </article>
</main>
<footer>© 2026 ShopTLU</footer>
 
 Câu A3: 
 hình vẽ 
 
 ![alt text](<screenshots/BaiA3.png>)

 Giải thích: Kết quả hiển thị trên được quyết định bởi đặc tính của hai loại thẻ HTML cơ bản là Block và Inline:

- Thẻ "div" là phần tử Block: Thẻ Block luôn chiếm cả dòng của trình duyệt
    +Do đó, mỗi khi khai báo "div" (Hộp 1, Hộp 2, Hộp 3), nội dung bên trong sẽ tự động bắt đầu ở một dòng mới và đẩy các phần tử phía sau xuống dòng tiếp theo
- Thẻ "span" và "strong" là phần tử Inline: Thẻ Inline chỉ chiếm nội dung
    +Vì vậy, Text A và Text B sẽ hiển thị nằm cạnh nhau trên cùng một dòng. Tương tự, Text C và Text D cũng sẽ tự động xếp liền kề nhau trên một dòng riêng biệt nằm giữa Hộp 2 và Hộp 3

Câu A4:
- Sự khác biệt giữa ba thẻ "thead", "tbody", "tfoot" nằm ở vai trò phân chia các khu vực cấu trúc của 1 bảng dữ liệu ( 05_tables_hyperlinks.md, Phần "Cấu trúc cơ bản"):
1. Thẻ "thead" đống vai trò là phần Header chuyên dùng để chứa các ô tiêu đề cột.
2. Thẻ "tbody" đóng vai trò là phần Body, là nơi chứa các hàng dữ liệu chính của bảng
3. Thẻ "tfoot" đóng vai trò phần Footer, được dùng để chứa thông tin tổng kết của bảng
- Không nên dùng table để tạo layout cho web vì:
    + Quy tắc của HTML bắt buộc thẻ "table" chỉ được dùng cho các nội dung dữ liệu dạng bảng
    + Việc dùng bảng để thiết kế layout trang web chỉ là cách làm cữ của ngày xưa và hiện tại việc này được đánh giá là sai
    + Hiện nay đã có nhứng công cụ chuyên dụng và hiện đại hơn để dàn trang là CSS Grid và Flexbox.

Phần B:

Câu B4: 

![alt text](<screenshots/Elements_TGĐ.png>)


1. Phân tích tab Elements 

- a. 3 thẻ semantic HTML5 được trang sử dụng:

    + `<header class="header v2024...">`: Nằm ở phần đầu của `<body>`, được sử dụng để chứa logo, thanh tìm kiếm và các thành phần điều hướng trên = cùng của trang.
    + `<footer class="footer v2024">`: Nằm ở phần cuối của `<body>`, dùng để chứa các thông tin bản quyền, địa chỉ liên hệ, và các liên kết chính sách của website.
    + `<h1>`: Thẻ tiêu đề chính 

- b. 2 thẻ không dùng đúng semantic 
    + `<div class="header-top-bar">`: Khối thẻ này chứa các liên kết điều hướng đầu trang. Thay vì dùng `<div>` mang tính chung chung, trang nên sử dụng thẻ `<nav>` để chuẩn semantic hơn cho một thanh điều hướng.
    + `<div class="body-home">`: Khối này đang đóng vai trò bao bọc toàn bộ nội dung chính của trang chủ. Sẽ chuẩn xác hơn về mặt ngữ nghĩa nếu sử dụng thẻ `<main>`.

2. Phân tích thẻ `<table>`

- `<table>` được sử dụng để hiển thị chi tiết "Thông số kỹ thuật/Cấu hình" của sản phẩm
- Trang có sử dụng thẻ `<tbody>` để nhóm các hàng chứa dữ liệu `<tr>` lại với nhau.
- Trang không sử dụng thẻ `<thead>`.

3. Phân tích thẻ `<form>`

 ![alt text](<screenshots/form.png>)

- Thẻ `<form>` này không có thuộc tính `action` và `method`.                
- Form này chỉ sử dụng duy nhất một loại là: `<input type="hidden">`.

PHẦN C — SUY LUẬN

Câu C1 (10đ) — Thiết kế cấu trúc HTML trang chi tiết sản phẩm

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iPhone 16 Pro — ShopTLU</title>
</head>
<body>

    <header> <!-- header vì đây là phần đầu trang, chứa logo và điều hướng chính -->
        <nav aria-label="navigation chính"> <!-- nav vì chứa các liên kết điều hướng chính -->
            <a href="/">ShopTLU</a>
            <a href="/products">Sản phẩm</a>
            <a href="/cart">Giỏ hàng</a>
        </nav>
    </header>

    <main> <!-- main vì đây là vùng nội dung chính, duy nhất trên trang -->

        <nav aria-label="breadcrumb"> <!-- nav vì breadcrumb là một dạng điều hướng phụ -->
            <ol> <!-- ol vì breadcrumb có thứ tự: trang chủ → danh mục → sản phẩm -->
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/phones">Điện thoại</a></li>
                <li aria-current="page">iPhone 16 Pro</li>
            </ol>
        </nav>

        <article> <!-- article vì trang chi tiết sản phẩm là nội dung độc lập, có thể tái sử dụng -->

            <section aria-label="Ảnh sản phẩm"> <!-- section nhóm khu vực ảnh, có label mô tả -->
                <figure> <!-- figure vì ảnh sản phẩm đi kèm figcaption mô tả -->
                    <img src="iphone16pro-1.jpg" alt="iPhone 16 Pro màu Titan Tự nhiên - mặt trước" loading="lazy">
                    <figcaption>iPhone 16 Pro — Titan Tự nhiên</figcaption>
                </figure>
                <figure>
                    <img src="iphone16pro-2.jpg" alt="iPhone 16 Pro - mặt sau với cụm camera 48MP" loading="lazy">
                    <figcaption>Cụm camera 48MP Fusion</figcaption>
                </figure>
                <!-- ... thêm 3 ảnh nữa ... -->
            </section>

            <section aria-label="Thông tin sản phẩm"> <!-- section nhóm thông tin: tên, giá, đánh giá -->
                <h1>iPhone 16 Pro</h1> <!-- h1 vì đây là tiêu đề chính của trang, chỉ có 1 h1 -->

                <p> <!-- p cho giá — đây là đoạn văn, không cần thẻ đặc biệt -->
                    <strong>25.990.000đ</strong> <!-- strong vì giá là thông tin quan trọng nhất -->
                </p>

                <p aria-label="Đánh giá sao"> <!-- p cho rating -->
                    ⭐⭐⭐⭐⭐ (4.9 / 5 — 1.234 đánh giá)
                </p>

                <p>Chip A18 Pro, Camera 48MP, Pin cả ngày, Titanium.</p> <!-- p cho mô tả ngắn -->
            </section>

            <section aria-label="Thông số kỹ thuật"> <!-- section riêng vì thông số là nhóm nội dung độc lập -->
                <h2>Thông số kỹ thuật</h2> <!-- h2 vì là tiêu đề cấp 2 trong article -->
                <table> <!-- table vì đây là dữ liệu dạng bảng: tên thông số — giá trị -->
                    <caption>Cấu hình chi tiết iPhone 16 Pro</caption> <!-- caption mô tả nội dung bảng cho accessibility -->
                    <thead>
                        <tr>
                            <th scope="col">Thông số</th>
                            <th scope="col">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Chip</td><td>Apple A18 Pro</td></tr>
                        <tr><td>RAM</td><td>8GB</td></tr>
                        <tr><td>Bộ nhớ</td><td>256GB / 512GB / 1TB</td></tr>
                        <tr><td>Màn hình</td><td>6.3" Super Retina XDR, 120Hz</td></tr>
                        <tr><td>Camera</td><td>48MP Fusion + 12MP Ultra Wide + 12MP Telephoto</td></tr>
                        <tr><td>Pin</td><td>~27 giờ phát video</td></tr>
                    </tbody>
                </table>
            </section>

            <section aria-label="Đánh giá khách hàng"> <!-- section riêng vì đây là nhóm nội dung bình luận -->
                <h2>Đánh giá từ khách hàng</h2>

                <article> <!-- article vì mỗi bình luận là nội dung độc lập, có thể hiển thị riêng -->
                    <header> <!-- header trong article chứa thông tin tác giả, ngày đăng -->
                        <strong>Nguyễn Văn A</strong>
                        <time datetime="2026-05-10">10 tháng 5, 2026</time>
                    </header>
                    <p>Máy đẹp, hiệu năng mạnh, camera xuất sắc!</p>
                </article>

                <article>
                    <header>
                        <strong>Trần Thị B</strong>
                        <time datetime="2026-05-15">15 tháng 5, 2026</time>
                    </header>
                    <p>Pin trâu hơn hẳn đời trước, rất hài lòng.</p>
                </article>
            </section>

        </article>

    </main>

    <aside aria-label="Sản phẩm tương tự"> <!-- aside vì đây là nội dung liên quan nhưng phụ, không phải trọng tâm -->
        <h2>Sản phẩm tương tự</h2>
        <article>
            <h3><a href="/products/samsung-s24">Samsung Galaxy S24</a></h3>
            <p><strong>22.990.000đ</strong></p>
        </article>
        <article>
            <h3><a href="/products/pixel9">Google Pixel 9</a></h3>
            <p><strong>19.990.000đ</strong></p>
        </article>
    </aside>

    <footer> <!-- footer cho toàn trang, chứa copyright và liên kết phụ -->
        <nav aria-label="Liên kết footer"> <!-- nav vì chứa liên kết điều hướng -->
            <a href="/policy">Chính sách</a>
            <a href="/contact">Liên hệ</a>
            <a href="/faq">FAQ</a>
        </nav>
        <p><small>&copy; 2026 ShopTLU. All rights reserved.</small></p>
    </footer>

</body>
</html>
```

**Giải thích lựa chọn thẻ tổng quan:**

- Dùng `<article>` bao toàn bộ nội dung sản phẩm vì trang chi tiết sản phẩm là nội dung độc lập (có thể xuất/nhúng sang trang khác mà vẫn có nghĩa).
- Dùng `<section>` để phân chia từng vùng chức năng bên trong article (ảnh / thông tin / thông số / bình luận), mỗi section có `aria-label` mô tả rõ.
- Dùng `<aside>` cho sản phẩm tương tự vì đây là nội dung phụ, bổ trợ, không phải nội dung chính của trang.
- Dùng `<article>` lồng trong section bình luận vì mỗi bình luận là nội dung độc lập có tác giả, ngày đăng, nội dung riêng.
- Dùng `<nav>` cho cả breadcrumb lẫn header vì cả hai đều là điều hướng, phân biệt bằng `aria-label`.

---

### Câu C2 (10đ) — Phản biện "dùng `<div>` cho mọi thứ"

Quan điểm của đồng nghiệp thoạt nhìn có vẻ tiết kiệm thời gian, nhưng thực tế lại tạo ra nhiều vấn đề kỹ thuật nghiêm trọng về lâu dài.

**Lý do kỹ thuật 1 — SEO (Tối ưu hóa công cụ tìm kiếm):**

Google crawler đọc HTML để hiểu cấu trúc nội dung trang web. Khi dùng `<h1>`, `<article>`, `<nav>`, `<main>`, crawler biết chính xác phần nào là tiêu đề chính, phần nào là nội dung bài viết, phần nào là điều hướng. Còn khi dùng toàn `<div class="header">`, `<div class="content">`, crawler chỉ thấy một loạt khối không có ý nghĩa — nó phải đoán, và đoán sai nghĩa là trang bị xếp hạng thấp hơn. Thực tế, Google đã công khai xác nhận rằng thẻ semantic như `<article>` và heading hierarchy giúp Googlebot hiểu nội dung trang tốt hơn đáng kể.

**Lý do kỹ thuật 2 — Accessibility (Khả năng tiếp cận):**

Người dùng khiếm thị sử dụng screen reader (phần mềm đọc màn hình như NVDA, JAWS). Screen reader dựa vào thẻ semantic để tạo "bản đồ trang" (document outline), cho phép người dùng nhảy thẳng đến `<main>`, `<nav>`, hay từng `<section>` bằng phím tắt. Nếu toàn bộ trang là `<div>`, screen reader không thể phân biệt được menu, nội dung chính hay chú thích — người dùng khiếm thị phải nghe đọc toàn bộ trang từ đầu đến cuối mới tìm được thứ cần. Đây không chỉ là bất tiện mà còn là vi phạm WCAG 2.1 — tiêu chuẩn accessibility bắt buộc của nhiều quốc gia.

**Ví dụ cụ thể chứng minh:**

Giả sử mình có đoạn navigation sau:

```html
<!-- Dùng div: screen reader không biết đây là navigation -->
<div class="nav">
    <div><a href="/">Trang chủ</a></div>
    <div><a href="/products">Sản phẩm</a></div>
</div>

<!-- Dùng nav: screen reader thông báo "navigation landmark" -->
<nav aria-label="navigation chính">
    <a href="/">Trang chủ</a>
    <a href="/products">Sản phẩm</a>
</nav>
```

Với `<nav>`, NVDA sẽ thông báo "navigation chính, danh sách 2 mục", người dùng khiếm thị biết ngay đây là menu và có thể skip qua bằng phím `D`. Với `<div>`, họ không biết đây là gì và không thể skip.

**Trường hợp `<div>` vẫn phù hợp:**

`<div>` hoàn toàn hợp lệ khi cần một container thuần CSS/layout mà không mang ý nghĩa ngữ nghĩa nào. Ví dụ: một `<div class="flex-container">` dùng để bố cục flexbox cho nhóm card, hay `<div class="overlay">` cho lớp phủ tối khi mở modal — đây là các container "vô nghĩa" thuần CSS, dùng `<div>` là đúng vì không có thẻ semantic nào phù hợp hơn. Nếu ép dùng thẻ khác (như `<section>`) cho những trường hợp này sẽ tạo ra cấu trúc sai ngữ nghĩa.

**Kết luận:** Semantic HTML không tốn thêm thời gian đáng kể khi đã quen, nhưng lợi ích mang lại — SEO tốt hơn, accessibility đúng chuẩn, code dễ đọc hơn cho cả người và máy — là không thể phủ nhận. Tiết kiệm vài phút hôm nay để lại khoản nợ kỹ thuật nghiêm trọng về sau.

---

Danh sách lỗi Bài B3 (debug.html)

```
Lỗi 1: Dòng 1 — <!DOCTYPE> thiếu "html"
Sửa: <!DOCTYPE html>

Lỗi 2: Dòng 2 — <html> thiếu thuộc tính lang
Sửa: <html lang="vi">

Lỗi 3: Dòng 4 — <title>Trang web không có thẻ đóng </title>
Sửa: <title>Trang web ShopTLU</title>

Lỗi 4: Dòng 5 — <meta charset="utf8"> sai giá trị (phải là "UTF-8")
Sửa: <meta charset="UTF-8">

Lỗi 5: Dòng 8 — <h1>Welcome to ShopTLU<h1> — thẻ đóng sai (thiếu dấu /)
Sửa: <h1>Welcome to ShopTLU</h1>

Lỗi 6: Dòng 11 — <a href="home"> — href thiếu dấu / (là relative path, trỏ sai)
Sửa: <a href="/home">

Lỗi 7: Dòng 11 — <a href="home">Trang chủ<a> — thẻ đóng sai (thiếu dấu /)
Sửa: <a href="/home">Trang chủ</a>

Lỗi 8: Dòng 18 — <img src=iphone.jpg> — src không có dấu nháy
Sửa: <img src="iphone.jpg" alt="iPhone 16 Pro">

Lỗi 9: Dòng 20 — <p>Giá: <b>25.990.000đ</p></b> — đóng thẻ sai thứ tự (b đóng sau p)
Sửa: <p>Giá: <b>25.990.000đ</b></p>

Lỗi 10: Dòng 31–35 — <table> không có <thead>, dùng <td> cho header thay vì <th>
Sửa: Thêm <thead><tr><th>Tên</th><th>Giá</th></tr></thead> và bọc dữ liệu trong <tbody>

Lỗi 11: Dòng 39 — Có 2 thẻ <main> — HTML chỉ cho phép 1 <main> trên 1 trang
Sửa: Đổi thẻ <main> thứ hai thành <aside>

Lỗi 12: Dòng 41 — <p>Copyright 2026 không đóng thẻ </p>
Sửa: <p>Copyright 2026</p>
```