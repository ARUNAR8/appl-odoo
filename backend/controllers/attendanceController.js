const pool = require('../config/db');

exports.logAttendance = async (req, res) => {
  const { empId } = req.body;
  const targetId = empId || req.user.id;

  // Security check: only admin or the user themselves can clock in/out
  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const today = new Date().toISOString().split('T')[0];
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    // Check if log exists for today
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE empId = ? AND date = ?',
      [targetId, today]
    );

    if (rows.length > 0) {
      const log = rows[0];
      if (log.checkOut && log.checkOut !== '') {
        return res.status(400).json({ error: 'Already clocked out for today' });
      }
      // Clock Out
      await pool.query(
        'UPDATE attendance SET checkOut = ? WHERE id = ?',
        [timeNow, log.id]
      );
      res.status(200).json({ message: 'Clock out recorded successfully', checkOut: timeNow });
    } else {
      // Clock In
      const checkInHour = new Date().getHours();
      const checkInMin = new Date().getMinutes();
      const status = (checkInHour < 9 || (checkInHour === 9 && checkInMin <= 5)) ? 'Present' : 'Late';

      await pool.query(
        'INSERT INTO attendance (empId, date, checkIn, checkOut, status) VALUES (?, ?, ?, ?, ?)',
        [targetId, today, timeNow, '', status]
      );
      res.status(200).json({ message: 'Clock in recorded successfully', checkIn: timeNow, status });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  const { empId } = req.query;

  try {
    let query = 'SELECT * FROM attendance';
    const params = [];

    if (req.user.role !== 'admin') {
      // Employees only view their own logs
      query += ' WHERE empId = ?';
      params.push(req.user.id);
    } else if (empId) {
      // Admin filters by employee
      query += ' WHERE empId = ?';
      params.push(empId);
    }

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};