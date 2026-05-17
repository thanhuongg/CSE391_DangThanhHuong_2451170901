
## PHẦN A — KIỂM TRA ĐỌC HIỂU (20 điểm)

---

### Câu A1 (5đ) — Viewport & Mobile-First

#### 1. Thẻ `<meta viewport>` chuẩn

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Giải thích từng thuộc tính:**

| Thuộc tính | Giá trị | Ý nghĩa |
|---|---|---|
| `name` | `"viewport"` | Xác định đây là thẻ meta cấu hình viewport (vùng hiển thị) |
| `content` | *(chuỗi cấu hình)* | Chứa các tham số cấu hình |
| `width` | `device-width` | Đặt chiều rộng viewport bằng chiều rộng thật của thiết bị (không phải chiều rộng giả định) |
| `initial-scale` | `1.0` | Tỷ lệ zoom ban đầu = 100% (không zoom in, không zoom out) |

#### 2. Nếu THIẾU thẻ viewport, iPhone hiển thị như thế nào?

Khi thiếu `<meta name="viewport">`, mobile browser (Safari/Chrome trên iOS) sẽ **giả định trang web được thiết kế cho desktop với chiều rộng ~980px**. Kết quả:

- Toàn bộ trang bị **thu nhỏ xuống** để vừa với màn hình 375px của iPhone
- Chữ trở nên **cực nhỏ**, gần như không đọc được
- Người dùng phải **pinch-to-zoom** để đọc từng đoạn
- Các nút bấm quá nhỏ, khó nhấn chính xác
- **Media queries sẽ không hoạt động đúng** — browser vẫn nghĩ viewport rộng 980px nên không trigger breakpoint mobile

Tóm lại: trang trông y hệt "desktop bị thu nhỏ lại", responsive hoàn toàn vô hiệu.

#### 3. Mobile-First vs Desktop-First

**Desktop-First:**
```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
}
```

**Mobile-First:**
```css
.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

@media (min-width: 768px) {
    .container {
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }
}
```

**Tại sao Mobile-First được khuyên dùng?**

1. **Performance**: Mobile chỉ tải CSS mobile (ít hơn). Desktop-First buộc mobile tải cả CSS desktop rồi override — lãng phí bandwidth.
2. **Google Mobile-First Indexing**: Google crawl phiên bản mobile trước để xếp hạng SEO. Mobile-First CSS giúp trang hoạt động tốt hơn với bot Google.
3. **Content thinking**: Buộc developer suy nghĩ xem nội dung nào thực sự quan trọng (mobile chỉ có không gian cho nội dung cốt lõi).
4. **Progressive Enhancement**: Bắt đầu từ nền tảng tối giản (mobile) rồi thêm complexity cho thiết bị mạnh hơn — đúng hướng hơn là cắt bỏ features.

---

### Câu A2 (5đ) — Breakpoints

Breakpoints chuẩn theo Bootstrap 5 và thực tiễn ngành:

| Tên | Min-width | Thiết bị đại diện | Lưới sản phẩm (gợi ý) |
|---|---|---|---|
| **Mobile (xs)** | < 576px | iPhone SE (375px), các điện thoại nhỏ | **1 cột** — màn hình quá hẹp để hiện nhiều cột |
| **Mobile L (sm)** | ≥ 576px | iPhone Plus, điện thoại cỡ lớn, landscape | **2 cột** — đủ rộng cho 2 card nhỏ |
| **Tablet (md)** | ≥ 768px | iPad dọc (768px), tablet 8" | **2–3 cột** — thường dùng 2 cột layout chính |
| **Desktop (lg)** | ≥ 992px | Laptop 13" nhỏ | **3–4 cột** — màn hình đủ để hiện grid |
| **Desktop L (xl)** | ≥ 1200px | Desktop, laptop 15" lớn | **4 cột** — layout đầy đủ |
| **Desktop XL (xxl)** | ≥ 1400px | Màn 4K, ultrawide | **4–6 cột** — có thể thêm cột nếu cần |

