// ===== DATA =====
const products = [
    { id: 1,  name: "iPhone 16 Pro",       price: 29990000, category: "phone",    image: "https://placehold.co/400x300/6366f1/white?text=iPhone+16+Pro",    rating: 4.8, inStock: true  },
    { id: 2,  name: "Samsung Galaxy S25",   price: 22990000, category: "phone",    image: "https://placehold.co/400x300/4f46e5/white?text=Galaxy+S25",        rating: 4.6, inStock: true  },
    { id: 3,  name: "Xiaomi 15",            price: 14990000, category: "phone",    image: "https://placehold.co/400x300/7c3aed/white?text=Xiaomi+15",         rating: 4.3, inStock: false },
    { id: 4,  name: "MacBook Air M3",       price: 32990000, category: "laptop",   image: "https://placehold.co/400x300/0ea5e9/white?text=MacBook+Air+M3",    rating: 4.9, inStock: true  },
    { id: 5,  name: "Dell XPS 15",          price: 42990000, category: "laptop",   image: "https://placehold.co/400x300/0284c7/white?text=Dell+XPS+15",       rating: 4.5, inStock: true  },
    { id: 6,  name: "Asus ROG Zephyrus",    price: 55990000, category: "laptop",   image: "https://placehold.co/400x300/0369a1/white?text=ROG+Zephyrus",      rating: 4.7, inStock: true  },
    { id: 7,  name: "iPad Pro M4",          price: 26990000, category: "tablet",   image: "https://placehold.co/400x300/10b981/white?text=iPad+Pro+M4",       rating: 4.8, inStock: true  },
    { id: 8,  name: "Samsung Tab S10",      price: 19990000, category: "tablet",   image: "https://placehold.co/400x300/059669/white?text=Tab+S10",           rating: 4.4, inStock: false },
    { id: 9,  name: "Lenovo Tab P12 Pro",   price: 11990000, category: "tablet",   image: "https://placehold.co/400x300/047857/white?text=Tab+P12+Pro",       rating: 4.2, inStock: true  },
    { id: 10, name: "Sony WH-1000XM6",      price: 8990000,  category: "audio",    image: "https://placehold.co/400x300/f59e0b/white?text=WH-1000XM6",        rating: 4.9, inStock: true  },
    { id: 11, name: "AirPods Pro 3",        price: 6990000,  category: "audio",    image: "https://placehold.co/400x300/d97706/white?text=AirPods+Pro+3",     rating: 4.7, inStock: true  },
    { id: 12, name: "Bose QuietComfort 45", price: 9490000,  category: "audio",    image: "https://placehold.co/400x300/b45309/white?text=QC45",              rating: 4.6, inStock: false },
    { id: 13, name: "Oppo Find X8 Pro",     price: 18990000, category: "phone",    image: "https://placehold.co/400x300/8b5cf6/white?text=Find+X8+Pro",       rating: 4.4, inStock: true  },
    { id: 14, name: "Huawei MateBook X Pro",price: 38990000, category: "laptop",   image: "https://placehold.co/400x300/0c4a6e/white?text=MateBook+X+Pro",    rating: 4.3, inStock: true  },
    { id: 15, name: "JBL Tune 760NC",       price: 2490000,  category: "audio",    image: "https://placehold.co/400x300/92400e/white?text=JBL+Tune+760NC",    rating: 4.1, inStock: true  },
];

const categories = [
    { id: 'all',    label: '🏠 Tất cả' },
    { id: 'phone',  label: '📱 Điện thoại' },
    { id: 'laptop', label: '💻 Laptop' },
    { id: 'tablet', label: '📟 Tablet' },
    { id: 'audio',  label: '🎧 Âm thanh' },
];

// ===== STATE =====
let currentCategory = 'all';
let currentSort = 'default';
let currentSearch = '';
let cartCount = 0;

// ===== UTILS =====
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + ' ' + rating;
}

