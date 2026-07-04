const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, payrollController.getPayroll);
router.post('/', authMiddleware, adminMiddleware, payrollController.runPayroll);

module.exports = router;