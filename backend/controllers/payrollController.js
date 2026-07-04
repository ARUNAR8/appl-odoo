const pool = require('../config/db');

exports.getPayroll = async (req, res) => {
  const { empId } = req.query;

  try {
    let query = 'SELECT * FROM payroll';
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

exports.runPayroll = async (req, res) => {
  const { month } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Check if payroll already processed for this month
    const [existing] = await pool.query('SELECT id FROM payroll WHERE month = ?', [month]);
    if (existing.length > 0) {
      return res.status(400).json({ error: `Payroll cycle for ${month} has already been run` });
    }

    // Get all employees salary structures
    const [employees] = await pool.query('SELECT id, basicSalary, allowances, deductions FROM employees');
    if (employees.length === 0) {
      return res.status(400).json({ error: 'No employee records found to process' });
    }

    const payrollEntries = employees.map(emp => [
      emp.id,
      month,
      emp.basicSalary,
      emp.allowances,
      emp.deductions,
      emp.basicSalary + emp.allowances - emp.deductions,
      'Paid'
    ]);

    await pool.query(
      'INSERT INTO payroll (empId, month, base, allowances, deductions, netPay, status) VALUES ?',
      [payrollEntries]
    );

    res.status(201).json({ message: `Payroll successfully generated for ${month}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};