// ===== BUILD PAGE STRUCTURE =====
function buildPage() {
    // Topbar
    const topbar = document.createElement('header');
    topbar.className = 'topbar';

    const topbarLeft = document.createElement('div');
    topbarLeft.className = 'topbar-left';

    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.textContent = '🛍 ShopDOM';

    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.textContent = '🔍';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.placeholder = 'Tìm kiếm sản phẩm...';
    searchInput.setAttribute('aria-label', 'Tìm kiếm sản phẩm');

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    topbarLeft.appendChild(logo);
    topbarLeft.appendChild(searchBox);

    const topbarRight = document.createElement('div');
    topbarRight.className = 'topbar-right';

    const darkToggle = document.createElement('button');
    darkToggle.className = 'dark-toggle';
    darkToggle.id = 'darkToggle';
    darkToggle.textContent = '🌙 Dark Mode';
    darkToggle.setAttribute('aria-label', 'Chuyển dark/light mode');

    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn';
    cartBtn.id = 'cartBtn';
    cartBtn.setAttribute('aria-label', 'Giỏ hàng');

    const cartIcon = document.createTextNode('🛒 Giỏ hàng');
    const cartBadge = document.createElement('span');
    cartBadge.className = 'cart-badge';
    cartBadge.id = 'cartBadge';
    cartBadge.textContent = '0';

    cartBtn.appendChild(cartIcon);
    cartBtn.appendChild(cartBadge);

    topbarRight.appendChild(darkToggle);
    topbarRight.appendChild(cartBtn);

    topbar.appendChild(topbarLeft);
    topbar.appendChild(topbarRight);

    // Main layout
    const mainLayout = document.createElement('div');
    mainLayout.className = 'main-layout';

    // Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    const catTitle = document.createElement('h3');
    catTitle.textContent = 'Danh mục';

    const catList = document.createElement('ul');
    catList.className = 'category-list';
    catList.id = 'categoryList';

    categories.forEach(cat => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'cat-btn' + (cat.id === 'all' ? ' active' : '');
        btn.dataset.category = cat.id;
        btn.textContent = cat.label;
        li.appendChild(btn);
        catList.appendChild(li);
    });

    const sortSection = document.createElement('div');
    sortSection.className = 'sort-section';

    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'sortSelect';
    sortLabel.textContent = 'Sắp xếp';

    const sortSelect = document.createElement('select');
    sortSelect.className = 'sort-select';
    sortSelect.id = 'sortSelect';

    [
        { value: 'default',      label: 'Mặc định' },
        { value: 'price-asc',    label: 'Giá tăng dần' },
        { value: 'price-desc',   label: 'Giá giảm dần' },
        { value: 'name-az',      label: 'Tên A-Z' },
        { value: 'rating-desc',  label: 'Đánh giá cao nhất' },
    ].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        sortSelect.appendChild(option);
    });

    sortSection.appendChild(sortLabel);
    sortSection.appendChild(sortSelect);

    sidebar.appendChild(catTitle);
    sidebar.appendChild(catList);
    sidebar.appendChild(sortSection);

    // Content
    const content = document.createElement('main');
    content.className = 'content';

    const contentHeader = document.createElement('div');
    contentHeader.className = 'content-header';

    const resultCount = document.createElement('span');
    resultCount.className = 'result-count';
    resultCount.id = 'resultCount';

    contentHeader.appendChild(resultCount);

    const productGrid = document.createElement('div');
    productGrid.className = 'product-grid';
    productGrid.id = 'productGrid';

    content.appendChild(contentHeader);
    content.appendChild(productGrid);

    mainLayout.appendChild(sidebar);
    mainLayout.appendChild(content);

    document.body.appendChild(topbar);
    document.body.appendChild(mainLayout);

    // Bind events sau khi đã build xong DOM
    bindEvents(searchInput, darkToggle, sortSelect);
}

// ===== BIND EVENTS =====
function bindEvents(searchInput, darkToggle, sortSelect) {
    // Search realtime (event: input)
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        renderProducts();
    });

    // Dark mode toggle
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkToggle.textContent = document.body.classList.contains('dark-mode')
            ? '☀️ Light Mode'
            : '🌙 Dark Mode';
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Category filter — Event Delegation trên ul
    document.getElementById('categoryList').addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-btn');
        if (!btn) return;
        filterByCategory(btn.dataset.category);
    });

    // Product grid — Event Delegation (click card + add to cart)
    document.getElementById('productGrid').addEventListener('click', (e) => {
        const addBtn = e.target.closest('.btn-add-cart');
        const card = e.target.closest('.product-card');

        if (addBtn) {
            e.stopPropagation();
            addToCart();
            return;
        }

        if (card) {
            const id = Number(card.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showModal(product);
        }
    });
}

// ===== FILTER, SEARCH, SORT =====
function filterByCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    renderProducts();
}

function searchProducts(list) {
    if (!currentSearch) return list;
    return list.filter(p => p.name.toLowerCase().includes(currentSearch));
}

