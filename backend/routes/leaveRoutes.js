const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

// Get leave records (admin: all, employee: own)
router.get('/', authMiddleware, leaveController.getLeaves);

// Submit a new leave request
router.post('/', authMiddleware, leaveController.applyLeave);

// Admin: approve or reject a leave request
router.put('/:id', authMiddleware, leaveController.updateLeave);

module.exports = router;