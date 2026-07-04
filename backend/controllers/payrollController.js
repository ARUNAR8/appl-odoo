const pool = require('../config/db');

// ─── Row mapper ──────────────────────────────────────────────
const mapPayslip = (row) => ({
  id:          row.id,
  empId:       row.employee_id,
  month:       row.month,
  basicSalary: parseFloat(row.basic_salary),
  allowances:  parseFloat(row.allowances),
  deductions:  parseFloat(row.deductions),
  netPay:      parseFloat(row.net_pay),
  processedAt: row.processed_at,
  employeeName: row.employee_name || undefined,
});

// ─── GET /api/payroll ────────────────────────────────────────
// Admin → all payslips; Employee → own payslips
exports.getPayroll = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query(`
        SELECT p.*, u.name AS employee_name
        FROM payroll p
        JOIN employees e ON e.id = p.employee_id
        JOIN users u ON u.id = e.user_id
        ORDER BY p.processed_at DESC
      `);
      return res.status(200).json(rows.map(mapPayslip));
    }

    // Employee: own payslips
    const [empRows] = await pool.query(
      'SELECT id FROM employees WHERE user_id = ?', [req.user.id]
    );
    if (empRows.length === 0)
      return res.status(404).json({ error: 'Employee not found' });

    const empId = empRows[0].id;
    const [rows] = await pool.query(
      'SELECT * FROM payroll WHERE employee_id = ? ORDER BY processed_at DESC',
      [empId]
    );
    return res.status(200).json(rows.map(mapPayslip));
  } catch (error) {
    console.error('getPayroll error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ─── POST /api/payroll  (admin: run payroll cycle) ───────────
// Generates one payslip per employee for the given month.
// Skips employees who already have a payslip for that month.
exports.runPayroll = async (req, res) => {
  try {
    const { month } = req.body;
    if (!month)
      return res.status(400).json({ error: 'month is required (e.g. "June 2025")' });

    // Fetch all employees with salary data
    const [employees] = await pool.query(
      'SELECT id, basic_salary, allowances, deductions FROM employees'
    );

    if (employees.length === 0)
      return res.status(400).json({ error: 'No employees found to process payroll for' });

    let processed = 0;
    let skipped = 0;

    for (const emp of employees) {
      // Skip if payslip already generated for this month
      const [existing] = await pool.query(
        'SELECT id FROM payroll WHERE employee_id = ? AND month = ?',
        [emp.id, month]
      );
      if (existing.length > 0) { skipped++; continue; }

      const netPay =
        parseFloat(emp.basic_salary) +
        parseFloat(emp.allowances) -
        parseFloat(emp.deductions);

      await pool.query(
        `INSERT INTO payroll (employee_id, month, basic_salary, allowances, deductions, net_pay)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [emp.id, month, emp.basic_salary, emp.allowances, emp.deductions, netPay]
      );
      processed++;
    }

    return res.status(201).json({
      message: `Payroll processed for ${month}`,
      processed,
      skipped,
    });
  } catch (error) {
    console.error('runPayroll error:', error);
    return res.status(500).json({ error: error.message });
  }
};