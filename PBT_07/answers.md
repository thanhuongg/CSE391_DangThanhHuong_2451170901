## PHẦN A — KIỂM TRA ĐỌC HIỂU (25 điểm)

---

### Câu A1 (5đ) — var / let / const

**Dự đoán output từng đoạn (trước khi chạy):**

```
// Đoạn 1
console.log(x);
var x = 5;
```
**Dự đoán:** `undefined`
**Kết quả thực tế:** `undefined`
**Giải thích:** `var` bị *hoisting* — JS kéo khai báo `var x` lên đầu scope (nhưng không kéo phép gán `= 5`). Nên khi `console.log(x)` chạy, `x` đã tồn tại nhưng chưa được gán giá trị → `undefined`.

---

```
// Đoạn 2
console.log(y);
let y = 10;
```
**Dự đoán:** `ReferenceError: Cannot access 'y' before initialization`
**Kết quả thực tế:** `ReferenceError: Cannot access 'y' before initialization`
**Giải thích:** `let` cũng bị hoisting nhưng nằm trong **Temporal Dead Zone (TDZ)** — vùng từ đầu block cho đến dòng khai báo. Truy cập biến trong TDZ sẽ ném `ReferenceError` ngay lập tức, khác với `var` trả về `undefined`.

---

```
// Đoạn 3
const z = 15;
z = 20;
console.log(z);
```
**Dự đoán:** `TypeError: Assignment to constant variable.`
**Kết quả thực tế:** `TypeError: Assignment to constant variable.`
**Giải thích:** `const` không cho phép **reassign** (gán lại reference/giá trị). Dòng `z = 20` vi phạm quy tắc này → `TypeError` được ném ngay tại dòng đó, `console.log` không bao giờ được chạy.

---

```
// Đoạn 4
const arr = [1, 2, 3];
arr.push(4);
console.log(arr);
```
**Dự đoán:** `[1, 2, 3, 4]`
**Kết quả thực tế:** `[1, 2, 3, 4]`
**Giải thích:** `const` ngăn thay đổi **reference** (biến `arr` trỏ đến object nào), nhưng **không ngăn thay đổi nội dung bên trong** object/array đó. `arr.push(4)` thay đổi nội dung mảng, không đổi reference → hoàn toàn hợp lệ với `const`.

---

```
// Đoạn 5
let a = 1;
{
    let a = 2;
    console.log("Trong block:", a);
}
console.log("Ngoài block:", a);
```
**Dự đoán:**
```
Trong block: 2
Ngoài block: 1
```
**Kết quả thực tế:**
```
Trong block: 2
Ngoài block: 1
```
**Giải thích:** `let` có **block scope** — `let a = 2` bên trong `{}` là một biến *hoàn toàn khác* với `let a = 1` bên ngoài. Hai biến tồn tại độc lập trong scope của chúng. Đây chính là lý do `let`/`const` an toàn hơn `var` (vốn không có block scope).

---

### Câu A2 (5đ) — Data Types & Coercion

**Dự đoán kết quả (trước khi chạy):**

| Code | Dự đoán | Kết quả thực tế |
|------|---------|-----------------|
| `typeof null` | `"object"` | `"object"` |
| `typeof undefined` | `"undefined"` | `"undefined"` |
| `typeof NaN` | `"number"` | `"number"` |
| `"5" + 3` | `"53"` | `"53"` |
| `"5" - 3` | `2` | `2` |
| `"5" * "3"` | `15` | `15` |
| `true + true` | `2` | `2` |
| `[] + []` | `""` | `""` |
| `[] + {}` | `"[object Object]"` | `"[object Object]"` |
| `{} + []` | `0` | `0` (hoặc `"[object Object]"` tùy context) |

**Giải thích tại sao `"5" + 3` và `"5" - 3` cho kết quả khác nhau:**

Toán tử `+` có **hai nghĩa** trong JavaScript:
1. **Cộng số** (khi cả hai toán hạng đều là number)
2. **Nối chuỗi** (khi ít nhất một toán hạng là string)

Khi gặp `"5" + 3`, JS thấy có một string → ưu tiên nghĩa "nối chuỗi" → convert `3` thành `"3"` → nối lại thành `"53"`.

Toán tử `-` chỉ có **một nghĩa duy nhất**: phép trừ số học. Nó **không có nghĩa nào với string**, nên JS buộc phải convert cả hai sang number trước. `"5"` → `5`, rồi `5 - 3 = 2`.

