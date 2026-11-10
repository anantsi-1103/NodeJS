// TaskPulse Client SPA Engine
let currentUser = null;
let tasks = [];
let socket = null;

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    initForms();
});

// Check if user is logged in
async function checkAuth() {
    try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.success && data.user) {
            currentUser = data.user;
            showDashboard();
        } else {
            showAuth();
        }
    } catch {
        showAuth();
    }
}

function showAuth() {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
}

function showDashboard() {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");

    document.getElementById("user-name").innerText = currentUser.name;
    document.getElementById("user-role-badge").innerText = currentUser.role;
    document.getElementById("user-avatar").src = currentUser.avatar || "/uploads/default-avatar.png";

    connectWebSocket();
    loadTasks();
}

function connectWebSocket() {
    if (socket) return;
    socket = io();

    socket.on("connect", () => {
        const el = document.getElementById("socket-status");
        if (el) el.innerText = "Live Connected";
    });

    socket.on("disconnect", () => {
        const el = document.getElementById("socket-status");
        if (el) el.innerText = "Reconnecting...";
    });

    socket.on("taskCreated", (newTask) => {
        tasks.unshift(newTask);
        renderKanban();
        showToast(`⚡ New Task: "${newTask.title}" added by ${newTask.user?.name || 'Someone'}`, "info");
    });

    socket.on("taskUpdated", (updatedTask) => {
        tasks = tasks.map(t => t._id === updatedTask._id ? updatedTask : t);
        renderKanban();
        showToast(`🔄 Task moved to "${updatedTask.status}"`, "info");
    });

    socket.on("taskDeleted", (deletedId) => {
        tasks = tasks.filter(t => t._id !== deletedId);
        renderKanban();
        showToast("🗑️ Task deleted", "warning");
    });
}

async function loadTasks() {
    try {
        const res = await fetch("/api/tasks", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
            tasks = data.data;
            renderKanban();
        }
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
    }
}

function renderKanban() {
    const colPending = document.getElementById("col-pending");
    const colProgress = document.getElementById("col-progress");
    const colCompleted = document.getElementById("col-completed");

    colPending.innerHTML = "";
    colProgress.innerHTML = "";
    colCompleted.innerHTML = "";

    let pendingCount = 0;
    let progressCount = 0;
    let completedCount = 0;

    tasks.forEach(task => {
        const card = createCard(task);
        if (task.status === "Pending") {
            colPending.appendChild(card);
            pendingCount++;
        } else if (task.status === "In Progress") {
            colProgress.appendChild(card);
            progressCount++;
        } else if (task.status === "Completed") {
            colCompleted.appendChild(card);
            completedCount++;
        }
    });

    document.getElementById("stat-total").innerText = tasks.length;
    document.getElementById("stat-pending").innerText = pendingCount;
    document.getElementById("stat-progress").innerText = progressCount;
    document.getElementById("stat-completed").innerText = completedCount;

    document.getElementById("badge-pending-count").innerText = pendingCount;
    document.getElementById("badge-progress-count").innerText = progressCount;
    document.getElementById("badge-completed-count").innerText = completedCount;
}

function createCard(task) {
    const div = document.createElement("div");
    div.className = "task-item";
    div.id = `spa-task-${task._id}`;

    const priorityBadges = {
        High: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        Low: "bg-slate-500/10 text-slate-400 border-slate-500/20"
    };

    const avatar = task.user?.avatar || "/uploads/default-avatar.png";
    const userName = task.user?.name || "Member";

    div.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${priorityBadges[task.priority] || priorityBadges.Medium}">
                ${task.priority} Priority
            </span>
            ${currentUser?.role === 'Admin' ? `
                <button onclick="deleteTaskItem('${task._id}')" class="text-slate-500 hover:text-rose-400 transition text-xs p-1">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            ` : ''}
        </div>
        <h4 class="text-sm font-semibold text-slate-100 mb-3 leading-snug break-words">${escapeHtml(task.title)}</h4>
        <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
            <div class="flex items-center gap-2">
                <img src="${avatar}" onerror="this.src='/uploads/default-avatar.png'" class="w-6 h-6 rounded-full object-cover border border-slate-600">
                <span class="text-slate-400 text-[11px] truncate max-w-[80px]">${escapeHtml(userName)}</span>
            </div>
            <select onchange="updateTaskItemStatus('${task._id}', this.value)" class="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] py-1 px-2 rounded-lg">
                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>To Do</option>
                <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        </div>
    `;
    return div;
}

async function updateTaskItemStatus(id, newStatus) {
    try {
        await fetch(`/api/tasks/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status: newStatus })
        });
    } catch {
        showToast("Error updating task status", "error");
    }
}

