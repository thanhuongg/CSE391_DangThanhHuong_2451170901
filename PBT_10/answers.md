
---

## PHẦN A — KIỂM TRA ĐỌC HIỂU

### Câu A1 (5đ) — Thứ tự output + Event Loop

**Thứ tự output:**
```
1 - Start
4 - End
3 - Promise
6 - Promise 2
2 - Timeout 0ms
7 - Nested timeout
5 - Timeout 100ms
```

**Giải thích chi tiết:**

JavaScript là **single-threaded** — chỉ chạy 1 việc tại một thời điểm. Để xử lý async mà không block UI, JS dùng **Event Loop** phối hợp với 2 hàng đợi:

**Call Stack → Microtask Queue → Macrotask Queue**

| Hàng đợi | Chứa gì | Ưu tiên | Ví dụ |
|---|---|---|---|
| **Call Stack** | Code đang chạy trực tiếp | Cao nhất | `console.log`, function calls |
| **Microtask Queue** | Callback của Promise | Cao — chạy hết trước khi macrotask | `.then()`, `await`, `queueMicrotask()` |
| **Macrotask Queue** | Callback của timer, event | Thấp — mỗi vòng loop chỉ lấy 1 | `setTimeout`, `setInterval`, DOM events |

**Trace từng bước:**

1. `console.log("1 - Start")` → **Call Stack** chạy ngay → in `1 - Start`
2. `setTimeout(..., 0)` → callback đưa vào **Macrotask Queue** (dù delay 0, vẫn phải qua queue)
3. `Promise.resolve().then(...)` → `.then` callback đưa vào **Microtask Queue**
4. `console.log("4 - End")` → **Call Stack** chạy ngay → in `4 - End`
5. `setTimeout(..., 100)` → callback vào **Macrotask Queue** (sau 100ms)
6. `Promise.resolve().then(...)` → 2 callback vào **Microtask Queue** (callback của Promise 2)

**Call Stack trống → Event Loop kiểm tra Microtask Queue trước:**

7. Microtask 1: in `3 - Promise`
8. Microtask 2: in `6 - Promise 2`, đồng thời đăng ký `setTimeout(..., 0)` → vào **Macrotask Queue**

**Microtask Queue rỗng → lấy 1 Macrotask:**

9. Macrotask: in `2 - Timeout 0ms`

**Kiểm tra Microtask Queue (rỗng) → Macrotask tiếp:**

10. Macrotask (nested): in `7 - Nested timeout`
11. Sau 100ms: Macrotask → in `5 - Timeout 100ms`

**Quy tắc vàng:** Sau mỗi macrotask, Event Loop **drain toàn bộ Microtask Queue** trước khi lấy macrotask tiếp theo. Đây là lý do Promise luôn chạy trước setTimeout dù setTimeout delay = 0ms.

---

### Câu A2 (5đ) — Giải thích Fetch API

```javascript
async function getData() {
    try {
        const response = await fetch("https://api.example.com/data");
        //        (1)    (2)     (3)
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        //     (4)
        
        const data = await response.json();
        //           (5)
        return data;
    } catch (error) {
        console.error("Failed:", error.message);
        //     (6)
        return null;
    }
}
```

**1. `await fetch(...)` — fetch trả về gì? Tại sao cần `await`?**

`fetch()` trả về một **Promise\<Response\>** — không phải data ngay, mà là lời hứa "tôi sẽ trả Response khi xong". Nếu không có `await`, `response` sẽ là một `Promise` object chứ không phải `Response` thực sự, không thể đọc `.ok`, `.status`, `.json()`.

`await` "dừng" hàm tại chỗ đó (không block thread), chờ Promise resolve xong mới tiếp tục. Lúc chờ, JS thread vẫn xử lý việc khác.

**2. `response.ok` — Khi nào `false`? 3 status codes:**

`response.ok` là `true` khi status code nằm trong **200–299** (success range). `false` khi:

