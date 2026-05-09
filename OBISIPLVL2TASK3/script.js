/**
 * NexTask Pro - Script Logic
 */

// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('tasks_pro')) || [];
let editingTaskId = null;
let currentTheme = localStorage.getItem('theme') || 'dark';

// --- DOM Elements ---
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const mainTaskList = document.getElementById('mainTaskList');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const sortBy = document.getElementById('sortBy');

// Stats
const totalTasksElem = document.getElementById('totalTasks');
const pendingTasksCountElem = document.getElementById('pendingTasksCount');
const completedTasksCountElem = document.getElementById('completedTasksCount');
const expiredTasksCountElem = document.getElementById('expiredTasksCount');

// Modal
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const editDeadline = document.getElementById('editDeadline');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');

// Toast & Sound
const toastContainer = document.getElementById('toastContainer');
const completeSound = document.getElementById('completeSound');

// --- Initialization ---
function init() {
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    requestNotificationPermission();
    
    // Start interval to check for expiry and reminders
    setInterval(checkDeadlines, 60000); // Every minute
    
    render();
}

// --- Theme Logic ---
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    showToast(`Switched to ${currentTheme} mode`, 'info');
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
    } else {
        icon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

// --- Notification Logic ---
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: 'https://cdn-icons-png.flaticon.com/512/2098/2098402.png' });
    }
}

// --- Task CRUD Logic ---
function saveToLocal() {
    localStorage.setItem('tasks_pro', JSON.stringify(tasks));
}

function addTask() {
    const title = taskInput.value.trim();
    if (!title) {
        showToast("Please enter a task name", "warning");
        return;
    }

    const deadline = deadlineInput.value;
    const newTask = {
        id: Date.now().toString(),
        title: title,
        createdAt: new Date().toISOString(),
        completedAt: null,
        deadline: deadline || null,
        status: 'pending',
        reminded: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    deadlineInput.value = '';
    saveToLocal();
    render();
    showToast("Task added successfully!", "success");
}

function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            const isNowCompleted = task.status !== 'completed';
            if (isNowCompleted) {
                completeSound.play();
                showToast("Task completed! Great job!", "success");
            }
            return {
                ...task,
                status: isNowCompleted ? 'completed' : (isExpired(task.deadline) ? 'expired' : 'pending'),
                completedAt: isNowCompleted ? new Date().toISOString() : null
            };
        }
        return task;
    });
    saveToLocal();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocal();
    render();
    showToast("Task removed", "info");
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    editInput.value = task.title;
    editDeadline.value = task.deadline || '';
    
    editModal.style.display = 'flex';
    setTimeout(() => {
        editModal.style.opacity = '1';
        editModal.style.pointerEvents = 'all';
    }, 10);
    editInput.focus();
}

function closeEditModal() {
    editModal.style.opacity = '0';
    editModal.style.pointerEvents = 'none';
    setTimeout(() => {
        editModal.style.display = 'none';
    }, 300);
    editingTaskId = null;
}

function saveEditedTask() {
    const newTitle = editInput.value.trim();
    const newDeadline = editDeadline.value;

    if (newTitle && editingTaskId) {
        tasks = tasks.map(task => {
            if (task.id === editingTaskId) {
                let newStatus = task.status;
                if (task.status !== 'completed') {
                    newStatus = isExpired(newDeadline) ? 'expired' : 'pending';
                }
                return { 
                    ...task, 
                    title: newTitle, 
                    deadline: newDeadline || null,
                    status: newStatus
                };
            }
            return task;
        });
        saveToLocal();
        render();
        closeEditModal();
        showToast("Task updated", "success");
    }
}

// --- Utilities ---
function isExpired(deadline) {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
}