async function deleteTaskItem(id) {
    if (!confirm("Are you sure?")) return;
    try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE", credentials: "include" });
        const data = await res.json();
        if (!data.success) showToast(data.message || "Delete failed", "error");
    } catch {
        showToast("Error deleting task", "error");
    }
}

function initForms() {
    // Login
    document.getElementById("spa-login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("spa-login-email").value.trim();
        const password = document.getElementById("spa-login-password").value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                currentUser = data.user;
                showDashboard();
                showToast("Welcome back, " + currentUser.name, "success");
            } else {
                showToast(data.message || "Invalid credentials", "error");
            }
        } catch {
            showToast("Server connection error", "error");
        }
    });

    // Register
    document.getElementById("spa-register-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", document.getElementById("spa-reg-name").value.trim());
        formData.append("email", document.getElementById("spa-reg-email").value.trim());
        formData.append("password", document.getElementById("spa-reg-password").value);
        formData.append("role", document.getElementById("spa-reg-role").value);

        const avatar = document.getElementById("spa-reg-avatar").files[0];
        if (avatar) formData.append("avatar", avatar);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Accept": "application/json" },
                credentials: "include",
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                currentUser = data.user;
                showDashboard();
                showToast("Account created successfully!", "success");
            } else {
                showToast(data.message || "Registration failed", "error");
            }
        } catch {
            showToast("Server connection error", "error");
        }
    });

    // Create Task Modal Form
    document.getElementById("spa-task-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("spa-task-title").value.trim();
        const priority = document.getElementById("spa-task-priority").value;

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ title, priority })
            });
            const data = await res.json();
            if (data.success) {
                closeModal();
                document.getElementById("spa-task-title").value = "";
                showToast("Task created successfully!", "success");
            } else {
                showToast(data.message || "Create failed", "error");
            }
        } catch {
            showToast("Error creating task", "error");
        }
    });
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById("spa-login-form");
    const regForm = document.getElementById("spa-register-form");
    const loginBtn = document.getElementById("tab-login-btn");
    const regBtn = document.getElementById("tab-register-btn");

    if (tab === "login") {
        loginForm.classList.remove("hidden");
        regForm.classList.add("hidden");
        loginBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-600 text-white shadow-sm transition";
        regBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-slate-400 hover:text-white transition";
    } else {
        loginForm.classList.add("hidden");
        regForm.classList.remove("hidden");
        regBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-600 text-white shadow-sm transition";
        loginBtn.className = "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-slate-400 hover:text-white transition";
    }
}

function openModal() {
    document.getElementById("task-modal").classList.remove("hidden");
    document.getElementById("spa-task-title").focus();
}

function closeModal() {
    document.getElementById("task-modal").classList.add("hidden");
}

function logout() {
    fetch("/api/auth/logout", { credentials: "include" });
    currentUser = null;
    if (socket) socket.disconnect();
    socket = null;
    showAuth();
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const themes = {
        success: "bg-emerald-600 text-white border-emerald-500",
        error: "bg-rose-600 text-white border-rose-500",
        warning: "bg-amber-600 text-white border-amber-500",
        info: "bg-slate-800 text-slate-100 border-indigo-500/50"
    };

    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition duration-300 transform translate-y-2 opacity-0 ${themes[type] || themes.info}`;
    toast.innerHTML = `<span class="flex-1">${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.remove("translate-y-2", "opacity-0"));
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return (text || '').replace(/[&<>"']/g, m => map[m]);
}
