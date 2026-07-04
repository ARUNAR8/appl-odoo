const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Get attendance records (admin: all, employee: own)
router.get('/', authMiddleware, attendanceController.getAttendance);

// Clock in / clock out toggle
router.post('/', authMiddleware, attendanceController.logAttendance);

module.exports = router;