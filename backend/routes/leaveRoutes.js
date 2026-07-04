const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, leaveController.applyLeave);
router.get('/', authMiddleware, leaveController.getLeaves);
router.put('/:id', authMiddleware, adminMiddleware, leaveController.approveLeave);

module.exports = router;