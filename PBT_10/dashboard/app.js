// Multi-API Dashboard — Đặng Thanh Hưởng 66KTPM1
// APIs sử dụng:
//   1. Open-Meteo   — thời tiết Hà Nội
//   2. REST Countries — thông tin Việt Nam
//   3. Random User   — danh sách người dùng ngẫu nhiên
//   4. JSONPlaceholder — bài viết mới nhất

// ============================================================
// API LAYER — 4 API độc lập
// ============================================================
const apis = {
    async weather() {
        // Hà Nội: lat=21.0285, lon=105.8542
        const res = await fetch(
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=21.0285&longitude=105.8542" +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature" +
            "&wind_speed_unit=kmh&timezone=Asia%2FBangkok"
        );
        if (!res.ok) throw new Error(`Weather API: HTTP ${res.status}`);
        return res.json();
    },

    async country() {
        const res = await fetch("https://restcountries.com/v3.1/alpha/vn");
        if (!res.ok) throw new Error(`Country API: HTTP ${res.status}`);
        const data = await res.json();
        return data[0];
    },

    async randomUsers() {
        const res = await fetch("https://randomuser.me/api/?results=5&nat=us,gb,au,fr,de");
        if (!res.ok) throw new Error(`Random User API: HTTP ${res.status}`);
        const data = await res.json();
        return data.results;
    },

    async posts() {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        if (!res.ok) throw new Error(`Posts API: HTTP ${res.status}`);
        return res.json();
    }
};

// ============================================================
// WEATHER HELPER
// ============================================================
function weatherInfo(code) {
    const map = {
        0: { icon: "☀️",  text: "Trời quang" },
        1: { icon: "🌤️", text: "Chủ yếu quang" },
        2: { icon: "⛅",  text: "Có mây" },
        3: { icon: "☁️",  text: "Nhiều mây" },
        45:{ icon: "🌫️", text: "Sương mù" },
        51:{ icon: "🌦️", text: "Mưa phùn nhẹ" },
        61:{ icon: "🌧️", text: "Mưa nhẹ" },
        63:{ icon: "🌧️", text: "Mưa vừa" },
        65:{ icon: "🌧️", text: "Mưa to" },
        80:{ icon: "🌦️", text: "Mưa rào" },
        95:{ icon: "⛈️", text: "Dông bão" },
    };
    return map[code] ?? { icon: "🌡️", text: "Không xác định" };
}

// ============================================================
// UI HELPERS
// ============================================================
function setBadge(widgetId, status) {
    const badge = document.getElementById(`badge-${widgetId}`);
    badge.className = `widget-badge badge-${status}`;
    badge.textContent = status === "success" ? "OK" : status === "error" ? "Lỗi" : "loading";
}

function setBody(widgetId, html) {
    document.getElementById(`body-${widgetId}`).innerHTML = html;
}

function errorHTML(msg) {
    return `<div class="widget-error">
        <span class="err-icon">⚠️</span>
        <span>${msg}</span>
    </div>`;
}

// ============================================================
// RENDER FUNCTIONS — mỗi widget có renderer riêng
// ============================================================
function renderWeather(data) {
    const cur = data.current;
    const w   = weatherInfo(cur.weather_code);
    setBody("weather", `
        <div class="weather-display">
            <div class="weather-big-icon">${w.icon}</div>
            <div class="weather-info">
                <p class="location">📍 Hà Nội, Việt Nam</p>
                <h3>${Math.round(cur.temperature_2m)}°C</h3>
                <p>${w.text}</p>
            </div>
        </div>
        <div class="weather-extras">
            <div class="weather-extra-item">
                <div class="label">💧 Độ ẩm</div>
                <div class="value">${cur.relative_humidity_2m}%</div>
            </div>
            <div class="weather-extra-item">
                <div class="label">💨 Gió</div>
                <div class="value">${Math.round(cur.wind_speed_10m)} km/h</div>
            </div>
            <div class="weather-extra-item">
                <div class="label">🌡️ Cảm giác như</div>
                <div class="value">${Math.round(cur.apparent_temperature)}°C</div>
            </div>
            <div class="weather-extra-item">
                <div class="label">🕐 Cập nhật</div>
                <div class="value">${new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
        </div>
    `);
}