function checkDeadlines() {
    let changed = false;
    const now = new Date();

    tasks = tasks.map(task => {
        // Expiry check
        if (task.status === 'pending' && isExpired(task.deadline)) {
            task.status = 'expired';
            changed = true;
            showNotification("Task Expired!", `The deadline for "${task.title}" has passed.`);
        }

        // Reminder check (10 minutes before)
        if (task.status === 'pending' && task.deadline && !task.reminded) {
            const timeDiff = new Date(task.deadline) - now;
            if (timeDiff > 0 && timeDiff <= 600000) { // 10 minutes
                task.reminded = true;
                changed = true;
                showNotification("Task Deadline Approaching", `"${task.title}" is due in less than 10 minutes.`);
                showToast(`Reminder: ${task.title} is due soon!`, "warning");
            }
        }
        return task;
    });

    if (changed) {
        saveToLocal();
        render();
    }
}

function formatDateTime(dateString) {
    if (!dateString) return "No deadline";
    const options = { 
        day: '2-digit', month: 'short', 
        hour: '2-digit', minute: '2-digit',
        hour12: true 
    };
    return new Date(dateString).toLocaleString('en-US', options);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'alert-triangle';
    if (type === 'danger') icon = 'x-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Rendering Logic ---
function render() {
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesStatus = filterStatus.value === 'all' || task.status === filterStatus.value;
        return matchesSearch && matchesStatus;
    });

    // Sorting
    filteredTasks.sort((a, b) => {
        if (sortBy.value === 'newest') return b.id - a.id;
        if (sortBy.value === 'oldest') return a.id - b.id;
        if (sortBy.value === 'deadline') {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        }
        return 0;
    });

    // Update Stats
    totalTasksElem.textContent = tasks.length;
    pendingTasksCountElem.textContent = tasks.filter(t => t.status === 'pending').length;
    completedTasksCountElem.textContent = tasks.filter(t => t.status === 'completed').length;
    expiredTasksCountElem.textContent = tasks.filter(t => t.status === 'expired').length;

    // Render List
    if (filteredTasks.length === 0) {
        mainTaskList.innerHTML = `
            <div class="task-card" style="opacity: 0.5; border-style: dashed; align-items: center; justify-content: center; padding: 3rem;">
                <p>No tasks found. Try adding some!</p>
            </div>
        `;
    } else {
        mainTaskList.innerHTML = filteredTasks.map(task => `
            <div class="task-card ${task.status}" id="task-${task.id}">
                <div class="task-header">
                    <div class="task-info">
                        <span class="status-badge badge-${task.status}">${task.status}</span>
                        <h3 class="task-title">${task.title}</h3>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn btn-complete" onclick="toggleComplete('${task.id}')" title="Toggle Complete">
                            <i data-lucide="${task.status === 'completed' ? 'rotate-ccw' : 'check'}"></i>
                        </button>
                        ${task.status !== 'completed' ? `
                            <button class="action-btn btn-edit" onclick="openEditModal('${task.id}')" title="Edit Task">
                                <i data-lucide="edit-3"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn btn-delete" onclick="deleteTask('${task.id}')" title="Delete Task">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    <div class="meta-item">
                        <i data-lucide="calendar-plus" size="14"></i>
                        <span>Created: ${formatDateTime(task.createdAt)}</span>
                    </div>
                    ${task.deadline ? `
                        <div class="meta-item meta-deadline">
                            <i data-lucide="clock" size="14"></i>
                            <span>Due: ${formatDateTime(task.deadline)}</span>
                        </div>
                    ` : ''}
                    ${task.completedAt ? `
                        <div class="meta-item" style="color: var(--accent-success);">
                            <i data-lucide="check-circle" size="14"></i>
                            <span>Done: ${formatDateTime(task.completedAt)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    lucide.createIcons();
}

// --- Event Listeners ---
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { e.key === 'Enter' && addTask(); });
searchInput.addEventListener('input', render);
filterStatus.addEventListener('change', render);
sortBy.addEventListener('change', render);
cancelEdit.addEventListener('click', closeEditModal);
saveEdit.addEventListener('click', saveEditedTask);
editInput.addEventListener('keypress', (e) => { e.key === 'Enter' && saveEditedTask(); });

// Run Init
document.addEventListener('DOMContentLoaded', init);
