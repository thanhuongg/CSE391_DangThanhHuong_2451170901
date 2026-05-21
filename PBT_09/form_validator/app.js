// ===== DOM REFERENCES =====
const form = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalInfo = document.getElementById('modalInfo');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm');
const phoneInput = document.getElementById('phone');

// ===== VALIDATION STATE =====
const validState = {
    name: false,
    email: false,
    password: false,
    confirm: false,
    phone: false
};

// ===== HELPER: Set field state =====
function setFieldState(fieldId, isValid, iconText, msgText) {
    const group = document.getElementById('group-' + fieldId);
    const icon  = document.getElementById('icon-' + fieldId);
    const msg   = document.getElementById('msg-' + fieldId);

    group.classList.remove('valid', 'invalid');

    if (isValid === true) {
        group.classList.add('valid');
    } else if (isValid === false) {
        group.classList.add('invalid');
    }

    if (icon) icon.textContent = iconText || '';
    if (msg)  msg.textContent  = msgText  || '';

    validState[fieldId] = isValid === true;
    updateSubmitBtn();
}

function updateSubmitBtn() {
    const allValid = Object.values(validState).every(v => v === true);
    submitBtn.disabled = !allValid;
}

// ===== VALIDATE NAME =====
nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim();
    if (!val) {
        setFieldState('name', null, '', '');
        return;
    }
    if (val.length < 2) {
        setFieldState('name', false, '❌', 'Tên phải có ít nhất 2 ký tự');
    } else if (val.length > 50) {
        setFieldState('name', false, '❌', 'Tên không được vượt quá 50 ký tự');
    } else {
        setFieldState('name', true, '✅', 'Tên hợp lệ');
    }
});

// ===== VALIDATE EMAIL =====
const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

emailInput.addEventListener('input', () => {
    const val = emailInput.value.trim();
    if (!val) {
        setFieldState('email', null, '', '');
        return;
    }
    if (!val.includes('@')) {
        setFieldState('email', false, '❌', 'Email phải chứa ký tự @');
    } else if (!emailRegex.test(val)) {
        setFieldState('email', false, '❌', 'Địa chỉ email không hợp lệ');
    } else {
        setFieldState('email', true, '✅', 'Email hợp lệ');
    }
});

// ===== VALIDATE PASSWORD (strength meter) =====
function getPasswordStrength(password) {
    if (password.length < 8) return 'weak';
    const hasLower   = /[a-z]/.test(password);
    const hasUpper   = /[A-Z]/.test(password);
    const hasDigit   = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLower && hasUpper && hasDigit && hasSpecial) return 'strong';
    if ((hasLower || hasUpper) && hasDigit) return 'medium';
    return 'weak';
}

passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const strengthBar   = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');

    if (!val) {
        setFieldState('password', null, '', '');
        strengthBar.className = 'strength-bar';
        strengthLabel.textContent = '';
        strengthLabel.className = 'strength-label';
        // Recheck confirm
        validateConfirm();
        return;
    }

    const level = getPasswordStrength(val);
    const labelMap = { weak: 'Yếu', medium: 'Trung bình', strong: 'Mạnh' };
    const hintMap  = {
        weak: 'Mật khẩu phải có ít nhất 8 ký tự',
        medium: 'Thêm chữ hoa và ký tự đặc biệt để mạnh hơn',
        strong: 'Mật khẩu rất mạnh!'
    };

    strengthBar.className = 'strength-bar ' + level;
    strengthLabel.textContent = labelMap[level];
    strengthLabel.className = 'strength-label ' + level;

    if (val.length < 8) {
        setFieldState('password', false, '❌', hintMap[level]);
    } else {
        setFieldState('password', true, '✅', hintMap[level]);
    }

    // Recheck confirm mỗi khi password thay đổi
    validateConfirm();
});

// ===== VALIDATE CONFIRM PASSWORD =====
function validateConfirm() {
    const pw  = passwordInput.value;
    const con = confirmInput.value;

    if (!con) {
        setFieldState('confirm', null, '', '');
        return;
    }
    if (con === pw) {
        setFieldState('confirm', true, '✅', 'Mật khẩu khớp');
    } else {
        setFieldState('confirm', false, '❌', 'Mật khẩu không khớp');
    }
}

confirmInput.addEventListener('input', validateConfirm);

// ===== VALIDATE PHONE (tự thêm dấu gạch) =====
phoneInput.addEventListener('input', (e) => {
    // Chỉ giữ số
    let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);

    // Format: 0901-234-567
    let formatted = digits;
    if (digits.length > 7) {
        formatted = digits.slice(0, 4) + '-' + digits.slice(4, 7) + '-' + digits.slice(7);
    } else if (digits.length > 4) {
        formatted = digits.slice(0, 4) + '-' + digits.slice(4);
    }

    phoneInput.value = formatted;

    if (!digits) {
        setFieldState('phone', null, '', '');
        return;
    }

    if (digits.length !== 10) {
        setFieldState('phone', false, '❌', `Cần đủ 10 chữ số (hiện có ${digits.length})`);
    } else if (!/^0[0-9]{9}$/.test(digits)) {
        setFieldState('phone', false, '❌', 'Số điện thoại phải bắt đầu bằng 0');
    } else {
        setFieldState('phone', true, '✅', 'Số điện thoại hợp lệ');
    }
});

// ===== SUBMIT =====
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Tạo nội dung modal bằng DOM (không dùng innerHTML với user input)
    modalInfo.innerHTML = '';

    const rows = [
        { label: 'Họ và tên', value: nameInput.value.trim() },
        { label: 'Email',     value: emailInput.value.trim() },
        { label: 'Điện thoại', value: phoneInput.value },
    ];

    rows.forEach(row => {
        const line = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = row.label + ': ';
        const span = document.createElement('span');
        span.textContent = row.value; // textContent — an toàn
        line.appendChild(strong);
        line.appendChild(span);
        modalInfo.appendChild(line);
    });

    successModal.classList.add('show');
    modalCloseBtn.focus();
});

// ===== CLOSE MODAL =====
modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('show');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        successModal.classList.remove('show');
    }
});
