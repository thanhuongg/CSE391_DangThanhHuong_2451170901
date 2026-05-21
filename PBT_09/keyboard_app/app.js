// ===== GALLERY DATA =====
const images = [
    { id: 1, src: 'https://placehold.co/900x500/6366f1/white?text=Ảnh+1+🌄',  title: 'Bình minh trên núi' },
    { id: 2, src: 'https://placehold.co/900x500/7c3aed/white?text=Ảnh+2+🌊',  title: 'Sóng biển xanh' },
    { id: 3, src: 'https://placehold.co/900x500/0ea5e9/white?text=Ảnh+3+🌳',  title: 'Rừng nhiệt đới' },
    { id: 4, src: 'https://placehold.co/900x500/10b981/white?text=Ảnh+4+🏙',  title: 'Thành phố đêm' },
    { id: 5, src: 'https://placehold.co/900x500/f59e0b/white?text=Ảnh+5+🌸',  title: 'Hoa anh đào' },
    { id: 6, src: 'https://placehold.co/900x500/ef4444/white?text=Ảnh+6+🗻',  title: 'Núi Phú Sĩ' },
    { id: 7, src: 'https://placehold.co/900x500/ec4899/white?text=Ảnh+7+🌅',  title: 'Hoàng hôn biển' },
    { id: 8, src: 'https://placehold.co/900x500/8b5cf6/white?text=Ảnh+8+❄️',  title: 'Tuyết mùa đông' },
    { id: 9, src: 'https://placehold.co/900x500/14b8a6/white?text=Ảnh+9+🌻',  title: 'Cánh đồng hoa' },
];

// ===== COMMANDS =====
const commands = [
    { icon: '⬅️',  name: 'Ảnh trước',          desc: 'ArrowLeft',    action: () => navigate(-1) },
    { icon: '➡️',  name: 'Ảnh tiếp theo',       desc: 'ArrowRight',   action: () => navigate(1)  },
    { icon: '▶️',  name: 'Play Slideshow',        desc: 'Space',        action: () => togglePlay()  },
    { icon: '🔍',  name: 'Mở lightbox',          desc: 'Enter / Click',action: () => openLightbox(currentIndex) },
    { icon: '🌙',  name: 'Dark Mode (đã bật)',    desc: '',             action: () => {} },
    { icon: '💾',  name: 'Tải ảnh xuống',        desc: '',             action: () => alert('Tải xuống: ' + images[currentIndex].title) },
    { icon: '❤️',  name: 'Yêu thích ảnh này',    desc: '',             action: () => alert('Đã thêm vào yêu thích!') },
    { icon: '🔗',  name: 'Sao chép link',         desc: '',             action: () => { navigator.clipboard?.writeText(images[currentIndex].src); alert('Đã sao chép!'); }},
    { icon: 'ℹ️',  name: 'Thông tin ảnh',         desc: '',             action: () => alert('Ảnh ' + (currentIndex + 1) + ' / ' + images.length + ': ' + images[currentIndex].title) },
    { icon: '1️⃣',  name: 'Nhảy đến ảnh 1',       desc: 'Phím 1',       action: () => goTo(0) },
    { icon: '5️⃣',  name: 'Nhảy đến ảnh 5',       desc: 'Phím 5',       action: () => goTo(4) },
    { icon: '9️⃣',  name: 'Nhảy đến ảnh 9',       desc: 'Phím 9',       action: () => goTo(8) },
];

// ===== STATE =====
let currentIndex = 0;
let slideshowInterval = null;
let isPlaying = false;
let commandFocusIndex = -1;
let filteredCommands = [...commands];

// ===== DOM REFERENCES =====
const galleryImg       = document.getElementById('galleryImg');
const galleryTitle     = document.getElementById('galleryTitle');
const galleryCounter   = document.getElementById('galleryCounter');
const galleryThumbs    = document.getElementById('galleryThumbnails');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');
const playBtn          = document.getElementById('playBtn');
const lightboxModal    = document.getElementById('lightboxModal');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxCaption  = document.getElementById('lightboxCaption');
const lightboxClose    = document.getElementById('lightboxClose');
const commandOverlay   = document.getElementById('commandOverlay');
const commandInput     = document.getElementById('commandInput');
const commandList      = document.getElementById('commandList');
const imgWrapper       = document.querySelector('.gallery-img-wrapper');

// ===== GALLERY FUNCTIONS =====
function goTo(index) {
    currentIndex = (index + images.length) % images.length;
    updateGallery();
}

function navigate(direction) {
    goTo(currentIndex + direction);
}

function updateGallery() {
    const img = images[currentIndex];

    galleryImg.src   = img.src;
    galleryImg.alt   = img.title;
    galleryTitle.textContent  = img.title;
    galleryCounter.textContent = `${currentIndex + 1} / ${images.length}`;

    // Update thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
        thumb.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });

    // Scroll active thumbnail into view
    const activeThumb = galleryThumbs.querySelector('.thumbnail.active');
    if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function buildThumbnails() {
    galleryThumbs.innerHTML = '';
    images.forEach((img, i) => {
        const thumb = document.createElement('button');
        thumb.className = 'thumbnail' + (i === 0 ? ' active' : '');
        thumb.setAttribute('role', 'option');
        thumb.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        thumb.setAttribute('aria-label', `Ảnh ${i + 1}: ${img.title}`);
        thumb.dataset.index = i;

        const thumbImg = document.createElement('img');
        thumbImg.src = img.src;
        thumbImg.alt = img.title;
        thumb.appendChild(thumbImg);

        galleryThumbs.appendChild(thumb);
    });
}

