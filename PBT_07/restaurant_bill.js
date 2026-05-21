// ============================================================
// DỮ LIỆU ĐƠN HÀNG (Input)
// ============================================================

const order = [
    { name: "Phở bò",   qty: 2, price: 65000 },
    { name: "Trà đá",   qty: 3, price: 5000  },
    { name: "Bún chả",  qty: 1, price: 55000 },
];

const includeTip = true;   // true = có tip, false = không

// ============================================================
// HÀM TÍNH HÓA ĐƠN
// ============================================================

function tinhHoaDon(items, hasTip) {
    // 1. Tính tổng từng món và tổng cộng
    const chiTiet = items.map(function(item) {
        return {
            name: item.name,
            qty: item.qty,
            price: item.price,
            thanh: item.qty * item.price
        };
    });

    let tongCong = 0;
    for (let i = 0; i < chiTiet.length; i++) {
        tongCong += chiTiet[i].thanh;
    }

    // 2. Tính giảm giá
    let phanTramGiam = 0;
    if (tongCong > 1000000) {
        phanTramGiam = 15;
    } else if (tongCong > 500000) {
        phanTramGiam = 10;
    }

    // Kiểm tra ngày thứ 3 (getDay() = 3 là thứ Tư)
    const today = new Date();
    const isWednesday = today.getDay() === 3;
    if (isWednesday) {
        phanTramGiam += 5;
    }

    const tienGiam = Math.round(tongCong * phanTramGiam / 100);
    const sauGiam = tongCong - tienGiam;

    // 3. VAT 8%
    const vat = Math.round(sauGiam * 0.08);

    // 4. Tip 5% (optional)
    const tip = hasTip ? Math.round(sauGiam * 0.05) : 0;

    // 5. Tổng thanh toán
    const thanhToan = sauGiam + vat + tip;

    return { chiTiet, tongCong, phanTramGiam, tienGiam, sauGiam, vat, tip, thanhToan, isWednesday };
}

// ============================================================
// HÀM FORMAT SỐ TIỀN
// ============================================================

function fmt(so) {
    return so.toLocaleString("vi-VN") + "đ";
}

// ============================================================
// HÀM IN HÓA ĐƠN
// ============================================================

function inHoaDon(items, hasTip) {
    const hd = tinhHoaDon(items, hasTip);

    const WIDTH = 42;

    function line(left, right) {
        const space = WIDTH - 2 - left.length - right.length;
        return "║ " + left + " ".repeat(Math.max(space, 1)) + right + " ║";
    }

    function separator() {
        return "╠" + "═".repeat(WIDTH) + "╣";
    }

    console.log("╔" + "═".repeat(WIDTH) + "╗");
    console.log("║" + " ".repeat(WIDTH) + "║");

    const title = "HÓA ĐƠN NHÀ HÀNG";
    const titlePad = Math.floor((WIDTH - title.length) / 2);
    console.log("║" + " ".repeat(titlePad) + title + " ".repeat(WIDTH - titlePad - title.length) + "║");

    // In ngày giờ
    const now = new Date();
    const ngayGio = now.toLocaleString("vi-VN");
    const ngayPad = Math.floor((WIDTH - ngayGio.length) / 2);
    console.log("║" + " ".repeat(ngayPad) + ngayGio + " ".repeat(WIDTH - ngayPad - ngayGio.length) + "║");

    if (hd.isWednesday) {
        const wTag = "🎉 Thứ Tư — Giảm thêm 5%";
        const wPad = Math.floor((WIDTH - wTag.length) / 2);
        console.log("║" + " ".repeat(wPad) + wTag + " ".repeat(WIDTH - wPad - wTag.length) + "║");
    }

    console.log("║" + " ".repeat(WIDTH) + "║");
    console.log(separator());

    // Chi tiết từng món
    for (let i = 0; i < hd.chiTiet.length; i++) {
        const item = hd.chiTiet[i];
        const stt = `${i + 1}. ${item.name}`;
        const detail = `x${item.qty}  @${(item.price / 1000).toFixed(0)}k = ${(item.thanh / 1000).toFixed(0)}k`;
        console.log(line(stt, detail));
    }

    console.log(separator());
    console.log(line("Tổng cộng:", fmt(hd.tongCong)));
    console.log(line(`Giảm giá (${hd.phanTramGiam}%):`, hd.tienGiam > 0 ? `-${fmt(hd.tienGiam)}` : fmt(0)));
    console.log(line("VAT (8%):", fmt(hd.vat)));
    if (hasTip) {
        console.log(line("Tip (5%):", fmt(hd.tip)));
    }
    console.log(separator());
    console.log(line("THANH TOÁN:", fmt(hd.thanhToan)));
    console.log("╚" + "═".repeat(WIDTH) + "╝");
}

// ============================================================
// CHẠY CHƯƠNG TRÌNH
// ============================================================

inHoaDon(order, includeTip);

// Test với đơn lớn hơn để kiểm tra giảm giá
console.log("\n\n--- Test đơn > 500k ---");
const bigOrder = [
    { name: "Bò bít tết",   qty: 3, price: 120000 },
    { name: "Nước ép cam",  qty: 4, price: 45000  },
    { name: "Salad Nga",    qty: 2, price: 85000  },
];
inHoaDon(bigOrder, false);

console.log("\n\n--- Test đơn > 1 triệu ---");
const vipOrder = [
    { name: "Lẩu bò wagyu",  qty: 2, price: 380000 },
    { name: "Rượu vang đỏ",  qty: 1, price: 450000 },
    { name: "Tráng miệng",   qty: 3, price: 95000  },
];
inHoaDon(vipOrder, true);
