-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hrms;
USE hrms;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(7) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee'
);

-- 2. Employees Details Table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(7) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee',
  department VARCHAR(100) DEFAULT 'General',
  jobTitle VARCHAR(100) DEFAULT 'Staff',
  joinDate DATE NOT NULL,
  supervisor VARCHAR(100) DEFAULT '',
  phone VARCHAR(30) DEFAULT '',
  address VARCHAR(255) DEFAULT '',
  basicSalary INT DEFAULT 3000,
  allowances INT DEFAULT 200,
  deductions INT DEFAULT 400,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Attendance Logs Table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empId VARCHAR(7) NOT NULL,
  date DATE NOT NULL,
  checkIn VARCHAR(20) NOT NULL,
  checkOut VARCHAR(20) DEFAULT '',
  status ENUM('Present', 'Late', 'Absent', 'Half-day', 'Leave') NOT NULL DEFAULT 'Present',
  FOREIGN KEY (empId) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Leaves Applications Table
CREATE TABLE IF NOT EXISTS leaves (
  id VARCHAR(20) PRIMARY KEY,
  empId VARCHAR(7) NOT NULL,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  type ENUM('Annual', 'Sick', 'Personal') NOT NULL DEFAULT 'Annual',
  dates VARCHAR(100) NOT NULL,
  duration VARCHAR(20) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  comment VARCHAR(255) DEFAULT '',
  status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (empId) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Payroll Statement History Table
CREATE TABLE IF NOT EXISTS payroll (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empId VARCHAR(7) NOT NULL,
  month VARCHAR(20) NOT NULL,
  base INT NOT NULL,
  allowances INT NOT NULL,
  deductions INT NOT NULL,
  netPay INT NOT NULL,
  status ENUM('Paid', 'Pending') NOT NULL DEFAULT 'Paid',
  FOREIGN KEY (empId) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Initial Records
-- Password 'admin123' hash: $2a$10$2LIGknsXsrJhkf/MJIR0r.MGvGoJGaffjdrS6/7Zy/w0O0h3Z3dyS
-- Password 'employee123' hash: $2a$10$eLtuFJHBEZIHah6hVejQFecfmi7OdxztLlBqJKyjK.CmpEMBQspVK
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
('AD00001', 'Sarah Connor', 'admin@company.com', '$2a$10$2LIGknsXsrJhkf/MJIR0r.MGvGoJGaffjdrS6/7Zy/w0O0h3Z3dyS', 'admin'),
('EM00089', 'John Doe', 'employee@company.com', '$2a$10$eLtuFJHBEZIHah6hVejQFecfmi7OdxztLlBqJKyjK.CmpEMBQspVK', 'employee');

INSERT IGNORE INTO employees (id, name, email, role, department, jobTitle, joinDate, supervisor, phone, address, basicSalary, allowances, deductions) VALUES
('EM00089', 'John Doe', 'employee@company.com', 'employee', 'Engineering', 'Lead Developer', '2023-01-15', 'Sarah Connor (CTO)', '+1 (555) 019-2834', '123 Cyberpunk Drive, Neo City', 4500, 300, 550),
('AD00001', 'Sarah Connor', 'admin@company.com', 'admin', 'Management', 'Chief Technology Officer', '2022-06-01', 'CEO', '+1 (555) 019-1000', '456 Cyberpunk Drive, Neo City', 8500, 800, 1000);

INSERT IGNORE INTO attendance (empId, date, checkIn, checkOut, status) VALUES
('EM00089', '2026-07-03', '09:02 AM', '05:04 PM', 'Present'),
('EM00089', '2026-07-02', '08:58 AM', '05:00 PM', 'Present'),
('EM00089', '2026-07-01', '09:12 AM', '05:01 PM', 'Late'),
('EM00089', '2026-06-30', '09:00 AM', '05:03 PM', 'Present'),
('AD00001', '2026-07-03', '08:50 AM', '05:30 PM', 'Present'),
('AD00001', '2026-07-02', '08:45 AM', '05:15 PM', 'Present');

INSERT IGNORE INTO leaves (id, empId, name, department, type, dates, duration, reason, comment, status) VALUES
('1', 'EM00089', 'John Doe', 'Engineering', 'Annual', '2026-08-10 to 2026-08-15', '5 Days', 'Family trip', '', 'Approved'),
('2', 'EM00089', 'John Doe', 'Engineering', 'Sick', '2026-07-01 to 2026-07-01', '1 Day', 'Medical appointment', 'Feel better soon', 'Approved'),
('3', 'EM00089', 'John Doe', 'Engineering', 'Personal', '2026-09-02 to 2026-09-04', '3 Days', 'Moving household', '', 'Pending'),
('4', 'AD00001', 'Sarah Connor', 'Management', 'Annual', '2026-07-15 to 2026-07-16', '2 Days', 'Personal rest', '', 'Approved');

INSERT IGNORE INTO payroll (empId, month, base, allowances, deductions, netPay, status) VALUES
('EM00089', 'June 2026', 4500, 300, 550, 4250, 'Paid'),
('EM00089', 'May 2026', 4500, 200, 550, 4150, 'Paid'),
('AD00001', 'June 2026', 8500, 800, 1000, 8300, 'Paid');
