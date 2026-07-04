const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');

// Get payslips (admin: all, employee: own)
router.get('/', authMiddleware, payrollController.getPayroll);

// Admin: run payroll cycle for a given month
router.post('/', authMiddleware, payrollController.runPayroll);

module.exports = router;