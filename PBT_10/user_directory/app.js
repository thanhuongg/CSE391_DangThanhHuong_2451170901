// User Directory — Đặng Thanh Hưởng 66KTPM1
// API: JSONPlaceholder (https://jsonplaceholder.typicode.com/users)

// ============================================================
// STATE
// ============================================================
let users       = [];     // Danh sách gốc từ API
let editingId   = null;   // null = Add mode, số = Edit mode
let deleteId    = null;   // ID đang chờ confirm xóa
let nextLocalId = 100;    // ID tự tăng cho user tạo local

// ============================================================
// API LAYER — tách riêng, không đụng DOM
// ============================================================
const api = {
    baseURL: "https://jsonplaceholder.typicode.com",

    async request(path, options = {}) {
        const res = await fetch(`${this.baseURL}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
    },

    getUsers()           { return this.request("/users"); },
    getUser(id)          { return this.request(`/users/${id}`); },
    createUser(data)     { return this.request("/users", { method: "POST",   body: JSON.stringify(data) }); },
    updateUser(id, data) { return this.request(`/users/${id}`, { method: "PUT",    body: JSON.stringify(data) }); },
    deleteUser(id)       { return this.request(`/users/${id}`, { method: "DELETE" }); }
};

// ============================================================
// TOAST — thông báo
// ============================================================
const toast = {
    show(msg, type = "info") {
        const container = document.getElementById("toastContainer");
        const el = document.createElement("div");
        el.className = `toast toast-${type}`;
        el.textContent = msg;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3200);
    },
    success(msg) { this.show("✅ " + msg, "success"); },
    error(msg)   { this.show("❌ " + msg, "error"); },
    info(msg)    { this.show("ℹ️ " + msg, "info"); }
};

// ============================================================
// UI LAYER — chỉ làm việc với DOM
// ============================================================
const ui = {
    showLoading() {
        document.getElementById("userGrid").innerHTML   = "";
        document.getElementById("loadingBar").style.display = "grid";
    },

    hideLoading() {
        document.getElementById("loadingBar").style.display = "none";
    },

    getAvatarChar(name) {
        return name ? name.charAt(0).toUpperCase() : "?";
    },

    renderUsers(list) {
        this.hideLoading();
        const grid = document.getElementById("userGrid");
        document.getElementById("userCount").textContent = `${list.length} users`;

        if (list.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🔍</div>
                    <p>Không tìm thấy user nào</p>
                </div>`;
            return;
        }

        grid.innerHTML = list.map(user => `
            <div class="user-card" data-id="${user.id}">
                <div class="card-top">
                    <div class="avatar">${this.getAvatarChar(user.name)}</div>
                    <div class="card-info">
                        <div class="card-name" title="${user.name}">${user.name}</div>
                        <div class="card-username">@${user.username}</div>
                    </div>
                </div>
                <div class="card-detail"><span>📧</span><span>${user.email}</span></div>
                <div class="card-detail"><span>📞</span><span>${user.phone || "—"}</span></div>
                <div class="card-detail"><span>🌐</span><span>${user.website || "—"}</span></div>
                <div class="card-actions">
                    <button class="btn btn-ghost btn-sm edit-btn" data-id="${user.id}">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">🗑️ Xóa</button>
                </div>
            </div>
        `).join("");

        // Gắn event cho từng nút — dùng event delegation trên grid
        grid.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", () => openEditModal(Number(btn.dataset.id)));
        });
        grid.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => openConfirmDelete(Number(btn.dataset.id)));
        });
    },

    openModal(isEdit = false) {
        document.getElementById("modalTitle").textContent = isEdit ? "Sửa User" : "Thêm User";
        document.getElementById("modalOverlay").style.display = "flex";
    },

    closeModal() {
        document.getElementById("modalOverlay").style.display = "none";
        clearForm();
    },

    fillForm(user) {
        document.getElementById("fieldName").value    = user.name    || "";
        document.getElementById("fieldUsername").value= user.username|| "";
        document.getElementById("fieldEmail").value   = user.email   || "";
        document.getElementById("fieldPhone").value   = user.phone   || "";
        document.getElementById("fieldWebsite").value = user.website || "";
    },

    getFormData() {
        return {
            name:     document.getElementById("fieldName").value.trim(),
            username: document.getElementById("fieldUsername").value.trim(),
            email:    document.getElementById("fieldEmail").value.trim(),
            phone:    document.getElementById("fieldPhone").value.trim(),
            website:  document.getElementById("fieldWebsite").value.trim(),
        };
    }
};

