Đặng Thanh Hưởng - 66KTPM1

PHẦN A — KIỂM TRA ĐỌC HIỂU

Câu A1:

1. type="email" → Ô nhập text, tự kiểm tra có @ → Dùng cho form đăng ký
2. type="text" → Ô nhập văn bản thường → Dùng nhập tên, địa chỉ
3. type="password" → Ô nhập ẩn ký tự → Dùng nhập mật khẩu
4. type="number" → Ô nhập số có nút ± → Dùng chọn số lượng sản phẩm
5. type="tel" → Ô nhập số, mở bàn phím số trên mobile → Dùng nhập SĐT
6. type="date" → Ô chọn ngày (calendar) → Dùng nhập ngày sinh
7. type="search" → Ô nhập có nút xóa nhanh → Dùng làm thanh tìm kiếm
8. type="checkbox" → Ô tick chọn nhiều → Dùng đồng ý điều khoản
9. type="radio" → Chọn 1 trong nhiều → Dùng chọn giới tính / thanh toán
10. type="file" → Tải file từ máy → Dùng upload ảnh/video

Câu A2:
- Trường hợp 1: { input type="text" required value="" }

    + Dự đoán: Trình duyệt sẽ chặn submit form và hiển thị popup cảnh báo yêu cầu người dùng điền thông tin (ví dụ: "Please fill out this field")

    + Giải thích: Thuộc tính required quy định đây là trường dữ liệu bắt buộc.Vì người dùng để trống (value=""), form không thỏa mãn điều kiện và báo lỗi

- Trường hợp 2: {input type="email" value="abc"}
    + Dự đoán: Trình duyệt sẽ chặn submit và báo lỗi định dạng thiếu ký tự @

    + Giải thích: Khi sử dụng type="email", HTML5 sẽ tự động kiểm tra định dạng dữ liệu đầu vào xem có chứa ký tự @ hay không. Chuỗi "abc" không phải là một email hợp lệ nên không thể vượt qua bước kiểm tra này

- Trường hợp 3: { input type="number" min="1" max="10" value="15" }
    + Dự đoán: Trình duyệt sẽ chặn submit và thông báo lỗi giá trị nhập vào quá lớn (vượt quá mức cho phép).
    + Giải thích: type="number" tự động kiểm tra giới hạn giá trị dựa trên các thuộc tính min và max.Ở đây, giới hạn tối đa max="10", nhưng người dùng lại nhập giá trị 15 (lớn hơn 10) nên form bị báo lỗi.

- Trường hợp 4: { input type="text" pattern="{10}" value="abc123" }
    + Dự đoán: Trình duyệt sẽ chặn submit và báo lỗi dữ liệu nhập vào không khớp với định dạng yêu cầu.
    + Giải thích: Thuộc tính pattern sử dụng biểu thức regex để xác thực dữ liệu.Biểu thức {10} yêu cầu chuỗi nhập vào phải bao gồm chính xác 10 chữ số. Chuỗi "abc123" chứa ký tự chữ và chỉ có 6 ký tự nên vi phạm quy tắc này.

- Trường hợp 5: { input type="password" minlength="8" value="123" }
    + Dự đoán: Trình duyệt sẽ chặn submit và thông báo yêu cầu người dùng nhập chuỗi dài hơn.
    + Giải thích: Thuộc tính minlength="8" bắt buộc người dùng phải nhập mật khẩu có độ dài tối thiểu là 8 ký tự. Chuỗi "123" chỉ có 3 ký tự nên đã bị HTML5 validation chặn lại.

Câu A3: 
1. Việc dùng { label for="email" } kết nối chuẩn xác với thẻ { input id="email" } là bắt buộc vì nếu thiếu sự ghép nối này, người dùng screen reader sẽ chỉ nghe thấy thông báo chung chung là "edit text" mà không hề biết ô đó yêu cầu nhập dữ liệu gì.Việc gắn đúng for với id giúp trình đọc màn hình nhận diện được nhãn thuộc về ô nhập liệu nào; thiếu nó, người khiếm thị sẽ không thể sử dụng được form của bạn
2. Cặp thẻ "fieldset" và "legend" là cách chuẩn xác nhất để nhóm các radio buttons hoặc checkboxes có liên quan mật thiết với nhau.  
Ví dụ cụ thể: Khi tạo phần chọn giới tính trong form đăng ký,sử dụng "fieldset" để bao bọc toàn bộ các lựa chọn (Nam / Nữ / Khác), và dùng thẻ "legend" để đặt tiêu đề chung "Giới tính" cho cả nhóm đó

Câu A4 (5đ) — Media

