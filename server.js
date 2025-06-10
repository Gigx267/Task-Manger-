// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// API Base URL - Updated for Vercel deployment
const API_URL = '/api/tasks'; // Uses relative path for Vercel

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Form submission handler
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    
    if (title) {
        await addTask(title);
        taskInput.value = ''; // Clear input
        await loadTasks(); // Refresh the list
    }
});

// Fetch all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        
        taskList.innerHTML = ''; // Clear current list
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<p>No tasks found. Add one above!</p>';
            return;
        }
        
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
        taskList.innerHTML = '<p>Error loading tasks. Please try again later.</p>';
    }
}

// Add a new task
async function addTask(title) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ title, completed: false })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to add task: ${response.status}`);
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
    }
}

// Toggle task completion status
async function toggleTask(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ completed: !currentStatus })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update task: ${response.status}`);
        }
        
        await loadTasks(); // Refresh the list
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status}`);
        }
        
        await loadTasks(); // Refresh the list
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    }
}

// Make functions available in global scope
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
