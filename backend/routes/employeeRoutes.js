const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin: get all employees
router.get('/', authMiddleware, employeeController.getAllEmployees);

// Employee: get own profile
router.get('/profile', authMiddleware, employeeController.getProfile);

// Update contact/profile fields for an employee
router.put('/profile/:id', authMiddleware, employeeController.updateProfile);

// Admin: update salary structure for an employee
router.put('/salary/:id', authMiddleware, employeeController.updateSalary);

module.exports = router;