| Status Code | Ý nghĩa | `response.ok` |
|---|---|---|
| `404 Not Found` | URL không tồn tại | `false` |
| `500 Internal Server Error` | Lỗi server | `false` |
| `429 Too Many Requests` | Rate limit bị vượt | `false` |
| `200 OK` | Thành công | `true` |

**Lưu ý quan trọng:** `fetch()` **KHÔNG tự động throw error** cho 4xx/5xx — nó chỉ throw khi có **network error** (mất mạng, CORS block, DNS fail). Vì vậy phải tự kiểm tra `response.ok`.

**3. `response.json()` — Tại sao cần `await` lần nữa?**

`response.json()` cũng trả về **Promise** — nó cần đọc và parse toàn bộ body response (có thể vài KB đến vài MB) từ stream. Body chưa chắc đã download hết khi `fetch()` resolve — `fetch()` chỉ đảm bảo **headers** đã về, còn body vẫn đang stream. Vì vậy cần `await response.json()` để chờ parse xong.

Tương tự: `response.text()`, `response.blob()`, `response.arrayBuffer()` đều trả về Promise.

**4. `try...catch` — Catch những lỗi gì?**

| Loại lỗi | `catch` bắt được? | Ghi chú |
|---|---|---|
| **Network error** (mất mạng, DNS fail, CORS) | ✅ Có | `fetch()` throw TypeError |
| **404, 500 (HTTP errors)** | ❌ Không tự động | Phải tự `throw` qua `if (!response.ok)` như code trên |
| **JSON parse error** (server trả HTML thay vì JSON) | ✅ Có | `response.json()` throw SyntaxError |
| **Timeout** | ❌ Không tự động | Phải tự implement bằng `AbortController` |

---

### Câu A3 (5đ) — Promise States + Callback Hell

**Sơ đồ 3 trạng thái của Promise:**

```
                    ┌─────────────────────┐
                    │                     │
                    │      PENDING        │  ← Trạng thái khởi tạo
                    │  (đang chờ kết quả) │
                    │                     │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │ resolve(value)          │ reject(error)
                  ▼                         ▼
     ┌────────────────────┐    ┌──────────────────────┐
     │                    │    │                      │
     │    FULFILLED       │    │      REJECTED        │
     │  (thành công)      │    │   (thất bại)         │
     │  .then() chạy      │    │   .catch() chạy      │
     │                    │    │                      │
     └────────────────────┘    └──────────────────────┘
              │                          │
              └────────────┬─────────────┘
                           ▼
                  .finally() luôn chạy
                  (dù fulfilled hay rejected)

Lưu ý: Promise chỉ có thể chuyển trạng thái MỘT LẦN
        Fulfilled/Rejected là trạng thái CUỐI — không thể thay đổi
```

**Callback Hell là gì?**

Callback Hell (còn gọi là "Pyramid of Doom") xảy ra khi nhiều async operations phụ thuộc nhau, phải lồng callback vào trong callback, tạo ra code hình tam giác, rất khó đọc và maintain.

**Ví dụ 4 cấp Callback Hell — lấy dữ liệu user → posts → comments → likes:**

```javascript
// ❌ CALLBACK HELL — khó đọc, khó xử lý lỗi
function loadUserData(userId) {
    getUser(userId, function(user) {
        if (user) {
            getPosts(user.id, function(posts) {
                if (posts.length > 0) {
                    getComments(posts[0].id, function(comments) {
                        if (comments.length > 0) {
                            getLikes(comments[0].id, function(likes) {
                                // Cuối cùng mới làm được gì đó
                                console.log("Likes:", likes.count);
                                // Xử lý lỗi ở mỗi cấp = địa ngục
                            }, function(err) { console.error("Likes lỗi", err); });
                        }
                    }, function(err) { console.error("Comments lỗi", err); });
                }
            }, function(err) { console.error("Posts lỗi", err); });
        }
    }, function(err) { console.error("User lỗi", err); });
}
```

