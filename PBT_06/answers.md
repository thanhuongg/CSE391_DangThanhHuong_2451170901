## PHẦN A — ĐỌC HIỂU (20 điểm)

### Câu A1 (10đ) — Grid System

#### Bảng layout ở 3 kích thước màn hình

```html
<div class="container">
    <div class="row">
        <div class="col-12 col-md-6 col-lg-3">Box 1</div>
        <div class="col-12 col-md-6 col-lg-3">Box 2</div>
        <div class="col-12 col-md-6 col-lg-3">Box 3</div>
        <div class="col-12 col-md-6 col-lg-3">Box 4</div>
    </div>
</div>
```

| Kích thước | < 768px | 768px - 991px | ≥ 992px |
|------------|---------|---------------|---------|
| Số cột mỗi box | 12 / 12 = 1 cột trên 1 hàng | 6 / 12 = 2 cột trên 1 hàng | 3 / 12 = 4 cột trên 1 hàng |
| Box layout | Mỗi box chiếm full width, 4 box xếp **dọc** thành 4 hàng | Box 1+2 nằm hàng 1, Box 3+4 nằm hàng 2 — **2 cột, 2 hàng** | Cả 4 box nằm **cùng 1 hàng** — 4 cột đều nhau |

**Hình minh họa:**

```
< 768px (Mobile):           768–991px (Tablet):         ≥ 992px (Desktop):
┌──────────────────┐        ┌────────┐ ┌────────┐       ┌────┐ ┌────┐ ┌────┐ ┌────┐
│      Box 1       │        │  Box 1 │ │  Box 2 │       │ B1 │ │ B2 │ │ B3 │ │ B4 │
├──────────────────┤        ├────────┤ ├────────┤       └────┘ └────┘ └────┘ └────┘
│      Box 2       │        │  Box 3 │ │  Box 4 │
├──────────────────┤        └────────┘ └────────┘
│      Box 3       │
├──────────────────┤
│      Box 4       │
└──────────────────┘
```

#### Câu hỏi thêm

`col-md-6` nghĩa là: từ breakpoint `md` (≥ 768px) trở lên, element này chiếm **6 cột** trong hệ thống 12 cột (tức là 50% chiều rộng của row). Dưới 768px, class này không có hiệu lực.

**Tại sao không cần viết `col-sm-12`?**

Vì Bootstrap hoạt động theo nguyên tắc **mobile-first**: `col-12` (không có breakpoint prefix) tự động áp dụng cho **tất cả** các kích thước màn hình nhỏ nhất (extra small, tức là < 576px và < 768px). Khi ta chỉ định `col-md-6`, Bootstrap hiểu: "dưới md thì dùng rule đã set trước đó (col-12)". Nếu viết thêm `col-sm-12` thì bị thừa, vì `col-12` đã bao phủ rồi.

---

### Câu A2 (10đ) — Utilities & Components

#### 1. Giải thích `d-none d-md-block`

- `d-none`: Đặt `display: none` — **ẩn element ở mọi kích thước** (bắt đầu từ mobile-first).
- `d-md-block`: Từ breakpoint `md` (≥ 768px) trở lên, đặt `display: block` — **hiện element dạng block**.

**Kết quả:**
- Màn hình < 768px (mobile): Element **ẩn hoàn toàn**.
- Màn hình ≥ 768px (tablet, desktop): Element **hiển thị** dạng block.

**Ứng dụng thực tế:** Dùng để ẩn sidebar, menu đầy đủ, hay các element không cần thiết trên màn hình nhỏ.

---

#### 2. Liệt kê 5 spacing utilities và giải thích

| Class | CSS tương đương | Giải thích |
|-------|-----------------|------------|
| `mt-3` | `margin-top: 1rem` (16px) | Thêm margin phía trên 1rem. `m` = margin, `t` = top, `3` = 1rem |
| `px-4` | `padding-left: 1.5rem; padding-right: 1.5rem` | Padding theo chiều ngang (trái + phải). `p` = padding, `x` = trục X (horizontal) |
| `mb-auto` | `margin-bottom: auto` | Margin dưới tự động — thường dùng trong flexbox để đẩy element xuống cuối |
| `py-2` | `padding-top: 0.5rem; padding-bottom: 0.5rem` | Padding trên + dưới 0.5rem. `y` = trục Y (vertical) |
| `ms-auto` | `margin-left: auto` | Margin trái tự động — thường dùng để đẩy element sang phải trong flexbox |

