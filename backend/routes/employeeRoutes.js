const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get all employees (Admin only)
router.get('/', authMiddleware, adminMiddleware, employeeController.getAllEmployees);

// Get specific profile
router.get('/profile', authMiddleware, employeeController.getProfile);

// Update profile details
router.put('/profile/:id', authMiddleware, employeeController.updateProfile);

// Update salary details (Admin only)
router.put('/salary/:id', authMiddleware, adminMiddleware, employeeController.updateSalary);

module.exports = router;