---

### Câu A3 (5đ) — So sánh == vs ===

**Dự đoán `true` hay `false`:**

| Code | Dự đoán | Kết quả thực tế |
|------|---------|-----------------|
| `5 == "5"` | `true` | `true` |
| `5 === "5"` | `false` | `false` |
| `null == undefined` | `true` | `true` |
| `null === undefined` | `false` | `false` |
| `NaN == NaN` | `false` | `false` |
| `0 == false` | `true` | `true` |
| `0 === false` | `false` | `false` |
| `"" == false` | `true` | `true` |

**Quy tắc: Từ giờ trở đi nên dùng `===` hay `==`?**

**→ Luôn luôn dùng `===` (strict equality).**

**Lý do:**
- `==` (loose equality) thực hiện **type coercion** — JS âm thầm chuyển kiểu các toán hạng trước khi so sánh. Điều này dẫn đến những kết quả phi logic như `0 == false` = `true` hay `null == undefined` = `true`.
- `===` (strict equality) kiểm tra **cả giá trị VÀ kiểu dữ liệu** — không có chuyển đổi ngầm. `5 === "5"` = `false` vì một cái là number, một cái là string.
- Dùng `===` giúp code dự đoán được, tránh bugs khó tìm, và thể hiện đúng ý định của lập trình viên.

---

### Câu A4 (5đ) — Truthy & Falsy

**Tất cả giá trị Falsy trong JavaScript (đúng 6 giá trị):**

1. `false` — boolean false
2. `0` — số không
3. `""` — chuỗi rỗng (empty string)
4. `null` — chủ ý không có giá trị
5. `undefined` — chưa được gán giá trị
6. `NaN` — Not a Number

> Lưu ý: `0n` (BigInt zero) cũng là falsy nhưng ít gặp trong thực tế.

**Dự đoán kết quả:**

| Code | Dự đoán | In hay không? | Giải thích |
|------|---------|---------------|------------|
| `if ("0")` | Truthy | ✅ In "A" | String `"0"` khác rỗng → truthy (chỉ `""` mới falsy) |
| `if ("")` | Falsy | ❌ Không in "B" | Empty string là falsy |
| `if ([])` | Truthy | ✅ In "C" | Mảng rỗng vẫn là object → truthy |
| `if ({})` | Truthy | ✅ In "D" | Object rỗng vẫn là object → truthy |
| `if (null)` | Falsy | ❌ Không in "E" | `null` là falsy |
| `if (0)` | Falsy | ❌ Không in "F" | `0` là falsy |
| `if (-1)` | Truthy | ✅ In "G" | Mọi số khác 0 đều truthy, kể cả âm |
| `if (" ")` | Truthy | ✅ In "H" | String chứa khoảng trắng ≠ rỗng → truthy |

---

### Câu A5 (5đ) — Template Literals

**Viết lại bằng template literal (backtick):**

```javascript
// Cách 1 — Gốc:
var greeting = "Xin chào " + name + "! Bạn " + age + " tuổi.";

// Cách 1 — Template literal:
const greeting = `Xin chào ${name}! Bạn ${age} tuổi.`;
```

---

```javascript
// Cách 2 — Gốc:
var url = "https://api.example.com/users/" + userId + "/orders?page=" + page;

// Cách 2 — Template literal:
const url = `https://api.example.com/users/${userId}/orders?page=${page}`;
```

---

```javascript
// Cách 3 — Gốc:
var html = "<div class=\"card\">" +
    "<h2>" + title + "</h2>" +
    "<p>" + description + "</p>" +
    "<span>Giá: " + price + "đ</span>" +
    "</div>";

// Cách 3 — Template literal:
const html = `<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <span>Giá: ${price}đ</span>
</div>`;
```

> **Ưu điểm template literal so với nối chuỗi:**
> - Không cần escape dấu `"` bên trong chuỗi
> - Multi-line string tự nhiên, không cần `\n`
> - Chèn biến/expression trực tiếp bằng `${}` — rõ ràng và dễ đọc hơn

---

## PHẦN C — SUY LUẬN (20 điểm)

---

### Câu C1 (10đ) — Debug JavaScript

