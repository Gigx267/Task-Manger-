// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const loadingIndicator = document.getElementById('loading');

// API Configuration
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

const API_URL = `${API_BASE}/tasks`;

// UI Functions
function showLoading() {
  loadingIndicator.style.display = 'block';
}

function hideLoading() {
  loadingIndicator.style.display = 'none';
}

function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.textContent = message;
  document.body.prepend(errorElement);
  setTimeout(() => errorElement.remove(), 3000);
}

// Task Rendering
function renderTask(task) {
  const taskElement = document.createElement('div');
  taskElement.className = `task ${task.completed ? 'completed' : ''}`;
  taskElement.innerHTML = `
    <span>${task.title}</span>
    <div class="task-actions">
      <button onclick="toggleTask('${task._id}', ${task.completed})">
        ${task.completed ? 'Undo' : 'Complete'}
      </button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    </div>
  `;
  return taskElement;
}

// API Functions
async function fetchTasks() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    showError(error.message);
    return [];
  } finally {
    hideLoading();
  }
}

async function addNewTask(title) {
  showLoading();
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to add task');
    return await response.json();
  } catch (error) {
    showError(error.message);
    return null;
  } finally {
    hideLoading();
  }
}

async function updateTask(id, updates) {
  showLoading();
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  } catch (error) {
    showError(error.message);
    return null;
  } finally {
    hideLoading();
  }
}

async function deleteTaskById(id) {
  showLoading();
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return true;
  } catch (error) {
    showError(error.message);
    return false;
  } finally {
    hideLoading();
  }
}

// Event Handlers
async function loadTasks() {
  taskList.innerHTML = '';
  const tasks = await fetchTasks();
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty">No tasks found. Add one above!</p>';
    return;
  }
  tasks.forEach(task => taskList.appendChild(renderTask(task)));
}

async function handleSubmit(e) {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  
  const newTask = await addNewTask(title);
  if (newTask) {
    taskInput.value = '';
    await loadTasks();
  }
}

// Global functions for button clicks
window.toggleTask = async (id, currentStatus) => {
  await updateTask(id, { completed: !currentStatus });
  await loadTasks();
};

window.deleteTask = async (id) => {
  if (!confirm('Are you sure you want to delete this task?')) return;
  const success = await deleteTaskById(id);
  if (success) await loadTasks();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  taskForm.addEventListener('submit', handleSubmit);
  loadTasks();
});
