const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, leaveController.applyLeave);

module.exports = router;