**Lưu ý quan trọng:** Không đặt breakpoint theo model thiết bị cụ thể (vì mỗi năm có thiết bị mới). Thay vào đó, đặt breakpoint **tại điểm mà design bắt đầu bị vỡ** (nội dung bị chèn ép, chữ quá nhỏ, v.v.).

---

### Câu A3 (5đ) — Media Queries

```css
.container { width: 100%; padding: 10px; }

@media (min-width: 576px) { .container { width: 540px; } }
@media (min-width: 768px) { .container { width: 720px; } }
@media (min-width: 992px) { .container { width: 960px; } }
@media (min-width: 1200px) { .container { width: 1140px; } }
```

**Phân tích:** Đây là Mobile-First (dùng `min-width`). CSS cascade từ trên xuống, rule sau override rule trước nếu điều kiện thỏa mãn.

| Chiều rộng màn hình | Điều kiện thỏa mãn | `.container` width |
|---|---|---|
| **375px** (iPhone SE) | Không có `@media` nào (375 < 576) | `100%` *(toàn chiều rộng màn hình)* |
| **600px** | `min-width: 576px` ✅ | `540px` |
| **800px** | `min-width: 576px` ✅, `min-width: 768px` ✅ | `720px` *(rule sau override)* |
| **1000px** | 576 ✅, 768 ✅, 992 ✅ | `960px` |
| **1400px** | 576 ✅, 768 ✅, 992 ✅, 1200 ✅ | `1140px` |

**Giải thích logic:** Với màn hình 800px, cả 2 media query đầu đều thỏa mãn. CSS cascade áp dụng rule cuối cùng thỏa mãn → `width: 720px` (từ `min-width: 768px`) override `width: 540px` (từ `min-width: 576px`).

---

### Câu A4 (5đ) — SCSS Basics

#### 4 tính năng chính của SCSS:

**1. Variables (`$primary-color`) — Biến**

Lưu trữ giá trị tái sử dụng (màu sắc, font, spacing...). Thay đổi 1 biến → toàn bộ nơi dùng biến đó tự cập nhật.

```scss

$primary-color: #2563eb;
$font-size-base: 16px;
$spacing-md: 16px;
$radius-md: 12px;

.btn {
    background: $primary-color;
    font-size: $font-size-base;
    padding: $spacing-md;
    border-radius: $radius-md;
}

.badge {
    background: $primary-color;
}
```

**2. Nesting — Viết CSS lồng nhau**

Lồng selector con bên trong selector cha, phản ánh cấu trúc HTML. Dùng `&` để tham chiếu selector cha.

```scss

.navbar {
    background: #1a202c;
    padding: 16px;

    &__logo {      
        color: white;
        font-size: 1.5rem;
    }

    &__links {         
        display: flex;
        gap: 24px;

        a {          
            color: rgba(white, 0.8);
            text-decoration: none;

            &:hover { 
                color: white;
            }
        }
    }

    &--dark {          
        background: #000;
    }
}
```

**3. Mixins (`@mixin`, `@include`) — Hàm CSS tái sử dụng**

`@mixin` định nghĩa một khối CSS có thể tái sử dụng (có thể nhận tham số như function). `@include` gọi mixin đó.

```scss
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

@mixin button-style($bg-color, $text-color: white) {
    background: $bg-color;
    color: $text-color;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
        background: darken($bg-color, 10%);
    }
}

@mixin respond-to($breakpoint) {
    @if $breakpoint == tablet {
        @media (min-width: 768px) { @content; }
    } @else if $breakpoint == desktop {
        @media (min-width: 1024px) { @content; }
    }
}
.modal        { @include flex-center; position: fixed; inset: 0; }
.btn-primary  { @include button-style(#2563eb); }
.btn-danger   { @include button-style(#dc2626); }

.card {
    display: grid;
    grid-template-columns: 1fr;

    @include respond-to(tablet)  { grid-template-columns: repeat(2, 1fr); }
    @include respond-to(desktop) { grid-template-columns: repeat(4, 1fr); }
}
```

