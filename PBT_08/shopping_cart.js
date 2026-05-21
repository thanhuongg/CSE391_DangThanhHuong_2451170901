function createCart() {
    // Private data
    let items = [];
    let discountInfo = null; // { code, type, value }

    return {
        // Thêm sản phẩm (nếu đã có → tăng quantity)
        addItem(product, quantity = 1) {
            const existing = items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                items.push({ ...product, quantity });
            }
        },

        // Xóa sản phẩm theo id
        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },

        // Cập nhật số lượng
        updateQuantity(productId, newQuantity) {
            const item = items.find(item => item.id === productId);
            if (item) {
                if (newQuantity <= 0) {
                    items = items.filter(item => item.id !== productId);
                } else {
                    item.quantity = newQuantity;
                }
            }
        },

        // Tính tổng tiền (trước giảm giá)
        getTotal() {
            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            if (!discountInfo) return subtotal;

            if (discountInfo.type === "percent") {
                return subtotal * (1 - discountInfo.value);
            } else if (discountInfo.type === "fixed") {
                return Math.max(0, subtotal - discountInfo.value);
            }
            return subtotal;
        },

        // Áp dụng mã giảm giá
        // Codes: "SALE10" → -10%, "SALE20" → -20%, "FREESHIP" → -30000
        applyDiscount(code) {
            const codes = {
                "SALE10":   { type: "percent", value: 0.1 },
                "SALE20":   { type: "percent", value: 0.2 },
                "FREESHIP": { type: "fixed",   value: 30000 }
            };
            if (codes[code]) {
                discountInfo = { code, ...codes[code] };
                console.log(`Áp dụng mã "${code}" thành công!`);
            } else {
                console.log(`Mã giảm giá "${code}" không hợp lệ.`);
            }
        },

        // In giỏ hàng dạng bảng
        printCart() {
            const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const total = this.getTotal();

            const line = "─".repeat(62);
            const topLine    = "┌" + "─".repeat(62) + "┐";
            const headerLine = "├" + "─".repeat(62) + "┤";
            const bottomLine = "└" + "─".repeat(62) + "┘";

            const pad = (str, len) => {
                const s = String(str);
                return s.length >= len ? s.slice(0, len) : s + " ".repeat(len - s.length);
            };
            const padLeft = (str, len) => {
                const s = String(str);
                return s.length >= len ? s.slice(0, len) : " ".repeat(len - s.length) + s;
            };

            console.log(topLine);
            console.log(`│ ${pad("#", 2)} │ ${pad("Sản phẩm", 14)} │ ${pad("SL", 3)} │ ${padLeft("Đơn giá", 12)} │ ${padLeft("Tổng", 12)} │`);
            console.log(headerLine);

            items.forEach((item, idx) => {
                const itemTotal = item.price * item.quantity;
                console.log(`│ ${pad(idx + 1, 2)} │ ${pad(item.name, 14)} │ ${padLeft(item.quantity, 3)} │ ${padLeft(item.price.toLocaleString(), 12)} │ ${padLeft(itemTotal.toLocaleString(), 12)} │`);
            });

            console.log(headerLine);

            if (discountInfo) {
                let discountStr = "";
                if (discountInfo.type === "percent") {
                    const discountAmount = subtotal * discountInfo.value;
                    discountStr = `Giảm giá (${discountInfo.code}): -${discountAmount.toLocaleString()}đ`;
                } else {
                    discountStr = `Giảm giá (${discountInfo.code}): -${discountInfo.value.toLocaleString()}đ`;
                }
                console.log(`│ ${pad(discountStr, 60)} │`);
            }

            const totalStr = `Tổng cộng: ${total.toLocaleString()}đ`;
            console.log(`│ ${padLeft(totalStr, 60)} │`);
            console.log(bottomLine);
        },

        // Lấy tổng số sản phẩm (tổng quantity)
        getItemCount() {
            return items.reduce((sum, item) => sum + item.quantity, 0);
        },

        // Xóa toàn bộ giỏ
        clearCart() {
            items = [];
            discountInfo = null;
        }
    };
}

// ============================================================
// TEST
// ============================================================

const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16",   price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 },  2);
cart.addItem({ id: 1, name: "iPhone 16",   price: 25990000 }, 1); // Tăng lên 2

cart.printCart();
// Kỳ vọng:
// ┌──────────────────────────────────────────────┐
// │ # │ Sản phẩm      │ SL │ Đơn giá     │ Tổng        │
// │ 1 │ iPhone 16      │  2 │ 25.990.000  │ 51.980.000  │
// │ 2 │ AirPods Pro    │  2 │  6.990.000  │ 13.980.000  │
// ├──────────────────────────────────────────────┤
// │ Tổng cộng:                       65.960.000đ │
// └──────────────────────────────────────────────┘

cart.applyDiscount("SALE10");
cart.printCart();
// → Tổng: 59.364.000đ (giảm 10%)

console.log("Số SP:", cart.getItemCount()); // → 4
cart.removeItem(3);
console.log("Sau xóa:", cart.getItemCount()); // → 2

console.log("\n=== TEST updateQuantity ===");
cart.updateQuantity(1, 5);
cart.printCart();

console.log("\n=== TEST applyDiscount SALE20 ===");
const cart2 = createCart();
cart2.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart2.applyDiscount("SALE20");
cart2.printCart();

console.log("\n=== TEST applyDiscount FREESHIP ===");
const cart3 = createCart();
cart3.addItem({ id: 7, name: "Galaxy Buds", price: 3490000 }, 1);
cart3.applyDiscount("FREESHIP");
cart3.printCart();

console.log("\n=== TEST clearCart ===");
cart.clearCart();
console.log("Sau clearCart, số SP:", cart.getItemCount()); // → 0