// ============================================================
// SEARCH — client-side filter
// ============================================================
function filterUsers(query) {
    if (!query) return users;
    const q = query.toLowerCase();
    return users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
    );
}

document.getElementById("searchInput").addEventListener("input", e => {
    ui.renderUsers(filterUsers(e.target.value));
});

// ============================================================
// CRUD OPERATIONS
// ============================================================

// --- READ ---
async function loadUsers() {
    ui.showLoading();
    try {
        users = await api.getUsers();
        ui.renderUsers(users);
        toast.info(`Đã tải ${users.length} users`);
    } catch (err) {
        ui.hideLoading();
        toast.error("Không thể tải danh sách: " + err.message);
    }
}

// --- CREATE / UPDATE (Modal) ---
function openAddModal() {
    editingId = null;
    clearForm();
    ui.openModal(false);
}

function openEditModal(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    editingId = id;
    ui.fillForm(user);
    ui.openModal(true);
}

function clearForm() {
    ["fieldName","fieldUsername","fieldEmail","fieldPhone","fieldWebsite"]
        .forEach(id => document.getElementById(id).value = "");
}

async function saveUser() {
    const data = ui.getFormData();
    if (!data.name || !data.username || !data.email) {
        toast.error("Vui lòng điền đủ họ tên, username và email");
        return;
    }

    const saveBtn = document.getElementById("modalSaveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Đang lưu...";

    try {
        if (editingId === null) {
            // CREATE
            const created = await api.createUser(data);
            // JSONPlaceholder luôn trả id=11 → dùng id local
            const newUser = { ...data, id: nextLocalId++ };
            users.unshift(newUser);
            toast.success(`Đã thêm user ${newUser.name}`);
        } else {
            // UPDATE
            await api.updateUser(editingId, data);
            const idx = users.findIndex(u => u.id === editingId);
            if (idx !== -1) users[idx] = { ...users[idx], ...data };
            toast.success(`Đã cập nhật user ${data.name}`);
        }

        ui.closeModal();
        ui.renderUsers(filterUsers(document.getElementById("searchInput").value));

    } catch (err) {
        toast.error("Lưu thất bại: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = "Lưu";
    }
}

// --- DELETE ---
function openConfirmDelete(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    deleteId = id;
    document.getElementById("confirmMsg").textContent =
        `Bạn chắc chắn muốn xóa user "${user.name}"?`;
    document.getElementById("confirmOverlay").style.display = "flex";
}

function closeConfirm() {
    document.getElementById("confirmOverlay").style.display = "none";
    deleteId = null;
}

async function confirmDelete() {
    if (deleteId === null) return;
    const delBtn = document.getElementById("confirmDeleteBtn");
    delBtn.disabled = true;
    delBtn.textContent = "Đang xóa...";

    try {
        await api.deleteUser(deleteId);
        const name = users.find(u => u.id === deleteId)?.name || "";
        users = users.filter(u => u.id !== deleteId);
        closeConfirm();
        ui.renderUsers(filterUsers(document.getElementById("searchInput").value));
        toast.success(`Đã xóa user ${name}`);
    } catch (err) {
        toast.error("Xóa thất bại: " + err.message);
    } finally {
        delBtn.disabled = false;
        delBtn.textContent = "Xóa";
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================
document.getElementById("addUserBtn").addEventListener("click", openAddModal);
document.getElementById("modalSaveBtn").addEventListener("click", saveUser);
document.getElementById("modalClose").addEventListener("click", () => ui.closeModal());
document.getElementById("modalCancelBtn").addEventListener("click", () => ui.closeModal());
document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);
document.getElementById("confirmCancelBtn").addEventListener("click", closeConfirm);

// Đóng modal khi click ngoài
document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target === e.currentTarget) ui.closeModal();
});
document.getElementById("confirmOverlay").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeConfirm();
});

// ============================================================
// INIT
// ============================================================
loadUsers();
