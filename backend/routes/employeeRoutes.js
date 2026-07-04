const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, employeeController.getProfile);

module.exports = router;