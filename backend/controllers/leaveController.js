const pool = require('../config/db');

// ─── Helper: get employee.id from JWT userId ─────────────────
const getEmpId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
  if (rows.length === 0) throw new Error('Employee profile not found');
  return rows[0].id;
};

// ─── Row mapper ──────────────────────────────────────────────
const mapLeave = (row) => ({
  id:           row.id,
  empId:        row.employee_id,
  type:         row.type,
  dates:        `${row.start_date} → ${row.end_date}`,
  startDate:    row.start_date,
  endDate:      row.end_date,
  duration:     row.duration,
  reason:       row.reason,
  status:       row.status,
  comment:      row.comment,
  name:         row.employee_name || undefined, // admin dashboard accesses req.name
  employeeName: row.employee_name || undefined, // alias
});

// ─── GET /api/leaves ─────────────────────────────────────────
exports.getLeaves = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query(`
        SELECT l.*, u.name AS employee_name
        FROM leaves l
        JOIN employees e ON e.id = l.employee_id
        JOIN users u ON u.id = e.user_id
        ORDER BY l.created_at DESC
      `);
      return res.status(200).json(rows.map(mapLeave));
    }

    const empId = await getEmpId(req.user.id);
    const [rows] = await pool.query(
      'SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC',
      [empId]
    );
    return res.status(200).json(rows.map(mapLeave));
  } catch (error) {
    console.error('getLeaves error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/leaves ────────────────────────────────────────
exports.applyLeave = async (req, res) => {
  try {
    const empId = await getEmpId(req.user.id);
    const { type, startDate, endDate, duration, reason } = req.body;

    if (!type || !startDate || !endDate)
      return res.status(400).json({ error: 'type, startDate, and endDate are required' });

    if (new Date(startDate) > new Date(endDate))
      return res.status(400).json({ error: 'End date must be on or after start date' });

    const days = duration || (
      Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
    );

    const [result] = await pool.query(
      `INSERT INTO leaves (employee_id, type, start_date, end_date, duration, reason)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [empId, type, startDate, endDate, days, reason || null]
    );

    return res.status(201).json({ message: 'Leave request submitted', id: result.insertId });
  } catch (error) {
    console.error('applyLeave error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── PUT /api/leaves/:id  (admin approve / reject) ───────────
exports.updateLeave = async (req, res) => {
  try {
    const leaveId = parseInt(req.params.id, 10);
    const { status, comment } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status))
      return res.status(400).json({ error: 'status must be Approved, Rejected, or Pending' });

    const [result] = await pool.query(
      'UPDATE leaves SET status = ?, comment = ? WHERE id = ?',
      [status, comment || null, leaveId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Leave request not found' });

    return res.status(200).json({ message: `Leave request ${status.toLowerCase()}` });
  } catch (error) {
    console.error('updateLeave error:', error);
    return res.status(500).json({ error: error.message });
  }
};