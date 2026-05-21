// ===== STATE =====
let todos = [];
let nextId = 1;
let currentFilter = 'all';

// ===== DOM REFERENCES =====
const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const todoList = document.querySelector('#todoList');
const itemCount = document.querySelector('#itemCount');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== LOCALSTORAGE =====
function saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('nextId', String(nextId));
}

function loadFromStorage() {
    const savedTodos = localStorage.getItem('todos');
    const savedId = localStorage.getItem('nextId');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    if (savedId) {
        nextId = parseInt(savedId, 10);
    }
}

// ===== RENDER =====
function getFilteredTodos() {
    if (currentFilter === 'active') return todos.filter(t => !t.completed);
    if (currentFilter === 'completed') return todos.filter(t => t.completed);
    return todos;
}

function renderTodos() {
    const filtered = getFilteredTodos();

    // Xóa tất cả items hiện tại
    todoList.innerHTML = '';

    // Dùng createElement — KHÔNG dùng innerHTML cho todo items
    filtered.forEach(todo => {
        const li = createTodoElement(todo);
        todoList.appendChild(li);
    });

    // Cập nhật counter — chỉ đếm chưa completed
    const activeCount = todos.filter(t => !t.completed).length;
    itemCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    // Toggle button (checkbox)
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.dataset.action = 'toggle';
    toggleBtn.dataset.id = todo.id;
    toggleBtn.setAttribute('aria-label', todo.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành');
    if (todo.completed) toggleBtn.textContent = '✓';

    // Text span — double-click để edit
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.dataset.action = 'edit-start';
    span.dataset.id = todo.id;
    span.textContent = todo.text; // textContent — an toàn, không XSS

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.dataset.id = todo.id;
    deleteBtn.setAttribute('aria-label', 'Xóa todo');
    deleteBtn.textContent = '❌';

    li.appendChild(toggleBtn);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

// ===== ACTIONS =====
function addTodo(text) {
    const todo = {
        id: nextId++,
        text: text.trim(),
        completed: false
    };
    todos.push(todo);
    saveToStorage();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToStorage();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveToStorage();
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveToStorage();
    renderTodos();
}

// ===== EDIT TODO =====
function startEdit(id) {
    const li = todoList.querySelector(`[data-id="${id}"]`);
    if (!li) return;

    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    li.classList.add('editing');

    // Ẩn span, tạo input
    const span = li.querySelector('.todo-text');
    span.style.display = 'none';

    const editInput = document.createElement('input');
    editInput.className = 'edit-input';
    editInput.value = todo.text;
    editInput.dataset.action = 'edit-save';
    editInput.dataset.id = id;

    li.insertBefore(editInput, span);
    editInput.focus();
    editInput.select();

    // Lưu khi nhấn Enter hoặc blur
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveEdit(id, editInput.value);
        if (e.key === 'Escape') cancelEdit(id);
    });

    editInput.addEventListener('blur', () => {
        saveEdit(id, editInput.value);
    });
}

function saveEdit(id, newText) {
    const trimmed = newText.trim();
    if (trimmed) {
        todos = todos.map(t => t.id === id ? { ...t, text: trimmed } : t);
        saveToStorage();
    }
    renderTodos();
}

function cancelEdit(id) {
    renderTodos();
}

// ===== EVENTS =====

// Form submit — thêm todo
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = '';
    input.focus();
});

// Event Delegation — bind trên #todoList, KHÔNG bind trên từng <li>
todoList.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const id = Number(e.target.dataset.id);

    if (!action || !id) return;

    if (action === 'toggle') {
        toggleTodo(id);
    }

    if (action === 'delete') {
        deleteTodo(id);
    }
});

// Double-click để edit — cũng dùng event delegation
todoList.addEventListener('dblclick', (e) => {
    const action = e.target.dataset.action;
    const id = Number(e.target.dataset.id);

    if (action === 'edit-start' && id) {
        startEdit(id);
    }
});

// Clear completed
clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
});

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// ===== INIT =====
loadFromStorage();
renderTodos();
