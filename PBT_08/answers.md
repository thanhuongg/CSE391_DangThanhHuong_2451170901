## PHẦN A — KIỂM TRA ĐỌC HIỂU

---

### Câu A1

```javascript
// 1. Function Declaration
function tinhThueBaoHiem_Declaration(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
}

// 2. Function Expression
const tinhThueBaoHiem_Expression = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
};

// 3. Arrow Function
const tinhThueBaoHiem_Arrow = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
};
```

**Câu hỏi: 3 cách này có khác nhau về hoisting không?**

Có khác nhau. Cụ thể:

- **Function Declaration** được **hoisted hoàn toàn** — cả khai báo lẫn định nghĩa đều được đưa lên đầu scope. Có thể gọi hàm **trước** dòng khai báo trong code.
- **Function Expression** và **Arrow Function** chỉ được hoisted phần **khai báo biến** (`const`/`let`/`var`), không phải phần gán giá trị. Nếu gọi trước khi khai báo sẽ nhận `ReferenceError` (với `const`/`let`) hoặc `undefined is not a function` (với `var`).

**Ví dụ minh họa:**

```javascript
// ✅ Function Declaration — gọi TRƯỚC khi khai báo được
console.log(tinhDeclaration(15000000));
// → { thue: 1500000, thuc_nhan: 13500000 }  ← Hoạt động bình thường

function tinhDeclaration(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
}

// ❌ Function Expression — gọi TRƯỚC khi khai báo → lỗi
console.log(tinhExpression(15000000));
// → ReferenceError: Cannot access 'tinhExpression' before initialization

const tinhExpression = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
};

// ❌ Arrow Function — gọi TRƯỚC khi khai báo → lỗi
console.log(tinhArrow(15000000));
// → ReferenceError: Cannot access 'tinhArrow' before initialization

const tinhArrow = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    const thuc_nhan = luong - thue;
    return { thue, thuc_nhan };
};
```

**Tóm tắt:**
| Cách khai báo | Hoisting | Gọi trước khai báo |
|---|---|---|
| Function Declaration | ✅ Hoàn toàn | ✅ Được |
| Function Expression (`const`) | Chỉ tên biến (TDZ) | ❌ ReferenceError |
| Arrow Function (`const`) | Chỉ tên biến (TDZ) | ❌ ReferenceError |

---

### Câu A2

**Dự đoán output Đoạn 1:**

```javascript
function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}
const c = counter();
console.log(c.increment());  // → 1
console.log(c.increment());  // → 2
console.log(c.increment());  // → 3
console.log(c.decrement());  // → 2
console.log(c.getCount());   // → 2
```

**Giải thích:** `counter()` trả về một object chứa 3 arrow functions. Cả 3 hàm này đều là **closure** — chúng "nhớ" biến `count` từ scope của hàm cha `counter()`. Mỗi lần gọi `increment()`, biến `count` trong closure tăng lên 1 và trả về giá trị mới (prefix `++`). `decrement()` giảm 1. `getCount()` chỉ đọc giá trị hiện tại. Tất cả chia sẻ cùng 1 biến `count`.

---

**Dự đoán output Đoạn 2:**

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 100);
}
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let:", j), 200);
}
// Output sau 200ms:
// var: 3
// var: 3
// var: 3
// let: 0
// let: 1
// let: 2
```

**Giải thích chi tiết — tại sao `var` và `let` cho kết quả khác nhau trong vòng lặp setTimeout:**

- **`var i`** có **function scope** (hoặc global scope nếu không trong function). Toàn bộ vòng lặp chỉ tạo ra **1 biến `i` duy nhất** được chia sẻ. Khi 3 callback của `setTimeout` được thực thi (sau 100ms, lúc đó vòng lặp đã chạy xong), biến `i` đã có giá trị `3` (điều kiện dừng vòng lặp). Vì tất cả closures đều tham chiếu đến cùng 1 biến `i`, cả 3 đều in ra `3`.

- **`let j`** có **block scope**. Mỗi lần lặp tạo ra **1 binding `j` mới và độc lập**. Arrow function callback trong mỗi iteration capture đúng giá trị `j` tại thời điểm tạo closure đó (`0`, `1`, `2`). Khi callback chạy sau 200ms, mỗi closure vẫn giữ đúng giá trị `j` của vòng lặp tương ứng.

**Minh họa cơ chế:**
```javascript
// var: Tưởng tượng như thế này
var i;  // 1 biến duy nhất cho cả vòng lặp
for (i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // tất cả đều nhìn vào i này
}
// Khi callback chạy: i = 3 → in ra 3, 3, 3

// let: Tưởng tượng như thế này
for (...) {
    let j = 0;  // biến mới mỗi iteration
    setTimeout(() => console.log(j), 200);  // mỗi callback capture j riêng
    // j++
}
// Khi callback chạy: j của từng closure là 0, 1, 2
```

---

### Câu A3

```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Lấy các số chẵn → [2, 4, 6, 8, 10]
const chanNums = nums.filter(n => n % 2 === 0);

// 2. Nhân mỗi số với 3 → [3, 6, 9, ..., 30]
const nhan3 = nums.map(n => n * 3);

// 3. Tính tổng tất cả → 55
const tong = nums.reduce((acc, n) => acc + n, 0);

// 4. Tìm số đầu tiên > 7 → 8
const dauTienLon7 = nums.find(n => n > 7);

// 5. Kiểm tra CÓ số > 10 không → false
const coSoLon10 = nums.some(n => n > 10);

// 6. Kiểm tra TẤT CẢ đều > 0 → true
const tatCaLon0 = nums.every(n => n > 0);