function sortProducts(list) {
    const sorted = [...list];
    if (currentSort === 'price-asc')   return sorted.sort((a, b) => a.price - b.price);
    if (currentSort === 'price-desc')  return sorted.sort((a, b) => b.price - a.price);
    if (currentSort === 'name-az')     return sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (currentSort === 'rating-desc') return sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    let list = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    list = searchProducts(list);
    list = sortProducts(list);

    const grid = document.getElementById('productGrid');
    const resultCount = document.getElementById('resultCount');

    grid.innerHTML = '';

    resultCount.textContent = `${list.length} sản phẩm`;

    if (list.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'no-results';
        empty.textContent = '😕 Không tìm thấy sản phẩm nào.';
        grid.appendChild(empty);
        return;
    }

    // Dùng DocumentFragment để chỉ gây 1 lần reflow
    const fragment = document.createDocumentFragment();
    list.forEach(product => {
        fragment.appendChild(createProductCard(product));
    });
    grid.appendChild(fragment);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card' + (!product.inStock ? ' out-of-stock' : '');
    card.dataset.id = product.id;
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', product.name);

    const img = document.createElement('img');
    img.className = 'product-img';
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'product-body';

    const cat = document.createElement('span');
    cat.className = 'product-category';
    cat.textContent = product.category;

    const name = document.createElement('h2');
    name.className = 'product-name';
    name.textContent = product.name;

    const rating = document.createElement('div');
    rating.className = 'product-rating';
    rating.textContent = renderStars(product.rating);

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = formatPrice(product.price);

    body.appendChild(cat);
    body.appendChild(name);
    body.appendChild(rating);
    body.appendChild(price);

    const footer = document.createElement('div');
    footer.className = 'product-footer';

    const addCartBtn = document.createElement('button');
    addCartBtn.className = 'btn-add-cart';
    addCartBtn.textContent = product.inStock ? '🛒 Thêm giỏ hàng' : 'Hết hàng';
    addCartBtn.disabled = !product.inStock;
    addCartBtn.setAttribute('aria-label', `Thêm ${product.name} vào giỏ hàng`);

    footer.appendChild(addCartBtn);

    card.appendChild(img);
    card.appendChild(body);
    card.appendChild(footer);

    return card;
}

// ===== CART =====
function addToCart() {
    cartCount++;
    const badge = document.getElementById('cartBadge');
    badge.textContent = cartCount;
    badge.classList.add('visible');
}

// ===== MODAL =====
function showModal(product) {
    // Xóa modal cũ nếu có
    const existingOverlay = document.getElementById('modalOverlay');
    if (existingOverlay) existingOverlay.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modalOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', product.name);

    const box = document.createElement('div');
    box.className = 'modal-box';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Đóng');

    const img = document.createElement('img');
    img.className = 'modal-img';
    img.src = product.image;
    img.alt = product.name;

    const content = document.createElement('div');
    content.className = 'modal-content';

    const cat = document.createElement('div');
    cat.className = 'modal-category';
    cat.textContent = product.category;

    const name = document.createElement('h2');
    name.className = 'modal-name';
    name.textContent = product.name;

    const ratingEl = document.createElement('div');
    ratingEl.className = 'modal-rating';
    ratingEl.textContent = renderStars(product.rating);

    const priceEl = document.createElement('div');
    priceEl.className = 'modal-price';
    priceEl.textContent = formatPrice(product.price);

    const stockEl = document.createElement('div');
    stockEl.className = 'modal-stock';
    const stockBadge = document.createElement('span');
    stockBadge.className = 'stock-badge ' + (product.inStock ? 'in' : 'out');
    stockBadge.textContent = product.inStock ? '✓ Còn hàng' : '✗ Hết hàng';
    stockEl.appendChild(stockBadge);

    const addBtn = document.createElement('button');
    addBtn.className = 'modal-add-cart';
    addBtn.textContent = product.inStock ? '🛒 Thêm vào giỏ hàng' : 'Hết hàng';
    addBtn.disabled = !product.inStock;

    content.appendChild(cat);
    content.appendChild(name);
    content.appendChild(ratingEl);
    content.appendChild(priceEl);
    content.appendChild(stockEl);
    content.appendChild(addBtn);

    box.appendChild(closeBtn);
    box.appendChild(img);
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Focus close button
    closeBtn.focus();

    // Events
    const closeModal = () => overlay.remove();

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    addBtn.addEventListener('click', () => {
        addToCart();
        closeModal();
    });

    document.addEventListener('keydown', function onEsc(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', onEsc);
        }
    });
}

// ===== INIT =====
buildPage();
renderProducts();
