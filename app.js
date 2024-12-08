require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const Joi = require('joi');
const morgan = require('morgan');
const path = require('path');

// Initialize express app
const app = express();
app.use(express.json());
app.use(morgan('dev'));

// SQLite Database Setup
const db = new sqlite3.Database(path.resolve(__dirname, process.env.DB_PATH || './database.sqlite'), (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'TODO',
      priority TEXT CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')),
      dueDate TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Joi Validation Schema for Task
const taskSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  dueDate: Joi.date().optional()
});

// Route Handlers

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const { title, description, status = 'TODO', priority, dueDate } = req.body;
  const query = `
    INSERT INTO tasks (title, description, status, priority, dueDate)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [title, description, status, priority, dueDate], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
  const filters = req.query;
  const { status, priority, sort = 'createdAt', order = 'asc', limit = 10, skip = 0 } = filters;
  const query = `
    SELECT * FROM tasks
    WHERE (status = ? OR ? IS NULL)
    AND (priority = ? OR ? IS NULL)
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;
  db.all(query, [status, status, priority, priority, limit, skip], (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(tasks);
  });
});

// GET /tasks/:id - Retrieve a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', (req, res) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const { id } = req.params;
  const { title, description, status, priority, dueDate } = req.body;
  const query = `
    UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
  `;
  db.run(query, [title, description, status, priority, dueDate, id], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// DELETE /tasks/:id - Delete a specific task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
