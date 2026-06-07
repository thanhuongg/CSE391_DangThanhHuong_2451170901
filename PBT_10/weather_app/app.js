// Weather App — Đặng Thanh Hưởng 66KTPM1
// API: Open-Meteo (geocoding + weather, miễn phí, không cần key)

// ============================================================
// STATE
// ============================================================
const MAX_HISTORY = 5;
let lastCity = "";

// ============================================================
// DOM REFS
// ============================================================
const cityInput   = document.getElementById("cityInput");
const searchBtn   = document.getElementById("searchBtn");
const retryBtn    = document.getElementById("retryBtn");
const historyBox  = document.getElementById("historyBox");
const historyTags = document.getElementById("historyTags");

const stateIdle    = document.getElementById("stateIdle");
const stateLoading = document.getElementById("stateLoading");
const stateError   = document.getElementById("stateError");
const stateSuccess = document.getElementById("stateSuccess");
const errorMsg     = document.getElementById("errorMsg");

// ============================================================
// API LAYER
// ============================================================
const api = {
    // Bước 1: geocoding — tên thành phố → tọa độ lat/lon
    async geocode(city) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Geocoding lỗi: HTTP ${res.status}`);
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            throw new Error(`Không tìm thấy thành phố "${city}"`);
        }
        return data.results[0]; // { name, latitude, longitude, country }
    },

    // Bước 2: weather — tọa độ → thời tiết hiện tại
    async getWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
            `weather_code,wind_speed_10m,visibility&wind_speed_unit=kmh&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather API lỗi: HTTP ${res.status}`);
        return res.json();
    }
};

// ============================================================
// WEATHER CODE → ICON + MÔ TẢ (WMO Weather code)
// ============================================================
function describeWeather(code) {
    const map = {
        0:  { icon: "☀️",  text: "Trời quang" },
        1:  { icon: "🌤️",  text: "Chủ yếu quang" },
        2:  { icon: "⛅",  text: "Có mây một phần" },
        3:  { icon: "☁️",  text: "Nhiều mây" },
        45: { icon: "🌫️",  text: "Sương mù" },
        48: { icon: "🌫️",  text: "Sương mù đóng băng" },
        51: { icon: "🌦️",  text: "Mưa phùn nhẹ" },
        53: { icon: "🌦️",  text: "Mưa phùn vừa" },
        55: { icon: "🌦️",  text: "Mưa phùn dày" },
        61: { icon: "🌧️",  text: "Mưa nhẹ" },
        63: { icon: "🌧️",  text: "Mưa vừa" },
        65: { icon: "🌧️",  text: "Mưa to" },
        71: { icon: "🌨️",  text: "Tuyết nhẹ" },
        73: { icon: "❄️",  text: "Tuyết vừa" },
        75: { icon: "❄️",  text: "Tuyết dày" },
        80: { icon: "🌦️",  text: "Mưa rào nhẹ" },
        81: { icon: "🌧️",  text: "Mưa rào vừa" },
        82: { icon: "⛈️",  text: "Mưa rào mạnh" },
        95: { icon: "⛈️",  text: "Dông bão" },
        99: { icon: "⛈️",  text: "Dông bão kèm mưa đá" },
    };
    return map[code] || { icon: "🌡️", text: "Không xác định" };
}

// ============================================================
// UI LAYER
// ============================================================
const ui = {
    showState(state) {
        stateIdle.style.display    = state === "idle"    ? "block" : "none";
        stateLoading.style.display = state === "loading" ? "block" : "none";
        stateError.style.display   = state === "error"   ? "block" : "none";
        stateSuccess.style.display = state === "success" ? "block" : "none";
    },

    showError(msg) {
        errorMsg.textContent = msg;
        this.showState("error");
    },

    renderWeather(location, weather) {
        const cur = weather.current;
        const wDesc = describeWeather(cur.weather_code);

        document.getElementById("weatherIcon").textContent  = wDesc.icon;
        document.getElementById("weatherDesc").textContent  = wDesc.text;
        document.getElementById("cityName").textContent     = `${location.name}, ${location.country}`;
        document.getElementById("weatherTemp").textContent  = `${Math.round(cur.temperature_2m)}°C`;
        document.getElementById("humidity").textContent     = `${cur.relative_humidity_2m}%`;
        document.getElementById("windspeed").textContent    = `${Math.round(cur.wind_speed_10m)} km/h`;
        document.getElementById("feelsLike").textContent    = `${Math.round(cur.apparent_temperature)}°C`;

        const vis = cur.visibility >= 1000
            ? `${(cur.visibility / 1000).toFixed(0)} km`
            : `${cur.visibility} m`;
        document.getElementById("visibility").textContent = vis;

        const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        document.getElementById("updateTime").textContent = `Cập nhật lúc ${now}`;

        this.showState("success");
    },

    renderHistory(history) {
        if (history.length === 0) {
            historyBox.style.display = "none";
            return;
        }
        historyBox.style.display = "block";
        historyTags.innerHTML = history
            .map(city => `<button class="history-tag" data-city="${city}">${city}</button>`)
            .join("");

        historyTags.querySelectorAll(".history-tag").forEach(tag => {
            tag.addEventListener("click", () => {
                cityInput.value = tag.dataset.city;
                searchWeather(tag.dataset.city);
            });
        });
    }
};

// ============================================================
// LOCALSTORAGE — HISTORY
// ============================================================
const storage = {
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem("weatherHistory") || "[]");
        } catch { return []; }
    },

    addCity(city) {
        let history = this.getHistory();
        // Xóa nếu đã có (để đưa lên đầu)
        history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
        history.unshift(city);
        // Giữ tối đa 5
        history = history.slice(0, MAX_HISTORY);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
        return history;
    }
};

// ============================================================
// MAIN LOGIC
// ============================================================
async function searchWeather(cityName) {
    const city = cityName.trim();
    if (!city) return;

    lastCity = city;
    ui.showState("loading");
    searchBtn.disabled = true;

    try {
        // Bước 1: geocoding
        const location = await api.geocode(city);

        // Bước 2: weather
        const weather = await api.getWeather(location.latitude, location.longitude);

        // Lưu lịch sử
        const history = storage.addCity(location.name);
        ui.renderHistory(history);

        // Render kết quả
        ui.renderWeather(location, weather);

    } catch (err) {
        ui.showError(err.message);
    } finally {
        searchBtn.disabled = false;
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
searchBtn.addEventListener("click", () => searchWeather(cityInput.value));

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") searchWeather(cityInput.value);
});

retryBtn.addEventListener("click", () => {
    if (lastCity) searchWeather(lastCity);
    else ui.showState("idle");
});

// ============================================================
// INIT
// ============================================================
(function init() {
    const history = storage.getHistory();
    ui.renderHistory(history);
    ui.showState("idle");
    cityInput.focus();
})();