// 7. Tạo mảng "Số X là [chẵn/lẻ]" → ["Số 1 là lẻ", "Số 2 là chẵn", ...]
const chanLe = nums.map(n => `Số ${n} là ${n % 2 === 0 ? "chẵn" : "lẻ"}`);

// 8. Đảo ngược mảng (không mutate gốc) → [10, 9, ..., 1]
const daoNguoc = [...nums].reverse();
```

---

### Câu A4

**Dự đoán output:**

```javascript
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: { ram: 8, storage: 256, color: "Titan" }
};

// Destructuring
const { name, price, specs: { ram, color } } = product;
console.log(name, price, ram, color);  // → "iPhone 16" 25990000 8 "Titan"
console.log(specs);                     // → ReferenceError: specs is not defined
```

**Giải thích `specs` bị lỗi:** Khi viết `specs: { ram, color }`, cú pháp destructuring nested có nghĩa là "lấy `specs` rồi destructure tiếp thành `ram` và `color`". Biến được tạo ra là `ram` và `color`, **không phải** `specs`. Vì vậy `console.log(specs)` ném `ReferenceError`.

```javascript
// Spread
const updated = { ...product, price: 23990000, sale: true };
console.log(updated.price);            // → 23990000  (giá mới ghi đè giá cũ)
console.log(updated.sale);             // → true
console.log(product.price);            // → 25990000  (gốc KHÔNG đổi — spread tạo object mới)

// Spread gotcha
const copy = { ...product };
copy.specs.ram = 16;
console.log(product.specs.ram);        // → 16
```

**Giải thích Spread gotcha — tại sao ra `16` chứ không phải `8`:**

`{ ...product }` chỉ tạo **shallow copy** (bản sao nông). Nghĩa là các property ở tầng đầu tiên (`name`, `price`) được copy giá trị mới. Nhưng `specs` là một **object** — spread chỉ copy **tham chiếu (reference)** đến object đó, không tạo object `specs` mới. Vậy nên `copy.specs` và `product.specs` **trỏ đến cùng 1 object** trong bộ nhớ. Khi `copy.specs.ram = 16`, thực chất đang sửa object được chia sẻ đó → `product.specs.ram` cũng thành `16`.

Để tránh lỗi này, cần deep copy:
```javascript
const copy = { ...product, specs: { ...product.specs } };
// Hoặc: const copy = structuredClone(product);
```

---

## PHẦN C — SUY LUẬN

---

### Câu C1

**Code gốc (ugly):**
```javascript
// TRƯỚC (ugly code):
function processOrders(orders) {
    var result = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === "completed") {
            if (orders[i].total > 100000) {
                var item = {};
                item.id = orders[i].id;
                item.customer = orders[i].customer;
                item.total = orders[i].total;
                item.discount = orders[i].total * 0.1;
                item.finalTotal = orders[i].total - item.discount;
                result.push(item);
            }
        }
    }
    // Sort by finalTotal descending
    for (var j = 0; j < result.length; j++) {
        for (var k = j + 1; k < result.length; k++) {
            if (result[j].finalTotal < result[k].finalTotal) {
                var temp = result[j];
                result[j] = result[k];
                result[k] = temp;
            }
        }
    }
    return result;
}
```

**Code sau khi refactor (≤ 10 dòng):**

```javascript
function processOrders(orders) {
    return orders
        .filter(({ status, total }) => status === "completed" && total > 100000)
        .map(({ id, customer, total }) => ({
            id,
            customer,
            total,
            discount: total * 0.1,
            finalTotal: total * 0.9
        }))
        .sort((a, b) => b.finalTotal - a.finalTotal);
}
```

**Giải thích các cải tiến:**
- Thay 2 vòng `for` lồng nhau bằng `filter` → loại orders không hợp lệ trong 1 bước
- Thay khởi tạo object thủ công bằng `map` với destructuring → gọn, rõ ràng
- `finalTotal: total * 0.9` thay cho `total - total * 0.1` (tương đương, ngắn hơn)
- Thay bubble sort O(n²) bằng `.sort()` built-in với comparator
- Dùng `const`/destructuring thay `var` → tránh scope leak

---

### Câu C2

```javascript
const miniArray = {
    map(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },

    filter(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },

    reduce(arr, fn, initialValue) {
        let accumulator = initialValue;
        const startIndex = initialValue !== undefined ? 0 : 1;
        if (initialValue === undefined) {
            accumulator = arr[0];
        }
        for (let i = startIndex; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }
        return accumulator;
    }
};

// Test phải pass:
console.log(miniArray.map([1,2,3], x => x * 2));           // → [2,4,6]
console.log(miniArray.filter([1,2,3,4], x => x > 2));      // → [3,4]
console.log(miniArray.reduce([1,2,3,4], (a,b) => a+b, 0)); // → 10
```

**Giải thích implementation:**

- **`map(arr, fn)`**: Duyệt từng phần tử, gọi `fn(element, index, array)` — đúng với signature của `Array.prototype.map`. Push kết quả vào mảng mới, trả về mảng mới (không mutate gốc).

- **`filter(arr, fn)`**: Duyệt từng phần tử, gọi `fn` như callback kiểm tra điều kiện. Chỉ push vào result nếu callback trả về `truthy`. Không mutate mảng gốc.

- **`reduce(arr, fn, initialValue)`**: Xử lý cả 2 trường hợp — có và không có `initialValue`. Nếu có `initialValue`: accumulator bắt đầu là `initialValue`, duyệt từ index `0`. Nếu không có: accumulator bắt đầu là `arr[0]`, duyệt từ index `1`. Callback `fn(accumulator, currentValue, index, array)` theo đúng signature gốc.
