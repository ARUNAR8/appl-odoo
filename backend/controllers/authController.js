const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation regex definitions
const ID_REGEX = /^[A-Za-z]{2}\d{5}$/;
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.register = async (req, res) => {
  const { id, name, email, password, role } = req.body;

  // Validate Employee ID
  if (!id || !ID_REGEX.test(id)) {
    return res.status(400).json({ error: 'Wrong Employee ID format' });
  }

  // Validate Full Name
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Full name is required' });
  }

  // Validate Gmail
  if (!email || !GMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Must be a valid Gmail ID (e.g. user@gmail.com)' });
  }

  // Validate Password
  if (!password || !PASS_REGEX.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' });
  }

  const dbRole = role === 'admin' ? 'admin' : 'employee';

  let connection;
  try {
    connection = await pool.getConnection();

    // Check if ID or Email already exists
    const [existingUsers] = await connection.query(
      'SELECT id, email FROM users WHERE id = ? OR email = ?',
      [id, email]
    );

    if (existingUsers.length > 0) {
      const existsId = existingUsers.some(u => u.id === id);
      if (existsId) {
        return res.status(400).json({ error: 'Employee ID already exists' });
      }
      return res.status(400).json({ error: 'Email address already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default corporate values
    const department = dbRole === 'admin' ? 'Management' : 'Engineering';
    const jobTitle = dbRole === 'admin' ? 'Chief Technology Officer' : 'Software Engineer';
    const joinDate = new Date().toISOString().split('T')[0];
    const supervisor = dbRole === 'admin' ? 'CEO' : 'Sarah Connor (CTO)';
    const basicSalary = dbRole === 'admin' ? 8500 : 3500;
    const allowances = dbRole === 'admin' ? 800 : 200;
    const deductions = dbRole === 'admin' ? 1000 : 400;

    await connection.beginTransaction();

    // Insert user
    await connection.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, dbRole]
    );

    // Insert employee profile
    await connection.query(
      'INSERT INTO employees (id, name, email, role, department, jobTitle, joinDate, supervisor, phone, address, basicSalary, allowances, deductions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, dbRole, department, jobTitle, joinDate, supervisor, '+1 (555) 000-0000', 'Enter address...', basicSalary, allowances, deductions]
    );

    await connection.commit();

    // Generate JWT token
    const token = jwt.sign(
      { id, name, email, role: dbRole },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id, name, email, role: dbRole }
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Database transaction failed: ' + error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Fetch user from DB
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  res.status(200).json({ message: 'Email verified successfully (mock verification)' });
};