1. Thuộc tính `loading="lazy"` trên thẻ `<img>`**

`loading="lazy"` yêu cầu trình duyệt **trì hoãn tải ảnh** cho đến khi ảnh gần xuất hiện trong viewport (vùng nhìn thấy của người dùng). Thay vì tải tất cả ảnh ngay khi trang load, trình duyệt chỉ tải ảnh "near-viewport" trước.

Cải thiện:
- Giảm băng thông cần thiết cho lần tải đầu tiên.
- Tăng tốc độ tải trang (đặc biệt trang có nhiều ảnh như trang sản phẩm).
- Tiết kiệm data cho người dùng mobile.

Khi nào KHÔNG nên dùng:
- Ảnh above-the-fold (ảnh hiển thị ngay khi trang load, không cần scroll) — tuyệt đối không dùng `loading="lazy"` vì trình duyệt sẽ trì hoãn tải ảnh mà người dùng đang cần xem ngay, gây "hổng ảnh" trong vài giây đầu.
- Ảnh trong `<noscript>` — lazy loading cần JavaScript để hoạt động.
- Ảnh logo, hero banner — đây là ảnh quan trọng hiển thị ngay.

2. Tại sao nên cung cấp nhiều `<source>` trong `<video>`?

Mỗi trình duyệt hỗ trợ các format video khác nhau. Bằng cách cung cấp nhiều `<source>`, trình duyệt sẽ chọn format đầu tiên mà nó hỗ trợ:

```html
<video controls>
    <source src="video.webm" type="video/webm">  <!-- Chrome, Firefox, Edge -->
    <source src="video.mp4" type="video/mp4">    <!-- Phổ biến nhất, Safari hỗ trợ -->
    <source src="video.ogv" type="video/ogg">    <!-- Firefox cũ -->
    <p>Trình duyệt của bạn không hỗ trợ video HTML5.</p>
</video>
```

3 format video web phổ biến:
- MP4 (H.264) — Phổ biến nhất, được hỗ trợ bởi hầu hết trình duyệt và thiết bị.
- WebM (VP8/VP9) — Định dạng mở do Google phát triển, chất lượng tốt, file nhỏ hơn MP4.
- OGG/Theora — Định dạng mở, hỗ trợ tốt trên Firefox/Opera cũ.

3. Thuộc tính `alt` trên `<img>`

`alt` cung cấp **văn bản thay thếcho ảnh trong các trường hợp:
- Ảnh không tải được (broken link, mạng chậm).
- Người dùng dùng screen reader (khiếm thị).
- Trình duyệt text-only.
- Search engine indexing (Google đọc alt để hiểu ảnh).

Viết `alt` tốt cho 3 trường hợp:

```html
<!-- Ảnh sản phẩm — mô tả cụ thể, hữu ích cho SEO và accessibility -->
<img src="iphone16.jpg" alt="iPhone 16 Pro Max 256GB màu Titan Tự nhiên - mặt trước">

<!-- Ảnh trang trí (decorative) — để alt="" (rỗng), không mô tả gì -->
<!-- Screen reader sẽ bỏ qua ảnh này hoàn toàn, đúng vì nó không mang thông tin -->
<img src="divider-line.png" alt="">

<!-- Ảnh biểu đồ — mô tả đầy đủ dữ liệu, kể cả người không nhìn thấy biểu đồ vẫn hiểu -->
<img src="revenue-q1-2026.png"
     alt="Biểu đồ cột doanh thu Q1/2026: Tháng 1 đạt 2,3 tỷ, tháng 2 đạt 1,8 tỷ, tháng 3 đạt 3,1 tỷ đồng. Tổng quý đạt 7,2 tỷ, tăng 15% so với cùng kỳ năm ngoái.">
```


Câu A5:

Cách 1: Sử dụng thẻ "img" độc lập, thẻ "img" là phương pháp cơ bản nhất để hiển thị một ảnh đơn lẻ trên trình duyệt.Theo nguyên tắc thực hành tốt nhất, thẻ này luôn cần đi kèm thuộc tính src và alt       
Khi nào dùng: Sử dụng khi hình ảnh chỉ đóng vai trò trang trí, minh họa đơn thuần, hoặc thông tin liên quan đến ảnh đã được cấu trúc rõ ràng ở các phần tử HTML khác xung quanh.            
Ví dụ thực tế 1: Ảnh logo dạng SVG của website được đặt trên thanh điều hướng           
Ví dụ thực tế 2: Ảnh thumbnail thu nhỏ của các sản phẩm trên trang chủ Shopee,nơi tên và giá sản phẩm được tách riêng biệt vào các thẻ "h" hoặc "p" bên trong một thẻ chứa chung chứ không gắn liền như một chú thích ảnh.

