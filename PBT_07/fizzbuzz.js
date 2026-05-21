
console.log("====== VERSION 1: Classic FizzBuzz (1-100) ======\n");

for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) {
        console.log(`${i}: FizzBuzz`);
    } else if (i % 3 === 0) {
        console.log(`${i}: Fizz`);
    } else if (i % 5 === 0) {
        console.log(`${i}: Buzz`);
    } else {
        console.log(`${i}: ${i}`);
    }
}


console.log("\n====== VERSION 2: Custom FizzBuzz ======");

function customFizzBuzz(n, rules) {
    for (let i = 1; i <= n; i++) {
        let word = "";

        for (let r = 0; r < rules.length; r++) {
            if (i % rules[r].divisor === 0) {
                word += rules[r].word;
            }
        }

        if (word === "") {
            word = String(i);
        }

        console.log(`${i}: ${word}`);
    }
}

console.log("\n--- Test: divisors 3(Fizz), 5(Buzz), 7(Jazz), n=30 ---");
customFizzBuzz(30, [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
]);

console.log("\n--- Kiểm tra các số đặc biệt ---");
console.log("21 (3×7)  nên là FizzJazz");
console.log("15 (3×5)  nên là FizzBuzz");
console.log("35 (5×7)  nên là BuzzJazz");
console.log("105(3×5×7) nên là FizzBuzzJazz (minh họa ngoài n=30):");

customFizzBuzz(105, [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
]);