// ===== SLIDESHOW =====
function togglePlay() {
    if (isPlaying) {
        stopPlay();
    } else {
        startPlay();
    }
}

function startPlay() {
    isPlaying = true;
    playBtn.textContent = '⏸ Pause';
    playBtn.classList.add('playing');
    slideshowInterval = setInterval(() => navigate(1), 2500);
}

function stopPlay() {
    isPlaying = false;
    playBtn.textContent = '▶ Play';
    playBtn.classList.remove('playing');
    clearInterval(slideshowInterval);
    slideshowInterval = null;
}

// ===== LIGHTBOX =====
function openLightbox(index) {
    const img = images[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.title;
    lightboxCaption.textContent = img.title;
    lightboxModal.style.display = 'flex';
    lightboxClose.focus();
    // Stop slideshow when opening lightbox
    if (isPlaying) stopPlay();
}

function closeLightbox() {
    lightboxModal.style.display = 'none';
}

// ===== COMMAND PALETTE =====
function openCommandPalette() {
    commandOverlay.style.display = 'flex';
    commandInput.value = '';
    commandFocusIndex = -1;
    filteredCommands = [...commands];
    renderCommands(filteredCommands);
    commandInput.focus();
}

function closeCommandPalette() {
    commandOverlay.style.display = 'none';
    commandFocusIndex = -1;
}

function renderCommands(list) {
    commandList.innerHTML = '';

    if (list.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'command-empty';
        empty.textContent = 'Không tìm thấy lệnh nào.';
        commandList.appendChild(empty);
        return;
    }

    list.forEach((cmd, i) => {
        const li = document.createElement('li');
        li.className = 'command-item';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.dataset.index = i;
        li.tabIndex = -1;

        const icon = document.createElement('span');
        icon.className = 'command-item-icon';
        icon.textContent = cmd.icon;

        const name = document.createElement('span');
        name.className = 'command-item-name';
        name.textContent = cmd.name;

        const desc = document.createElement('span');
        desc.className = 'command-item-desc';
        desc.textContent = cmd.desc;

        li.appendChild(icon);
        li.appendChild(name);
        li.appendChild(desc);

        li.addEventListener('click', () => {
            cmd.action();
            closeCommandPalette();
        });

        commandList.appendChild(li);
    });
}

function updateCommandFocus() {
    const items = commandList.querySelectorAll('.command-item');
    items.forEach((item, i) => {
        item.classList.toggle('focused', i === commandFocusIndex);
        item.setAttribute('aria-selected', i === commandFocusIndex ? 'true' : 'false');
    });
    if (commandFocusIndex >= 0 && items[commandFocusIndex]) {
        items[commandFocusIndex].scrollIntoView({ block: 'nearest' });
    }
}

// ===== EVENTS =====

// Gallery buttons
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));
playBtn.addEventListener('click', () => togglePlay());

// Thumbnail delegation
galleryThumbs.addEventListener('click', (e) => {
    const thumb = e.target.closest('.thumbnail');
    if (!thumb) return;
    goTo(Number(thumb.dataset.index));
});

// Click image → lightbox
imgWrapper.addEventListener('click', () => openLightbox(currentIndex));

// Lightbox close
lightboxClose.addEventListener('click', closeLightbox);
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
});

// Command palette input → filter realtime
commandInput.addEventListener('input', () => {
    const query = commandInput.value.toLowerCase();
    filteredCommands = commands.filter(cmd =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.desc.toLowerCase().includes(query)
    );
    commandFocusIndex = -1;
    renderCommands(filteredCommands);
});

// Command palette keyboard nav
commandInput.addEventListener('keydown', (e) => {
    const items = commandList.querySelectorAll('.command-item');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        commandFocusIndex = Math.min(commandFocusIndex + 1, items.length - 1);
        updateCommandFocus();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        commandFocusIndex = Math.max(commandFocusIndex - 1, -1);
        updateCommandFocus();
    } else if (e.key === 'Enter') {
        if (commandFocusIndex >= 0 && filteredCommands[commandFocusIndex]) {
            filteredCommands[commandFocusIndex].action();
            closeCommandPalette();
        }
    }
});

// Command overlay backdrop click
commandOverlay.addEventListener('click', (e) => {
    if (e.target === commandOverlay) closeCommandPalette();
});

// ===== GLOBAL KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    const tag = document.activeElement.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA';

    // Luôn xử lý Escape
    if (e.key === 'Escape') {
        if (commandOverlay.style.display !== 'none') {
            closeCommandPalette();
        } else if (lightboxModal.style.display !== 'none') {
            closeLightbox();
        }
        return;
    }

    // Ctrl+K — Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (commandOverlay.style.display !== 'none') {
            closeCommandPalette();
        } else {
            openCommandPalette();
        }
        return;
    }

    // Không xử lý tiếp nếu đang focus trong input (trừ command input đã xử lý trên)
    if (isInput) return;

    // Không xử lý nếu Command Palette đang mở
    if (commandOverlay.style.display !== 'none') return;

    // Mũi tên ← → chuyển ảnh
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
    }
    // Space — play/pause slideshow
    else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
    }
    // Số 1-9 — nhảy đến ảnh
    else if (e.key >= '1' && e.key <= '9') {
        const targetIndex = Number(e.key) - 1;
        if (targetIndex < images.length) {
            goTo(targetIndex);
        }
    }
});

// ===== INIT =====
buildThumbnails();
updateGallery();
