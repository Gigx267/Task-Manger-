const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public folder

// Enable CORS (for development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// In-memory "database"
let tasks = [
    { id: 1, title: 'Learn Express', completed: false },
    { id: 2, title: 'Build API', completed: false }
];
let nextId = 3;

// Routes

// GET all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET a single task
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
});

// POST a new task
app.post('/tasks', (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
        id: nextId++,
        title: req.body.title,
        completed: req.body.completed || false
    };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT (update) a task
app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    res.json(task);
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`- GET /tasks - Get all tasks`);
    console.log(`- POST /tasks - Create new task`);
    console.log(`- PUT /tasks/:id - Update task`);
    console.log(`- DELETE /tasks/:id - Delete task`);
});