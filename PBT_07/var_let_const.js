console.log("====== ĐOẠN 1: var hoisting ======");
// Dự đoán: undefined (vì var bị hoist, nhưng chưa gán giá trị)
console.log(x);       // → undefined
var x = 5;
console.log("x sau khi gán:", x); // → 5

console.log("\n====== ĐOẠN 2: let Temporal Dead Zone ======");
// Dự đoán: ReferenceError: Cannot access 'y' before initialization
try {
    console.log(y);
    let y = 10;
} catch (e) {
    console.log("Lỗi xảy ra:", e.message);
    // → Cannot access 'y' before initialization
}

console.log("\n====== ĐOẠN 3: const không cho reassign ======");
// Dự đoán: TypeError: Assignment to constant variable.
try {
    const z = 15;
    z = 20;           // → TypeError ném ra tại đây
    console.log(z);   // Dòng này không bao giờ chạy
} catch (e) {
    console.log("Lỗi xảy ra:", e.message);
    // → Assignment to constant variable.
}

console.log("\n====== ĐOẠN 4: const với array — thay đổi nội dung ======");
// Dự đoán: [1, 2, 3, 4]
const arr = [1, 2, 3];
arr.push(4);           // Thay đổi nội dung, không đổi reference → OK
console.log(arr);      // → [1, 2, 3, 4]

console.log("\n====== ĐOẠN 5: let block scope ======");
// Dự đoán: "Trong block: 2" rồi "Ngoài block: 1"
let a = 1;
{
    let a = 2;         // Biến a khác, chỉ tồn tại trong block này
    console.log("Trong block:", a);  // → 2
}
console.log("Ngoài block:", a);      // → 1 (a bên ngoài không bị ảnh hưởng)

// ============================================================
// GIẢI THÍCH CÁC KẾT QUẢ BẤT NGỜ
// ============================================================

console.log("\n====== TỔNG KẾT GIẢI THÍCH ======");

// BẤT NGỜ 1: var → undefined thay vì ReferenceError
// "Tại sao không báo lỗi biến chưa tồn tại?"
// → var bị HOISTING: JS kéo "var x;" lên đầu function/global scope
//   trước khi chạy bất kỳ dòng nào. Nên x tồn tại, nhưng chưa có giá trị.
//   Tương đương với: var x; console.log(x); x = 5;

// BẤT NGỜ 2: let → ReferenceError dù cũng bị hoist
// "Nếu let cũng bị hoist, tại sao lại lỗi?"
// → let bị hoist nhưng ở trong TEMPORAL DEAD ZONE (TDZ).
//   TDZ = vùng từ đầu block đến dòng khai báo.
//   Truy cập biến trong TDZ → ReferenceError (không phải undefined).
//   Đây là behavior cố ý để giúp phát hiện lỗi sớm hơn var.

// BẤT NGỜ 3: const arr.push() không lỗi
// "Tại sao const lại cho phép thay đổi?"
// → const bảo vệ BINDING (liên kết giữa tên biến và vị trí bộ nhớ).
//   arr = ... đổi binding → lỗi.
//   arr.push()  thay đổi NỘI DUNG tại vị trí bộ nhớ đó → không đổi binding → OK.

// QUY TẮC VÀNG:
// - Mặc định dùng const
// - Chỉ dùng let khi cần reassign
// - Không bao giờ dùng var