**4. `@extend` / Inheritance — Kế thừa style**

`@extend` cho phép một selector kế thừa tất cả styles của selector khác, tránh lặp code. Thường dùng với `%placeholder` (class không được render ra HTML).

```scss
%btn-base {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    @extend %btn-base;
    background: #2563eb;
    color: white;
}

.btn-outline {
    @extend %btn-base;
    background: transparent;
    border: 2px solid #2563eb;
    color: #2563eb;
}
```

**Output CSS:**
```css
.btn-primary, .btn-outline {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}
.btn-primary { background: #2563eb; color: white; }
.btn-outline { background: transparent; border: 2px solid #2563eb; color: #2563eb; }
```

> **Lưu ý:** Trong thực tế, `@mixin` thường được ưu tiên hơn `@extend` vì dễ predict output CSS hơn. `@extend` đôi khi tạo ra selector phức tạp, khó debug.

#### Tại sao trình duyệt không đọc được `.scss`?

Trình duyệt chỉ hiểu **CSS thuần** (W3C standard). SCSS là ngôn ngữ mở rộng với cú pháp riêng (`$variable`, `@mixin`, nesting...) mà không nằm trong web standards.

**Bước chuyển SCSS → CSS (compile):**

```
SCSS Source Code
      ↓
  Sass Compiler  (một trong các cách sau)
      ↓
  CSS Output  (browser đọc được)
```

Các cách compile phổ biến:

| Cách | Công cụ | Lệnh |
|---|---|---|
| VS Code | Extension "Live Sass Compiler" | Click "Watch Sass" ở status bar |
| Node.js CLI | `npm install -g sass` | `sass style.scss style.css --watch` |
| Vite (React/Vue) | `npm install -D sass` | Tự động khi import file `.scss` |
| Create React App | `npm install sass` | Đổi `.css` thành `.scss` là xong |

---

## PHẦN C — PHÂN TÍCH (20 điểm)

---

### Câu C1 (10đ) — Phân tích trang Shopee

#### Phân tích 3 kích thước màn hình

**Mobile (375px — iPhone SE):**
- Header: Logo + Thanh tìm kiếm + Icon giỏ hàng. Navigation category bị ẩn hoàn toàn.
- Product grid: **2 cột** (Shopee ưu tiên 2 cột ngay từ mobile để hiện nhiều sản phẩm hơn)
- Sidebar filter: **Bị ẩn**, thay bằng nút filter ở top bar
- Banner: Hiển thị dọc (aspect ratio thay đổi)
- Flash sale, category icons: scroll ngang (horizontal scroll)
- Font size: ~13-14px cho product name (nhỏ hơn desktop)

**Tablet (768px — iPad):**
- Header: Mở rộng hơn, thêm một số category links
- Product grid: **2–3 cột**
- Sidebar: Vẫn ẩn hoặc xuất hiện dạng horizontal filter bar
- Banner: Aspect ratio rộng hơn
- Flash sale: Hiện nhiều item hơn trên 1 hàng

**Desktop (1440px):**
- Header: Full navigation với tất cả links, search bar rộng, user menu
- Product grid: **5–6 cột** (Shopee hiện nhiều cột để tối ưu không gian)
- Sidebar: Hiện đầy đủ với tất cả bộ lọc (category, giá, rating, brand...)
- Banner: Full width với carousel
- Font size: 14-16px đọc thoải mái hơn

#### Thay đổi chính theo breakpoint:

