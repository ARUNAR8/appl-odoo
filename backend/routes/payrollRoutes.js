const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, payrollController.getPayroll);

module.exports = router;