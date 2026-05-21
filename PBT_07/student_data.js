const students = [
    { name: "An",    math: 8,  physics: 7, cs: 9, gender: "M" },
    { name: "Bình",  math: 6,  physics: 9, cs: 7, gender: "F" },
    { name: "Chi",   math: 9,  physics: 6, cs: 8, gender: "F" },
    { name: "Dũng",  math: 5,  physics: 5, cs: 6, gender: "M" },
    { name: "Em",    math: 10, physics: 8, cs: 9, gender: "F" },
    { name: "Phong", math: 3,  physics: 4, cs: 5, gender: "M" },
    { name: "Giang", math: 7,  physics: 7, cs: 7, gender: "F" },
    { name: "Huy",   math: 4,  physics: 6, cs: 3, gender: "M" },
];


function tinhDiemTB(student) {
    return student.math * 0.4 + student.physics * 0.3 + student.cs * 0.3;
}

function xepLoai(diemTB) {
    if (diemTB >= 8.0) return "Giỏi";
    if (diemTB >= 6.5) return "Khá";
    if (diemTB >= 5.0) return "Trung bình";
    return "Yếu";
}

const results = [];
for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const diemTB = tinhDiemTB(student);
    results.push({
        stt: i + 1,
        name: student.name,
        gender: student.gender,
        math: student.math,
        physics: student.physics,
        cs: student.cs,
        diemTB: diemTB,
        xepLoai: xepLoai(diemTB)
    });
}

console.log("====== BẢNG KẾT QUẢ HỌC TẬP ======\n");

// In header
console.log("| STT | Tên    | TB   | Xếp loại    |");
console.log("|-----|--------|------|-------------|");

for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const stt = String(r.stt).padEnd(3);
    const name = r.name.padEnd(6);
    const tb = r.diemTB.toFixed(1).padEnd(4);
    const loai = r.xepLoai.padEnd(11);
    console.log(`| ${stt} | ${name} | ${tb} | ${loai} |`);
}


console.log("\n====== THỐNG KÊ XẾP LOẠI ======");
const soLuongXepLoai = { "Giỏi": 0, "Khá": 0, "Trung bình": 0, "Yếu": 0 };

for (let i = 0; i < results.length; i++) {
    soLuongXepLoai[results[i].xepLoai]++;
}

const cacLoai = ["Giỏi", "Khá", "Trung bình", "Yếu"];
for (let i = 0; i < cacLoai.length; i++) {
    console.log(`${cacLoai[i]}: ${soLuongXepLoai[cacLoai[i]]} sinh viên`);
}

console.log("\n====== ĐIỂM CAO NHẤT / THẤP NHẤT ======");
let svCaoNhat = results[0];
let svThapNhat = results[0];

for (let i = 1; i < results.length; i++) {
    if (results[i].diemTB > svCaoNhat.diemTB) {
        svCaoNhat = results[i];
    }
    if (results[i].diemTB < svThapNhat.diemTB) {
        svThapNhat = results[i];
    }
}

console.log(`Cao nhất: ${svCaoNhat.name} — ${svCaoNhat.diemTB.toFixed(1)} điểm (${svCaoNhat.xepLoai})`);
console.log(`Thấp nhất: ${svThapNhat.name} — ${svThapNhat.diemTB.toFixed(1)} điểm (${svThapNhat.xepLoai})`);

console.log("\n====== ĐIỂM TB TỪNG MÔN TOÀN LỚP ======");
let tongMath = 0;
let tongPhysics = 0;
let tongCS = 0;

for (let i = 0; i < students.length; i++) {
    tongMath    += students[i].math;
    tongPhysics += students[i].physics;
    tongCS      += students[i].cs;
}

const n = students.length;
console.log(`Toán:    ${(tongMath / n).toFixed(2)}`);
console.log(`Lý:      ${(tongPhysics / n).toFixed(2)}`);
console.log(`CNTT:    ${(tongCS / n).toFixed(2)}`);

console.log("\n====== BONUS: ĐIỂM TB THEO GIỚI TÍNH ======");
let tongTBNam = 0;
let soNam = 0;
let tongTBNu = 0;
let soNu = 0;

for (let i = 0; i < results.length; i++) {
    if (results[i].gender === "M") {
        tongTBNam += results[i].diemTB;
        soNam++;
    } else {
        tongTBNu += results[i].diemTB;
        soNu++;
    }
}

console.log(`Nam (${soNam} SV): TB = ${(tongTBNam / soNam).toFixed(2)}`);
console.log(`Nữ  (${soNu} SV): TB = ${(tongTBNu / soNu).toFixed(2)}`);
