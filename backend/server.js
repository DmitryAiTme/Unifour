import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

initializeDatabase().catch(console.error);

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC LIMIT 3');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO posts (title, content) VALUES (?, ?)',
      [title, content]
    );
    res.json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
