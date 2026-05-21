const MAX_TRIES = 7;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

let secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
let attempts = 0;
let guessedNumbers = [];
let gameOver = false;

function startGame() {
    secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    attempts = 0;
    guessedNumbers = [];
    gameOver = false;
    updateUI();
    document.getElementById("inputGuess").disabled = false;
    document.getElementById("btnGuess").disabled = false;
    document.getElementById("result").textContent = "";
    document.getElementById("history").textContent = "";
    document.getElementById("inputGuess").value = "";
    document.getElementById("inputGuess").focus();
}

function makeGuess() {
    if (gameOver) return;

    const input = document.getElementById("inputGuess").value.trim();
    const guess = Number(input);
    if (!input || isNaN(guess) || !Number.isInteger(guess) || guess < MIN_NUMBER || guess > MAX_NUMBER) {
        showMessage(`⚠️ Vui lòng nhập một số nguyên từ ${MIN_NUMBER} đến ${MAX_NUMBER}!`, "warning");
        return;
    }
    if (guessedNumbers.includes(guess)) {
        showMessage(`⚠️ Bạn đã đoán số ${guess} rồi! Hãy thử số khác.`, "warning");
        return;
    }

    guessedNumbers.push(guess);
    attempts++;

    document.getElementById("inputGuess").value = "";
    updateHistory();

    if (guess === secretNumber) {
        showMessage(`🎉 Chính xác! Bạn đoán đúng sau ${attempts} lần!`, "success");
        endGame();
    } else if (attempts >= MAX_TRIES) {
        showMessage(`😞 Hết lượt! Số bí mật là ${secretNumber}. Chơi lại nhé!`, "lose");
        endGame();
    } else {
        // Gợi ý
        const remaining = MAX_TRIES - attempts;
        if (guess < secretNumber) {
            showMessage(`📈 Cao hơn! Còn ${remaining} lần thử.`, "hint");
        } else {
            showMessage(`📉 Thấp hơn! Còn ${remaining} lần thử.`, "hint");
        }
    }
}

function showMessage(msg, type) {
    const el = document.getElementById("result");
    el.textContent = msg;
    el.className = "result " + type;
}

function updateHistory() {
    const el = document.getElementById("history");
    el.textContent = `Các số đã đoán (${attempts}/${MAX_TRIES}): ${guessedNumbers.join(", ")}`;
}

function updateUI() {
    document.getElementById("attemptsBar").style.width = "0%";
}

function endGame() {
    gameOver = true;
    document.getElementById("inputGuess").disabled = true;
    document.getElementById("btnGuess").disabled = true;
    const pct = (attempts / MAX_TRIES) * 100;
    document.getElementById("attemptsBar").style.width = pct + "%";
}

// Cho phép nhấn Enter để đoán
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("inputGuess").addEventListener("keydown", function (e) {
        if (e.key === "Enter") makeGuess();
    });
    startGame();
});