**Quy tắc đặt tên:**
```
{property}{direction}-{size}
m/p         t/b/s/e/x/y     0–5 hoặc auto

m = margin    p = padding
t = top       b = bottom
s = start (left)  e = end (right)
x = trái+phải     y = trên+dưới
```

---

#### 3. Sự khác nhau giữa `.container`, `.container-fluid`, `.container-md`

| Class | Hành vi | Khi nào dùng |
|-------|---------|--------------|
| `.container` | Có **max-width cố định** thay đổi theo breakpoint (ví dụ: 960px ở lg, 1140px ở xl). Tự động căn giữa với `margin: 0 auto`. | Nội dung chính của trang — blog, article, form, product detail |
| `.container-fluid` | Luôn **full width 100%** ở mọi kích thước màn hình. Không có max-width. | Hero section, navbar, footer, banner — những vùng cần kéo dài hết màn hình |
| `.container-md` | **Full width dưới `md`** (< 768px), từ `md` trở lên mới có max-width (như `.container`). | Khi muốn trang trên mobile full-edge nhưng trên desktop có padding đẹp hơn |

**Tóm tắt:** `container` = responsive box có max-width; `container-fluid` = luôn full; `container-{bp}` = hybrid — full dưới breakpoint, có max-width từ breakpoint đó trở lên.

---

## PHẦN C — PHÂN TÍCH (20 điểm)

### Câu C1 (10đ) — Tùy biến Bootstrap

#### 1. Quy trình đổi màu `$primary` sang `#E63946`

**Quy trình đầy đủ:**

**Bước 1: Cài đặt môi trường (cần Node.js + npm)**
```bash
npm init -y
npm install bootstrap@5.3.0 sass
```

**Bước 2: Tạo cấu trúc project**
```
project/
├── src/
│   └── custom.scss    ← File SASS tùy chỉnh
├── dist/
│   └── style.css      ← Output sau khi build
└── package.json
```

**Bước 3: Viết `src/custom.scss` — Override TRƯỚC khi import Bootstrap**
```scss
$primary: #E63946;

@import "../node_modules/bootstrap/scss/bootstrap";
```

**Bước 4: Thêm script build vào `package.json`**
```json
{
  "scripts": {
    "sass:build": "sass src/custom.scss dist/style.css",
    "sass:watch": "sass --watch src/custom.scss dist/style.css"
  }
}
```

**Bước 5: Build**
```bash
npm run sass:build
```

**Bước 6: Dùng `dist/style.css` trong HTML thay vì CDN Bootstrap**
```html
<!-- Thay vì: -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Dùng: -->
<link href="dist/style.css" rel="stylesheet">
```

**Công cụ cần thiết:**
- Node.js (runtime để chạy npm)
- npm (package manager)
- Sass (compiler: `npm install sass`)
- File `custom.scss` của riêng bạn

**File cần modify:** `src/custom.scss` — file SASS tùy chỉnh của bạn (không sửa trực tiếp file Bootstrap trong `node_modules`).

---

#### 2. Tại sao KHÔNG nên override trực tiếp `.btn-primary { background: red; }`?

**Vấn đề khi override trực tiếp bằng CSS:**

```css
/* ❌ Cách sai */
.btn-primary {
    background: red;
}
```

Có nhiều lý do để tránh cách này:

1. **Không cascade toàn bộ hệ thống:** Bootstrap sử dụng `$primary` ở hàng chục chỗ — `.btn-primary`, `.badge.bg-primary`, `.text-primary`, `.border-primary`, `.alert-primary`, focus ring, v.v. Override CSS chỉ thay đổi đúng 1 class bạn viết, **không thay đổi** tất cả các component liên quan.

2. **Specificity wars:** Bootstrap dùng nhiều selector kết hợp. CSS của bạn có thể bị ghi đè bởi Bootstrap nếu specificity không đủ cao, dẫn đến phải thêm `!important` — một anti-pattern.

3. **Khó maintain:** Nếu sau này cần đổi màu lại, phải tìm và sửa từng class trong CSS file. Với SASS variables, chỉ sửa 1 dòng `$primary: ...` → toàn bộ trang cập nhật.

4. **Inconsistency:** Màu hover, active, disabled được Bootstrap tính toán tự động từ `$primary` (làm tối hơn, nhạt hơn). Override CSS thủ công sẽ không cập nhật các trạng thái này → UI không nhất quán.

**Với SASS variables:**
```scss
$primary: #E63946;  // ← Sửa 1 dòng này
// Bootstrap tự tính: hover = darken($primary, 10%), disabled = opacity 0.65, v.v.
@import "bootstrap/scss/bootstrap";
```