function renderCountry(c) {
    const pop  = (c.population / 1e6).toFixed(1) + "M";
    const area = (c.area / 1000).toFixed(0) + "K km²";
    const caps = c.capital?.join(", ") ?? "—";
    const cur  = Object.values(c.currencies ?? {})[0];
    const curStr = cur ? `${cur.name} (${cur.symbol})` : "—";
    const langs  = Object.values(c.languages ?? {}).join(", ");

    setBody("country", `
        <div class="country-flag">${c.flag}</div>
        <div class="country-stat-grid">
            <div class="country-stat">
                <div class="label">🗺️ Thủ đô</div>
                <div class="value">${caps}</div>
            </div>
            <div class="country-stat">
                <div class="label">👨‍👩‍👧 Dân số</div>
                <div class="value">${pop}</div>
            </div>
            <div class="country-stat">
                <div class="label">📐 Diện tích</div>
                <div class="value">${area}</div>
            </div>
            <div class="country-stat">
                <div class="label">💰 Tiền tệ</div>
                <div class="value">${curStr}</div>
            </div>
            <div class="country-stat">
                <div class="label">🗣️ Ngôn ngữ</div>
                <div class="value">${langs}</div>
            </div>
            <div class="country-stat">
                <div class="label">🌏 Khu vực</div>
                <div class="value">${c.subregion ?? c.region}</div>
            </div>
        </div>
    `);
}

function renderUsers(users) {
    const rows = users.map(u => `
        <div class="user-row">
            <img class="user-avatar" src="${u.picture.thumbnail}" alt="${u.name.first}">
            <div class="user-info">
                <div class="user-name">${u.name.first} ${u.name.last}</div>
                <div class="user-meta">📧 ${u.email}</div>
                <div class="user-location">📍 ${u.location.city}, ${u.location.country}</div>
            </div>
        </div>
    `).join("");
    setBody("users", `<div class="users-list">${rows}</div>`);
}

function renderPosts(posts) {
    const rows = posts.map(p => `
        <div class="post-row">
            <div class="post-title">${p.title}</div>
            <div class="post-body">${p.body}</div>
        </div>
    `).join("");
    setBody("posts", `<div class="posts-list">${rows}</div>`);
}

// ============================================================
// LOAD DASHBOARD — Promise.allSettled (widget độc lập)
// ============================================================
async function loadDashboard() {
    // Reset UI
    const refreshBtn    = document.getElementById("refreshBtn");
    const globalLoading = document.getElementById("globalLoading");
    const dashGrid      = document.getElementById("dashGrid");
    const loadTimeEl    = document.getElementById("loadTime");

    refreshBtn.disabled = true;
    globalLoading.style.display = "flex";
    dashGrid.style.display      = "none";
    loadTimeEl.style.display    = "none";

    // Reset tất cả badges + skeleton
    ["weather", "country", "users", "posts"].forEach(id => {
        setBadge(id, "loading");
        setBody(id, '<div class="widget-skeleton"></div>');
    });

    const startTime = Date.now();

    // ⭐ Promise.allSettled: chạy song song, 1 API lỗi không ảnh hưởng widget khác
    const [weatherResult, countryResult, usersResult, postsResult] =
        await Promise.allSettled([
            apis.weather(),
            apis.country(),
            apis.randomUsers(),
            apis.posts()
        ]);

    const elapsed = Date.now() - startTime;

    // Hiện grid, ẩn global loading
    globalLoading.style.display = "none";
    dashGrid.style.display      = "grid";

    // Hiện thời gian fetch
    document.getElementById("loadMs").textContent = elapsed;
    loadTimeEl.style.display = "inline-flex";

    // Render từng widget theo kết quả riêng
    if (weatherResult.status === "fulfilled") {
        renderWeather(weatherResult.value);
        setBadge("weather", "success");
    } else {
        setBody("weather", errorHTML(weatherResult.reason?.message ?? "Lỗi không xác định"));
        setBadge("weather", "error");
    }

    if (countryResult.status === "fulfilled") {
        renderCountry(countryResult.value);
        setBadge("country", "success");
    } else {
        setBody("country", errorHTML(countryResult.reason?.message ?? "Lỗi không xác định"));
        setBadge("country", "error");
    }

    if (usersResult.status === "fulfilled") {
        renderUsers(usersResult.value);
        setBadge("users", "success");
    } else {
        setBody("users", errorHTML(usersResult.reason?.message ?? "Lỗi không xác định"));
        setBadge("users", "error");
    }

    if (postsResult.status === "fulfilled") {
        renderPosts(postsResult.value);
        setBadge("posts", "success");
    } else {
        setBody("posts", errorHTML(postsResult.reason?.message ?? "Lỗi không xác định"));
        setBadge("posts", "error");
    }

    console.log(`✅ Dashboard loaded in ${elapsed}ms`);
    refreshBtn.disabled = false;
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.getElementById("refreshBtn").addEventListener("click", loadDashboard);

// ============================================================
// INIT
// ============================================================
loadDashboard();