**Phân tích code gốc có lỗi:**

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ"
    }
    
    var giamGia = giaBan * phanTramGiam / 100
    let giaSauGiam = giaBan - giamGia
    
    if (giaSauGiam = 0) {           // LỖI 1
        console.log("Sản phẩm miễn phí!")
    }
    
    return giaSauGiam
}

const gia = tinhGiaGiamGia("100000", 20)    // LỖI 2
console.log("Giá sau giảm: " + gia + "đ")

const gia2 = tinhGiaGiamGia(50000, 110)
console.log("Giá: " + gia2)

for (var i = 0; i < 5; i++) {               // LỖI ẨN (LỖI 3)
    setTimeout(function() {
        console.log("Item " + i)            // Bị ảnh hưởng bởi LỖI 3
    }, 1000)
}
```

---

**Danh sách lỗi tìm được:**

#### LỖI 1 — Dùng `=` (gán) thay vì `===` (so sánh)
```javascript
// ❌ SAI:
if (giaSauGiam = 0) {

// ✅ SỬA:
if (giaSauGiam === 0) {
```
**Giải thích:** `giaSauGiam = 0` là phép **gán** — nó gán `0` vào biến `giaSauGiam` rồi trả về `0`. Mà `0` là falsy → `if` không bao giờ chạy, đồng thời giá trị `giaSauGiam` bị phá hỏng thành `0`. Cần dùng `===` để **so sánh**.

---

#### LỖI 2 — Truyền string `"100000"` thay vì number vào hàm
```javascript
// ❌ SAI:
const gia = tinhGiaGiamGia("100000", 20)

// ✅ SỬA:
const gia = tinhGiaGiamGia(100000, 20)
```
**Giải thích:** Khi `giaBan = "100000"` (string), phép tính `"100000" * 20 / 100` cho ra `2000` (JS tự convert), nhưng sau đó `"100000" - 2000` = `98000` (vẫn tính được). Tuy nhiên, hàm không validate kiểu đầu vào → kết quả có thể sai trong nhiều trường hợp khác (ví dụ `"100abc"`). Cần truyền `number` hoặc thêm validation `Number(giaBan)` bên trong hàm.

---

#### LỖI 3 (ẨN) — Dùng `var i` trong vòng lặp với `setTimeout`
```javascript
// ❌ SAI:
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i)
    }, 1000)
}
// → In ra: "Item 5" 5 lần (không phải Item 0, 1, 2, 3, 4)

// ✅ SỬA:
for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i)
    }, 1000)
}
// → In ra: "Item 0", "Item 1", "Item 2", "Item 3", "Item 4"
```
**Giải thích:** `var` có **function scope** — tất cả 5 callback của `setTimeout` đều tham chiếu đến *cùng một biến* `i`. Sau 1000ms khi các callback chạy, vòng lặp đã kết thúc và `i = 5`. Nên cả 5 lần đều in `"Item 5"`.

Dùng `let` thì mỗi iteration tạo ra một **closure riêng** với giá trị `i` của riêng nó (0, 1, 2, 3, 4) → kết quả đúng.

---

#### LỖI PHỤ — Thiếu dấu chấm phẩy và dùng `var`
```javascript
// Thiếu dấu chấm phẩy (không crash nhưng không đúng convention):
return "Phần trăm giảm không hợp lệ"   // nên có ;
var giamGia = giaBan * phanTramGiam / 100   // nên có ;

// Dùng var trong hàm (nên đổi sang const/let):
var giamGia = ...   // → const giamGia = ...
```

---

**Code đã sửa hoàn chỉnh:**

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    // Validate kiểu dữ liệu
    const gia = Number(giaBan);
    if (isNaN(gia)) {
        return "Lỗi: giaBan không phải số";
    }

    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ";
    }

    const giamGia = gia * phanTramGiam / 100;
    const giaSauGiam = gia - giamGia;

    if (giaSauGiam === 0) {          // SỬA LỖI 1: = thành ===
        console.log("Sản phẩm miễn phí!");
    }

    return giaSauGiam;
}

const gia = tinhGiaGiamGia(100000, 20);    // SỬA LỖI 2: string → number
console.log("Giá sau giảm: " + gia + "đ");

const gia2 = tinhGiaGiamGia(50000, 110);
console.log("Giá: " + gia2);

for (let i = 0; i < 5; i++) {             // SỬA LỖI 3: var → let
    setTimeout(function() {
        console.log("Item " + i);
    }, 1000);
}
```