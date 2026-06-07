// Infinite Scroll Gallery — Đặng Thanh Hưởng 66KTPM1
// API: Picsum Photos (https://picsum.photos)

// ============================================================
// STATE
// ============================================================
const PAGE_SIZE   = 20;
let currentPage   = 1;
let isLoading     = false;
let hasMore       = true;
let photos        = [];       // Tất cả ảnh đã load
let lightboxIndex = -1;       // Index ảnh đang xem trong lightbox

// ============================================================
// DOM REFS
// ============================================================
const gallery           = document.getElementById("galleryContainer");
const loadTrigger       = document.getElementById("loadTrigger");
const loadMoreIndicator = document.getElementById("loadMoreIndicator");
const endMessage        = document.getElementById("endMessage");
const photoCounter      = document.getElementById("photoCounter");
const lightbox          = document.getElementById("lightbox");
const lightboxImg       = document.getElementById("lightboxImg");
const lightboxTitle     = document.getElementById("lightboxTitle");
const lightboxMeta      = document.getElementById("lightboxMeta");

// ============================================================
// API LAYER
// ============================================================
const api = {
    async getPhotos(page, limit = PAGE_SIZE) {
        const res = await fetch(
            `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
        );
        if (!res.ok) throw new Error(`API lỗi: HTTP ${res.status}`);
        const data = await res.json();
        return data; // Array of { id, author, width, height, url, download_url }
    }
};

// ============================================================
// LAZY IMAGE LOADING — dùng IntersectionObserver riêng
// ============================================================
const imgObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            const src = img.dataset.src;
            if (!src) return;

            img.src = src;
            img.onload  = () => img.classList.add("loaded");
            img.onerror = () => { img.src = ""; img.classList.add("loaded"); };
            imgObserver.unobserve(img); // Xong việc → ngừng theo dõi
        });
    },
    { rootMargin: "200px" }  // Load trước khi vào viewport 200px
);

// ============================================================
// RENDER
// ============================================================
function renderPhotos(newPhotos, startIndex) {
    newPhotos.forEach((photo, i) => {
        const idx   = startIndex + i;
        const imgSrc = `https://picsum.photos/id/${photo.id}/600/400`;

        const item  = document.createElement("div");
        item.className  = "photo-item";
        item.dataset.idx = idx;

        item.innerHTML = `
            <img data-src="${imgSrc}" alt="${photo.author}" loading="lazy">
            <div class="photo-overlay">
                <p class="photo-title">${photo.author}</p>
            </div>
        `;

        // Lazy load qua imgObserver
        const img = item.querySelector("img");
        imgObserver.observe(img);

        // Click → mở lightbox
        item.addEventListener("click", () => openLightbox(idx));

        gallery.appendChild(item);
    });

    photoCounter.textContent = `${photos.length} ảnh`;
}

// ============================================================
// FETCH & APPEND
// ============================================================
async function loadPhotos() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    loadMoreIndicator.style.display = "block";

    try {
        const newPhotos = await api.getPhotos(currentPage, PAGE_SIZE);

        if (newPhotos.length === 0) {
            hasMore = false;
            endMessage.style.display = "block";
            return;
        }

        const startIndex = photos.length;
        photos.push(...newPhotos);
        renderPhotos(newPhotos, startIndex);
        currentPage++;

        // Picsum có giới hạn trang (~50 trang × 20 = 1000 ảnh)
        if (newPhotos.length < PAGE_SIZE) {
            hasMore = false;
            endMessage.style.display = "block";
            scrollObserver.unobserve(loadTrigger);
        }

    } catch (err) {
        console.error("Lỗi tải ảnh:", err);
        showError(err.message);
    } finally {
        isLoading = false;
        loadMoreIndicator.style.display = "none";
    }
}

function showError(msg) {
    const el = document.createElement("div");
    el.style.cssText = "text-align:center;padding:20px;color:#ef4444;grid-column:1/-1;";
    el.innerHTML = `<p>⚠️ ${msg}</p><button onclick="location.reload()" style="margin-top:10px;padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;">Thử lại</button>`;
    gallery.appendChild(el);
}

// ============================================================
// INFINITE SCROLL — IntersectionObserver theo dõi trigger
// ============================================================
const scrollObserver = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) loadPhotos();
    },
    { rootMargin: "300px" }  // Bắt đầu load khi còn cách đáy 300px
);
scrollObserver.observe(loadTrigger);

// ============================================================
// LIGHTBOX
// ============================================================
function openLightbox(idx) {
    if (idx < 0 || idx >= photos.length) return;
    lightboxIndex = idx;
    updateLightbox();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "";
    lightboxIndex = -1;
}

function updateLightbox() {
    const photo = photos[lightboxIndex];
    if (!photo) return;

    lightboxImg.src       = `https://picsum.photos/id/${photo.id}/1200/800`;
    lightboxImg.alt       = photo.author;
    lightboxTitle.textContent = photo.author;
    lightboxMeta.textContent  = `${photo.width} × ${photo.height}px  ·  Ảnh ${lightboxIndex + 1} / ${photos.length}`;

    // Hiện/ẩn nút prev/next
    document.getElementById("lightboxPrev").style.visibility = lightboxIndex > 0 ? "visible" : "hidden";
    document.getElementById("lightboxNext").style.visibility = lightboxIndex < photos.length - 1 ? "visible" : "hidden";

    // Nếu gần cuối → tải thêm
    if (lightboxIndex >= photos.length - 5) loadPhotos();
}

// Lightbox event listeners
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

document.getElementById("lightboxPrev").addEventListener("click", () => {
    if (lightboxIndex > 0) { lightboxIndex--; updateLightbox(); }
});

document.getElementById("lightboxNext").addEventListener("click", () => {
    if (lightboxIndex < photos.length - 1) { lightboxIndex++; updateLightbox(); }
});

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", e => {
    if (lightbox.style.display !== "flex") return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft"  && lightboxIndex > 0)               { lightboxIndex--; updateLightbox(); }
    if (e.key === "ArrowRight" && lightboxIndex < photos.length - 1) { lightboxIndex++; updateLightbox(); }
});

// ============================================================
// INIT — trang load xong là bắt đầu fetch (qua scrollObserver)
// ============================================================
// scrollObserver sẽ tự kích hoạt loadPhotos() khi loadTrigger vào viewport