| Element | Mobile 375px | Tablet 768px | Desktop 1440px |
|---|---|---|---|
| Navigation | Chỉ icon | Một phần | Đầy đủ |
| Search bar | Thu nhỏ | Trung bình | Rộng |
| Product grid | 2 cột | 3 cột | 5–6 cột |
| Sidebar filter | Ẩn | Ẩn/minimal | Hiện đầy đủ |
| Footer | Rút gọn | Đầy đủ | Đầy đủ |

#### Media queries tìm thấy trong DevTools (ví dụ điển hình):

```css
@media (max-width: 768px) {
    .shopee-header__search-bar { width: 100%; }
    .shopee-category-list { display: none; }
}

@media (min-width: 1200px) {
    .shopee-product-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}
```

---

### Câu C2 (10đ) — Responsive Strategy cho Trang Đặt Bàn Nhà Hàng

#### Wireframe 3 kích thước

**MOBILE (< 768px):**
```
┌──────────────────────────┐
│  [Logo]        [📞 Gọi]  │  ← Header: logo + nút gọi (CTA quan trọng nhất)
├──────────────────────────┤
│                          │
│   [Hero Image - full]    │  ← Hero: full width, height 50vh
│   "Đặt bàn tại đây"     │
│   [Đặt bàn ngay ▼]      │
│                          │
├──────────────────────────┤
│  FORM ĐẶT BÀN           │  ← Form đặt bàn: ưu tiên lên trên (mục tiêu chính)
│  📅 Chọn ngày           │
│  🕐 Chọn giờ            │
│  👥 Số người            │
│  📝 Ghi chú             │
│  [XÁC NHẬN ĐẶT BÀN]    │
├──────────────────────────┤
│  ẢNH MÓN ĂN (1 cột)    │  ← Grid ảnh: 1 cột, scroll dọc
│  [Ảnh 1]               │
│  [Ảnh 2]               │
│  [Ảnh 3] ...           │  (6 ảnh, chỉ hiện 3, có nút "Xem thêm")
├──────────────────────────┤
│  [BẢN ĐỒ - 100% width] │  ← Map: full width
├──────────────────────────┤
│  Footer rút gọn         │  ← Chỉ copyright + SĐT
└──────────────────────────┘

Ẩn trên mobile: Địa chỉ chi tiết trong footer (chỉ giữ SĐT), menu navigation phụ
```

**TABLET (768px - 1023px):**
```
┌────────────────────────────────────────┐
│  [Logo]    [Menu]    [📞 Đặt bàn]     │  ← Header: nav 1 hàng
├────────────────────────────────────────┤
│                                        │
│      [Hero Image - full width]        │  ← Hero: full width, 60vh
│      "Không gian ẩm thực đẳng cấp"   │
│      [Đặt bàn ngay]                   │
│                                        │
├─────────────────────┬──────────────────┤
│  FORM ĐẶT BÀN      │  ẢNH MÓN ĂN    │  ← 2 cột: form + grid ảnh
│  📅 Ngày           │  [Ảnh][Ảnh]     │
│  🕐 Giờ            │  [Ảnh][Ảnh]     │  Grid ảnh: 2 cột
│  👥 Số người       │  [Ảnh][Ảnh]     │
│  📝 Ghi chú        │                  │
│  [XÁC NHẬN]        │                  │
├─────────────────────┴──────────────────┤
│         [BẢN ĐỒ - full width]         │  ← Map: full width, height 300px
├────────────────────────────────────────┤
│  Footer đầy đủ                        │
└────────────────────────────────────────┘
```

