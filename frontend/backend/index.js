require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashed]);
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  res.json({ token });
});

// Image CRUD routes
app.post('/api/images', authenticateToken, upload.single('image'), async (req, res) => {
  const { originalname, buffer } = req.file;
  const { data, error } = await supabase.storage.from('images').upload(`${req.user.id}/${Date.now()}_${originalname}`, buffer, { contentType: req.file.mimetype });
  if (error) return res.status(500).json({ error: error.message });
  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${data.path}`;
  await pool.query('INSERT INTO images (user_id, url, name) VALUES ($1, $2, $3)', [req.user.id, imageUrl, originalname]);
  res.json({ url: imageUrl });
});

app.get('/api/images', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT * FROM images WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

app.delete('/api/images/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM images WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
  if (!result.rowCount) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