Cách 2: Sử dụng thẻ "figure" bọc "img" và "figcaption"              
Khi nào dùng: Sử dụng khi bức ảnh và dòng chú thích ("figcaption") có mối liên kết ngữ nghĩa chặt chẽ với nhau và tạo thành một khối nội dung độc lập. Nếu cắt toàn bộ khối "figure" này và di chuyển sang một vị trí khác, ý nghĩa của nó vẫn trọn vẹn và không làm đứt gãy luồng thông tin của bài viết chính.    
Ví dụ thực tế 1: Một biểu đồ/đồ thị số liệu trong một bài báo cáo tài chính, đi kèm dòng chú thích bên dưới (ví dụ: "Biểu đồ 1: Tăng trưởng doanh thu quý 3").   
Ví dụ thực tế 2: Một bức ảnh báo chí minh họa cho một sự kiện, kèm theo dòng chú thích ghi rõ tên nhiếp ảnh gia, nguồn ảnh và bối cảnh chụp bức ảnh đó.

Phần C:
Câu 1:

Lỗi 1: Dòng 2 — Input "Tên" thiếu `<label>` gắn kết trực tiếp và thuộc tính name

Sửa: `<label for="name">Tên:</label> <input type="text" id="name" name="name" required>`

Lỗi 2: Dòng 4 — Email chỉ dùng placeholder thay cho nhãn dán

Sửa: `<label for="email">Email:</label> <input type="email" id="email" name="email" placeholder="Email của bạn" required>`

Lỗi 3: Dòng 6 & 7 — Các ô Password thiếu thuộc tính name và nhãn xác định

Sửa: `<label for="pwd">Mật khẩu:</label> <input type="password" id="pwd" name="password" required>`

Sửa: `<label for="re-pwd">Nhập lại mật khẩu:</label> <input type="password" id="re-pwd" name="re-password" required>`

Lỗi 4: Dòng 9 — Số điện thoại dùng type="text" thay vì type="tel"

Sửa: `<label for="phone">Phone:</label> <input type="tel" id="phone" name="phone" value="0901234567">`

Lỗi 5: Dòng 11 — Thẻ `<select> `thiếu nhãn và thuộc tính name

Sửa: `<label for="city">Thành phố:</label> <select id="city" name="city">...</select>`

Lỗi 6: Dòng 12 & 13 — Các `<option>` thiếu thuộc tính value để gửi dữ liệu về server

Sửa:` <option value="hn">Hà Nội</option> <option value="hcm">TP.HCM</option>`

Lỗi 7: Dòng 16 — Thẻ `<label> `cho checkbox thiếu input type="checkbox" bên trong

Sửa: `<input type="checkbox" id="tos" name="tos" required> <label for="tos">Tôi đồng ý điều khoản</label>`

Lỗi 8: Dòng 20 — Sử dụng` <input type="submit">` thay vì thẻ `<button type="submit">` 

Sửa: `<button type="submit">Gửi</button>`


Câu C2 (10đ) — Debug Flexbox

Lỗi 1: Cards không đều chiều cao, nút "Mua" bị nhảy

Nguyên nhân: Cards được style với `width: 30%` nhưng không dùng Flexbox column direction bên trong card. Nút "Mua" không có cách nào biết đáy card ở đâu vì card không phải flex container.

Sửa:
```css
.card-container { display: flex; flex-wrap: wrap; }
.card {
  width: 30%;
  margin: 1.5%;
  display: flex;          
  flex-direction: column;  
}
.card img { width: 100%; }
.card h3 { font-size: 18px; }
.card .btn {
  padding: 10px;
  margin-top: auto;        
}
```

Lỗi 2: Items nằm giữa container 100vh nhưng vẫn dính góc trái trên

Nguyên nhân: `.hero` đã là flex container nhưng thiếu `justify-content: center` (căn ngang) và `align-items: center` (căn dọc).

Sửa:
```css
.hero {
  height: 100vh;
  display: flex;
  justify-content: center; 
  align-items: center;     
}
.hero-content {
  text-align: center;
}
```

Lỗi 3: Sidebar bị co lại khi content quá dài

Nguyên nhân: Flex items mặc định có `flex-shrink: 1` → sidebar bị thu nhỏ để nhường chỗ cho content dài. `.sidebar` không có `flex-shrink: 0` để giữ cố định 250px.

Sửa:
```css
.layout { display: flex; }
.sidebar {
  width: 250px;
  flex-shrink: 0;     
}
.content { flex: 1; }
```