**Refactor thành async/await — sạch, dễ đọc, xử lý lỗi tập trung:**

```javascript
// ✅ ASYNC/AWAIT — code tuyến tính như sync
async function loadUserData(userId) {
    try {
        const user     = await getUser(userId);
        const posts    = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        const likes    = await getLikes(comments[0].id);

        console.log("Likes:", likes.count);
    } catch (error) {
        // Xử lý lỗi tập trung ở 1 chỗ — dù lỗi ở bước nào
        console.error("Có lỗi xảy ra:", error.message);
    }
}
```

---

## PHẦN C — PHÂN TÍCH

### Câu C1 (10đ) — Error Handling Strategy cho E-Commerce

**1. Network errors (mất mạng giữa chừng):**

```javascript
// Kiểm tra network trước khi gọi API
async function safeFetch(url, options = {}) {
    if (!navigator.onLine) {
        throw new Error("Không có kết nối internet. Vui lòng kiểm tra mạng.");
    }
    return fetch(url, options);
}

// Lắng nghe sự kiện mạng thay đổi để thông báo user
window.addEventListener("offline", () => {
    showToast("Mất kết nối mạng. Một số tính năng có thể không hoạt động.", "warning");
});

window.addEventListener("online", () => {
    showToast("Đã kết nối lại. Đang tải lại dữ liệu...", "success");
    reloadCurrentData(); // Tải lại data đang hiển thị
});
```

**2. API errors — xử lý từng loại status code:**

```javascript
async function handleAPIResponse(response) {
    if (response.ok) return response.json();

    // Đọc error message từ server nếu có
    let serverMessage = "";
    try {
        const errData = await response.json();
        serverMessage = errData.message || errData.error || "";
    } catch {}

    switch (response.status) {
        case 400:
            throw new Error(`Dữ liệu không hợp lệ. ${serverMessage}`);
        case 401:
            // Token hết hạn → logout và redirect
            clearAuthToken();
            window.location.href = "/login?reason=session_expired";
            throw new Error("Phiên đăng nhập hết hạn.");
        case 403:
            throw new Error("Bạn không có quyền thực hiện thao tác này.");
        case 404:
            throw new Error("Không tìm thấy dữ liệu yêu cầu.");
        case 422:
            throw new Error(`Validation lỗi: ${serverMessage}`);
        case 429:
            // Rate limit — đợi rồi thử lại
            const retryAfter = response.headers.get("Retry-After") || 60;
            throw new RateLimitError(`Quá nhiều yêu cầu. Thử lại sau ${retryAfter}s.`, retryAfter);
        case 500:
        case 502:
        case 503:
            throw new Error("Lỗi hệ thống. Vui lòng thử lại sau.");
        default:
            throw new Error(`Lỗi không xác định: HTTP ${response.status}`);
    }
}

class RateLimitError extends Error {
    constructor(message, retryAfter) {
        super(message);
        this.retryAfter = retryAfter;
        this.name = "RateLimitError";
    }
}
```

**3. Timeout — `fetchWithTimeout(url, ms)`:**

```javascript
async function fetchWithTimeout(url, ms = 10000, options = {}) {
    const controller = new AbortController();

    // Hủy request sau `ms` milliseconds
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, ms);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal   // Gắn AbortSignal vào fetch
        });
        clearTimeout(timeoutId);        // Request xong → hủy timeout
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error(`Request timeout sau ${ms / 1000}s. Server không phản hồi.`);
        }
        throw error;
    }
}

// Dùng:
const response = await fetchWithTimeout("https://api.example.com/products", 10000);
```

**4. Retry logic — `fetchWithRetry(url, maxRetries)`:**

