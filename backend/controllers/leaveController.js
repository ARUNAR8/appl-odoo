const pool = require('../config/db');

exports.applyLeave = async (req, res) => {
  const { empId, type, startDate, endDate, duration, reason } = req.body;
  const targetId = empId || req.user.id;

  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Get employee details to cache name/department
    const [empRows] = await pool.query('SELECT name, department FROM employees WHERE id = ?', [targetId]);
    if (empRows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const { name, department } = empRows[0];
    const leaveId = Math.random().toString(36).substr(2, 9);
    const dates = `${startDate} to ${endDate}`;
    const durationStr = `${duration}`;

    await pool.query(
      'INSERT INTO leaves (id, empId, name, department, type, dates, duration, reason, comment, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [leaveId, targetId, name, department, type, dates, durationStr, reason, '', 'Pending']
    );

    res.status(201).json({ message: 'Leave application submitted successfully', leaveId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeaves = async (req, res) => {
  const { empId } = req.query;

  try {
    let query = 'SELECT * FROM leaves';
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE empId = ?';
      params.push(req.user.id);
    } else if (empId) {
      query += ' WHERE empId = ?';
      params.push(empId);
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveLeave = async (req, res) => {
  const { id } = req.params; // leave ID
  const { status, comment } = req.body; // 'Approved' / 'Rejected'

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await pool.query(
      'UPDATE leaves SET status = ?, comment = ? WHERE id = ?',
      [status, comment || '', id]
    );
    res.status(200).json({ message: `Leave request has been ${status.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};