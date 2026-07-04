const pool = require('../config/db');

exports.getProfile = async (req, res) => {
  const { empId } = req.query;
  const targetId = empId || req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [targetId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address, department, jobTitle, supervisor } = req.body;

  // Security check: only Admin or the employee themselves can edit
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Update employees profile
    const updateFields = [];
    const values = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      values.push(phone);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      values.push(address);
    }
    if (department !== undefined && req.user.role === 'admin') {
      updateFields.push('department = ?');
      values.push(department);
    }
    if (jobTitle !== undefined && req.user.role === 'admin') {
      updateFields.push('jobTitle = ?');
      values.push(jobTitle);
    }
    if (supervisor !== undefined && req.user.role === 'admin') {
      updateFields.push('supervisor = ?');
      values.push(supervisor);
    }

    if (updateFields.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Sync user table name if name was updated
    if (name !== undefined) {
      await connection.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    }

    await connection.commit();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.updateSalary = async (req, res) => {
  const { id } = req.params;
  const { basicSalary, allowances, deductions } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await pool.query(
      'UPDATE employees SET basicSalary = ?, allowances = ?, deductions = ? WHERE id = ?',
      [basicSalary, allowances, deductions, id]
    );
    res.status(200).json({ message: 'Salary structure updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};