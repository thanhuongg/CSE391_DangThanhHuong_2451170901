
function pipe(...fns) {
    return function(value) {
        return fns.reduce((acc, fn) => fn(acc), value);
    };
}

const process = pipe(
    x => x * 2,        // 5 → 10
    x => x + 10,       // 10 → 20
    x => x.toString(), // 20 → "20"
    x => "Kết quả: " + x
);
console.log(process(5)); // → "Kết quả: 20"

function memoize(fn) {
    const cache = {};
    return function(...args) {
        const key = JSON.stringify(args);
        if (key in cache) {
            return cache[key];
        }
        cache[key] = fn(...args);
        return cache[key];
    };
}

const expensiveCalc = memoize((n) => {
    console.log("Đang tính...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});
console.log(expensiveCalc(1000000));
console.log(expensiveCalc(1000000));

function debounce(fn, delay) {
    let timerId = null;
    return function(...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
            timerId = null;
        }, delay);
    };
}

const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);

search("i");
search("ip");
search("iph");
search("ipho");
search("iphon");
search("iphone"); // Chỉ lần này được thực thi (sau 500ms)

async function retry(fn, maxAttempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await fn();
            return result;
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt < maxAttempts) {
                console.log(`Thử lại lần ${attempt + 1}...`);
            }
        }
    }
    throw new Error(`Thất bại sau ${maxAttempts} lần thử. Lỗi cuối: ${lastError.message}`);
}

// Demo retry
let callCount = 0;
const unstableApi = () => new Promise((resolve, reject) => {
    callCount++;
    if (callCount < 3) {
        reject(new Error("Network error"));
    } else {
        resolve("Data fetched successfully!");
    }
});

retry(unstableApi, 3)
    .then(result => console.log("retry() kết quả:", result))
    .catch(err => console.log("retry() thất bại:", err.message));
console.log("\n=== PIPE DEMO ===");
const pipeline1 = pipe(
    str => str.trim(),
    str => str.toLowerCase(),
    str => str.replace(/\s+/g, "-")
);
console.log(pipeline1("  Hello World  ")); // → "hello-world"

// Test memoize với fibonacci
console.log("\n=== MEMOIZE FIBONACCI ===");
const fib = memoize((n) => {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
});
console.log(fib(10));  // 55
console.log(fib(40));  // 102334155 — nhanh nhờ cache