→ Toàn bộ hệ thống nhất quán, không cần override từng class.

---

### Câu C2 (10đ) — So sánh Bootstrap vs CSS thuần

#### CSS thuần để tạo 1 Navbar responsive + 1 Product Card

**CSS thuần — Navbar responsive:**
```css
/* ~45 dòng CSS */
* { box-sizing: border-box; margin: 0; padding: 0; }
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.nav-logo { font-size: 1.5rem; font-weight: bold; }
.nav-menu { display: flex; list-style: none; gap: 1.5rem; }
.nav-menu a { text-decoration: none; color: #333; }
.hamburger { display: none; flex-direction: column; gap: 4px; cursor: pointer; }
.hamburger span { width: 25px; height: 2px; background: #333; }

@media (max-width: 768px) {
    .nav-menu {
        display: none;
        position: absolute;
        top: 60px; left: 0; right: 0;
        background: #fff;
        flex-direction: column;
        padding: 1rem;
    }
    .nav-menu.active { display: flex; }
    .hamburger { display: flex; }
}
```

**CSS thuần — Product Card:**
```css
/* ~30 dòng CSS */
.card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    background: #fff;
    transition: box-shadow 0.3s;
}
.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1rem; }
.card-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.card-text { color: #666; font-size: 0.875rem; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 4px;
       background: #0d6efd; color: #fff; cursor: pointer; }
```

**HTML tương đương với Bootstrap (0 dòng CSS riêng):**
```html
<!-- Navbar -->
<nav class="navbar navbar-expand-lg bg-white shadow-sm">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">Logo</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav ms-auto gap-3">
        <li class="nav-item"><a class="nav-link" href="#">Trang chủ</a></li>
      </ul>
    </div>
  </div>
</nav>

<!-- Card -->
<div class="card shadow-sm">
  <img src="product.jpg" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Tên sản phẩm</h5>
    <p class="card-text text-muted small">Mô tả sản phẩm</p>
    <button class="btn btn-primary w-100">Mua ngay</button>
  </div>
</div>
```

---

#### So sánh tổng hợp

| Tiêu chí | CSS thuần | Bootstrap |
|----------|-----------|-----------|
| **Số dòng CSS** | ~75 dòng (navbar + card) | 0 dòng CSS riêng |
| **Thời gian phát triển** | 30–60 phút (viết, debug, test responsive) | 5–10 phút (biết class là xong) |
| **Khả năng tùy biến** | Toàn quyền — pixel-perfect theo ý muốn | Hạn chế trong CDN; cần SASS để tùy biến sâu |
| **Tính nhất quán** | Phụ thuộc developer — dễ sai lệch giữa các trang | Nhất quán tự động — tất cả component dùng chung design token |
| **File size** | Nhỏ (chỉ CSS bạn cần) | Lớn hơn (load toàn bộ Bootstrap ~22KB gzip) |
| **Học thuật** | Hiểu sâu CSS, Flexbox, Media Query | Nhanh làm được việc, nhưng dễ dùng mà không hiểu |

---

#### Khi nào NÊN dùng Bootstrap?

- **Prototype / MVP nhanh:** Cần ra sản phẩm trong vài ngày, không có thời gian viết CSS từ đầu.
- **Team lớn, nhiều developer:** Bootstrap tạo ngôn ngữ chung — mọi người viết `btn btn-primary` thay vì mỗi người một style button khác nhau.
- **Admin panel / internal tool:** Không cần design độc đáo, cần chức năng và nhất quán.
- **Non-designer developer:** Bootstrap cho phép dev tạo UI chấp nhận được mà không cần designer.
- **Project có deadline gấp:** Dashboard, CMS, back-office app.

#### Khi nào KHÔNG NÊN dùng Bootstrap?

- **Brand-driven design:** Website cần nhận dạng thương hiệu riêng, không muốn trông giống mọi trang Bootstrap khác.
- **Performance critical:** Ứng dụng cần tốc độ tối ưu — load toàn bộ Bootstrap dù chỉ dùng 20% là lãng phí.
- **Component library riêng của công ty:** Nếu công ty đã có design system (như Ant Design, Material UI), dùng thêm Bootstrap sẽ conflict.
- **Landing page / marketing site:** Cần visual impact mạnh, độc đáo — Bootstrap sẽ làm trang trông "generic".
- **Học CSS sâu:** Nếu mục tiêu là hiểu CSS thật sự, dùng Bootstrap sớm sẽ bỏ qua kiến thức nền tảng quan trọng.