**DESKTOP (≥ 1024px):**
```
┌───────────────────────────────────────────────────────────┐
│  [Logo]    [Thực đơn] [Về chúng tôi] [...]  [📞 Đặt bàn]│
├───────────────────────────────────────────────────────────┤
│                                                           │
│              [Hero Image - full width, 80vh]             │
│              "Không gian ẩm thực đẳng cấp"              │
│                   [Đặt bàn ngay]                         │
│                                                           │
├────────────────────────────────────┬──────────────────────┤
│  ẢNH MÓN ĂN (3 cột, 6 ảnh đủ)   │  FORM ĐẶT BÀN       │  ← Layout 2/3 + 1/3
│  [Ảnh][Ảnh][Ảnh]                  │  📅 Ngày            │
│  [Ảnh][Ảnh][Ảnh]                  │  🕐 Giờ             │
│                                    │  👥 Số người        │
│                                    │  📝 Ghi chú         │
│                                    │  [XÁC NHẬN]         │
├───────────────────────┬────────────┴──────────────────────┤
│  [BẢN ĐỒ - 60%]     │  THÔNG TIN LIÊN HỆ (40%)          │  ← Map + info 2 cột
│                       │  📍 Địa chỉ                       │
│                       │  📞 Hotline                       │
│                       │  ⏰ Giờ mở cửa                   │
└───────────────────────┴───────────────────────────────────┘
│  Footer đầy đủ: Logo | Menu | Mạng xã hội | Copyright   │
└───────────────────────────────────────────────────────────┘
```

#### CSS Skeleton Mobile-First:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }


:root {
    --color-primary: #b5914a;  
    --color-bg: #faf8f5;
    --color-text: #2c2c2c;
    --max-width: 1280px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 32px;
    --spacing-xl: 64px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
}

.header__nav { display: none; } 
.header__cta { display: block; } 

@media (min-width: 768px) {
    .header__nav { display: flex; gap: 24px; } 
    .header { padding: var(--spacing-md) var(--spacing-lg); }
}

.hero {
    height: 50vh;           
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: url('hero.jpg') center/cover no-repeat;
    position: relative;
}

@media (min-width: 768px)  { .hero { height: 60vh; } }
@media (min-width: 1024px) { .hero { height: 80vh; } }


.main-section {
    padding: var(--spacing-lg) var(--spacing-md);
    display: grid;
    grid-template-columns: 1fr;        
    grid-template-areas:
        "form"
        "gallery";
    gap: var(--spacing-lg);
    max-width: var(--max-width);
    margin: 0 auto;
}

@media (min-width: 768px) {
    .main-section {
        grid-template-columns: 1fr 1fr;  /* Tablet: 2 cột ngang nhau */
        grid-template-areas: "form gallery";
        padding: var(--spacing-lg);
    }
}

@media (min-width: 1024px) {
    .main-section {
        grid-template-columns: 2fr 1fr;  /* Desktop: gallery rộng hơn form */
        grid-template-areas: "gallery form";
        padding: var(--spacing-xl) var(--spacing-lg);
    }
}

.gallery {
    grid-area: gallery;
    display: grid;
    grid-template-columns: 1fr;         /* Mobile: 1 cột */
    gap: var(--spacing-sm);
}

@media (min-width: 768px)  { .gallery { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .gallery { grid-template-columns: repeat(3, 1fr); } }

/* ========== FORM ĐẶT BÀN ========== */
.booking-form {
    grid-area: form;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    background: white;
    padding: var(--spacing-lg);
    border-radius: 12px;
}

.booking-form input,
.booking-form select,
.booking-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}
.location-section {
    display: grid;
    grid-template-columns: 1fr;        /* Mobile: map full width */
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) var(--spacing-md);
    max-width: var(--max-width);
    margin: 0 auto;
}

.location-section iframe {
    width: 100%;
    height: 300px;
    border: 0;
    border-radius: 12px;
}

@media (min-width: 1024px) {
    .location-section {
        grid-template-columns: 3fr 2fr;  /* Desktop: map + info side by side */
        padding: var(--spacing-xl) var(--spacing-lg);
    }
}
img { max-width: 100%; height: auto; display: block; }

.footer {
    padding: var(--spacing-lg) var(--spacing-md);
    background: var(--color-text);
    color: white;
    text-align: center;
}

@media (min-width: 768px) {
    .footer {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        text-align: left;
        padding: var(--spacing-xl) var(--spacing-lg);
    }
}
```

---
