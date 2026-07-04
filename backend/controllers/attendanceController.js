const pool = require('../config/db');

// ─── Helper: get employee.id from JWT userId ─────────────────
const getEmpId = async (userId) => {
  const [rows] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
  if (rows.length === 0) throw new Error('Employee profile not found for this user');
  return rows[0].id;
};

// ─── Row mapper ──────────────────────────────────────────────
const mapLog = (row) => ({
  id:         row.id,
  empId:      row.employee_id,
  date:       row.date,
  checkIn:    row.check_in,
  checkOut:   row.check_out,
  status:     row.status,
});

// ─── GET /api/attendance ─────────────────────────────────────
// Admin → all records joined with employee name
// Employee → own records only
exports.getAttendance = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query(`
        SELECT a.*, u.name AS employee_name
        FROM attendance a
        JOIN employees e ON e.id = a.employee_id
        JOIN users u ON u.id = e.user_id
        ORDER BY a.date DESC, a.employee_id ASC
      `);
      return res.status(200).json(rows.map((r) => ({
        ...mapLog(r),
        employeeName: r.employee_name,
      })));
    }

    // Employee: own records
    const empId = await getEmpId(req.user.id);
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC',
      [empId]
    );
    return res.status(200).json(rows.map(mapLog));
  } catch (error) {
    console.error('getAttendance error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/attendance  (Clock In / Out toggle) ───────────
exports.logAttendance = async (req, res) => {
  try {
    const empId = await getEmpId(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS

    // Check if there is already a record for today
    const [existing] = await pool.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
      [empId, today]
    );

    if (existing.length === 0) {
      // CLOCK IN — determine status (Late if after 09:30)
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      const isLate = hour > 9 || (hour === 9 && minute > 30);
      const status = isLate ? 'Late' : 'Present';

      await pool.query(
        'INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)',
        [empId, today, nowTime, status]
      );
      return res.status(201).json({ message: 'Clocked in successfully', action: 'clock_in' });
    }

    const record = existing[0];
    if (!record.check_out) {
      // CLOCK OUT
      await pool.query(
        'UPDATE attendance SET check_out = ? WHERE id = ?',
        [nowTime, record.id]
      );
      return res.status(200).json({ message: 'Clocked out successfully', action: 'clock_out' });
    }

    return res.status(400).json({ error: 'Already clocked in and out for today' });
  } catch (error) {
    console.error('logAttendance error:', error);
    return res.status(500).json({ error: error.message });
  }
};