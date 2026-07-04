const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const safeUser = (row) => ({
  id:    row.id,
  name:  row.name,
  email: row.email,
  role:  row.role,
});

// ─── POST /api/auth/register ────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'employee' } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email and password are required' });

    // Check duplicate
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'An account with this email already exists' });

    const password_hash = await bcrypt.hash(password, 12);

    // Insert user
    const [userResult] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role]
    );
    const userId = userResult.insertId;

    // Create linked employee profile
    await pool.query(
      'INSERT INTO employees (user_id) VALUES (?)',
      [userId]
    );

    const newUser = { id: userId, name, email, role };
    const token = signToken({ id: userId, role });

    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/auth/login ───────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });

    // Fetch user row
    const [rows] = await pool.query(
      'SELECT u.*, e.id AS emp_id FROM users u LEFT JOIN employees e ON e.user_id = u.id WHERE u.email = ?',
      [email]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const dbUser = rows[0];
    const match = await bcrypt.compare(password, dbUser.password_hash);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken({ id: dbUser.id, role: dbUser.role });
    const user = {
      id:    dbUser.id,
      empId: dbUser.emp_id,
      name:  dbUser.name,
      email: dbUser.email,
      role:  dbUser.role,
    };

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/auth/verify-email ─────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET email_verified = 1 WHERE id = ?', [decoded.id]);
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};