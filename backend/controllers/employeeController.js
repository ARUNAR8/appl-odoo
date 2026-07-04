const pool = require('../config/db');

// ─── Shared row mapper ───────────────────────────────────────
const mapEmployee = (row) => ({
  id:           row.id,
  userId:       row.user_id,
  name:         row.name,
  email:        row.email,
  role:         row.role,
  department:   row.department,
  jobTitle:     row.title,        // frontend uses emp.jobTitle
  title:        row.title,        // kept for compatibility
  phone:        row.phone,
  address:      row.address,
  supervisor:   row.supervisor,
  joinDate:     row.join_date,
  basicSalary:  parseFloat(row.basic_salary),
  allowances:   parseFloat(row.allowances),
  deductions:   parseFloat(row.deductions),
  avatarUrl:    row.avatar_url,
});

// ─── GET /api/employees  (admin only) ────────────────────────
exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, u.name, u.email, u.role
      FROM employees e
      JOIN users u ON u.id = e.user_id
      ORDER BY e.id ASC
    `);
    return res.status(200).json(rows.map(mapEmployee));
  } catch (error) {
    console.error('getAllEmployees error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── GET /api/employees/profile  (own profile, from JWT) ─────
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT e.*, u.name, u.email, u.role
      FROM employees e
      JOIN users u ON u.id = e.user_id
      WHERE e.user_id = ?
    `, [userId]);

    if (rows.length === 0)
      return res.status(404).json({ error: 'Employee profile not found' });

    return res.status(200).json(mapEmployee(rows[0]));
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/employees/profile/:id ──────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const empId = parseInt(req.params.id, 10);
    const { name, department, title, phone, address, supervisor } = req.body;

    // Update employee table fields
    await pool.query(`
      UPDATE employees
      SET department = COALESCE(?, department),
          title      = COALESCE(?, title),
          phone      = COALESCE(?, phone),
          address    = COALESCE(?, address),
          supervisor = COALESCE(?, supervisor)
      WHERE id = ?
    `, [department, title, phone, address, supervisor, empId]);

    // Update name on users table if supplied
    if (name) {
      await pool.query(`
        UPDATE users u
        JOIN employees e ON e.user_id = u.id
        SET u.name = ?
        WHERE e.id = ?
      `, [name, empId]);
    }

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/employees/salary/:id  (admin only) ─────────────
exports.updateSalary = async (req, res) => {
  try {
    const empId = parseInt(req.params.id, 10);
    const { basicSalary, allowances, deductions } = req.body;

    await pool.query(`
      UPDATE employees
      SET basic_salary = COALESCE(?, basic_salary),
          allowances   = COALESCE(?, allowances),
          deductions   = COALESCE(?, deductions)
      WHERE id = ?
    `, [basicSalary, allowances, deductions, empId]);

    return res.status(200).json({ message: 'Salary structure updated' });
  } catch (error) {
    console.error('updateSalary error:', error);
    return res.status(500).json({ error: error.message });
  }
};