const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: ['https://unifour.io', 'http://unifour.io', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
};

testConnection();

// Base path for all routes
const BASE_PATH = '/backend';

// Health check endpoint
app.get(`${BASE_PATH}/health`, (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes with base path /backend for posts2
app.get(`${BASE_PATH}/api/posts2`, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM posts2 ORDER BY created_at DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

app.post(`${BASE_PATH}/api/posts2`, async (req, res) => {
  const {
    name,
    username,
    description,
    media,
    q_name,
    q_username,
    q_description,
    q_media
  } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO posts2 (
        name,
        username,
        description,
        media,
        q_name,
        q_username,
        q_description,
        q_media
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                                      [name, username, description, media, q_name, q_username, q_description, q_media]
    );

    const [newPost] = await pool.query(
      'SELECT * FROM posts2 WHERE id = ?',
      [result.insertId]
    );

    res.json(newPost[0]);
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Additional endpoint to get a specific post by ID
app.get(`${BASE_PATH}/api/posts2/:id`, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM posts2 WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at path: ${BASE_PATH}/api/`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});