```javascript
async function fetchWithRetry(url, maxRetries = 3, options = {}) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Thử lần ${attempt}/${maxRetries}...`);
            const response = await fetchWithTimeout(url, 10000, options);
            return response; // Thành công → trả về ngay
        } catch (error) {
            lastError = error;

            // Không retry nếu là lỗi client (4xx) hoặc timeout do user cancel
            if (error instanceof RateLimitError) {
                // Đợi đúng thời gian server yêu cầu
                await delay(error.retryAfter * 1000);
                continue;
            }

            if (!shouldRetry(error)) throw error;

            if (attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                const waitMs = Math.pow(2, attempt - 1) * 1000;
                console.log(`Thất bại. Thử lại sau ${waitMs / 1000}s...`);
                await delay(waitMs);
            }
        }
    }

    throw new Error(`Thất bại sau ${maxRetries} lần thử: ${lastError.message}`);
}

function shouldRetry(error) {
    // Chỉ retry các lỗi có thể phục hồi
    return error.message.includes("timeout") ||
           error.message.includes("network") ||
           error.message.includes("Lỗi hệ thống");
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dùng:
const response = await fetchWithRetry("https://api.example.com/orders", 3);
```

---

### Câu C2 (10đ) — Promise.all vs allSettled vs race vs any

| Method | Resolve khi | Reject khi | Use case |
|---|---|---|---|
| `.all()` | **TẤT CẢ** promises fulfilled | **BẤT KỲ** 1 promise bị reject | Cần tất cả data mới render được (vd: user + permissions + settings) |
| `.allSettled()` | **TẤT CẢ** promises kết thúc (dù fulfilled hay rejected) | **Không bao giờ** tự reject | Dashboard độc lập: 1 widget lỗi không ảnh hưởng widget khác |
| `.race()` | **Cái đầu tiên** settle (fulfilled hoặc rejected) | Cái đầu tiên bị reject | Implement timeout: race giữa fetch và timeout promise |
| `.any()` | **Cái đầu tiên** fulfilled | **TẤT CẢ** đều rejected | Thử nhiều server/CDN, lấy cái nào phản hồi trước |

**Ví dụ code thực tế:**

```javascript
// ============ Promise.all — checkout cần đủ cả 3 ============
async function loadCheckoutPage(userId, cartId) {
    try {
        // Nếu 1 trong 3 fail → throw luôn, không render checkout
        const [user, cart, shippingOptions] = await Promise.all([
            api.getUser(userId),
            api.getCart(cartId),
            api.getShippingOptions()
        ]);
        renderCheckout(user, cart, shippingOptions);
    } catch (error) {
        showError("Không thể tải trang thanh toán: " + error.message);
    }
}

// ============ Promise.allSettled — dashboard widget độc lập ============
async function loadDashboard() {
    const results = await Promise.allSettled([
        api.getSalesData(),       // Widget 1
        api.getInventory(),       // Widget 2
        api.getCustomerReviews()  // Widget 3
    ]);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            renderWidget(index, result.value);
        } else {
            // Widget lỗi hiện thông báo riêng, widget khác vẫn OK
            renderWidgetError(index, result.reason.message);
        }
    });
}

// ============ Promise.race — timeout pattern ============
function fetchWithTimeout(url, timeoutMs) {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout sau ${timeoutMs}ms`)), timeoutMs)
    );
    return Promise.race([fetch(url), timeoutPromise]);
}
// Dùng: await fetchWithTimeout("https://api.example.com/products", 5000)

// ============ Promise.any — fallback CDN ============
async function loadImage(filename) {
    try {
        // Thử 3 CDN cùng lúc, lấy cái nào phản hồi trước
        const url = await Promise.any([
            checkImageURL(`https://cdn1.example.com/${filename}`),
            checkImageURL(`https://cdn2.example.com/${filename}`),
            checkImageURL(`https://cdn3.example.com/${filename}`)
        ]);
        return url; // URL của CDN nhanh nhất
    } catch (aggregateError) {
        // AggregateError: tất cả CDN đều fail
        throw new Error("Không thể tải ảnh từ bất kỳ CDN nào.");
    }
}

async function checkImageURL(url) {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) throw new Error(`CDN ${url} không khả dụng`);
    return url;
}
```
