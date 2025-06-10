// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// API Base URL
const API_URL = 'http://localhost:3000/tasks';

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Form submission handler
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    
    if (title) {
        await addTask(title);
        taskInput.value = ''; // Clear input
        loadTasks(); // Refresh the list
    }
});

// Fetch all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        
        taskList.innerHTML = ''; // Clear current list
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <span>${task.title}</span>
                <div>
                    <button onclick="toggleTask(${task.id}, ${task.completed})">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Add a new task
async function addTask(title) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, completed: false })
        });
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Toggle task completion status
async function toggleTask(id, currentStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });
        loadTasks(); // Refresh the list
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadTasks(); // Refresh the list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}