const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, attendanceController.logAttendance);
router.get('/', authMiddleware, attendanceController.getAttendance);

module.exports = router;