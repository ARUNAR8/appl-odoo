-- ============================================================
-- HRMS Database Schema
-- Engine: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS hrms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hrms;

-- ============================================================
-- 1. USERS  (authentication + role)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(180)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  role            ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  email_verified  TINYINT(1)    NOT NULL DEFAULT 0,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. EMPLOYEES  (profile + salary structure)
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT           NOT NULL UNIQUE,
  department      VARCHAR(100)  NOT NULL DEFAULT 'General',
  title           VARCHAR(120)  NOT NULL DEFAULT 'Staff',
  phone           VARCHAR(30)   DEFAULT NULL,
  address         VARCHAR(255)  DEFAULT NULL,
  supervisor      VARCHAR(120)  DEFAULT NULL,
  join_date       DATE          DEFAULT NULL,
  basic_salary    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  allowances      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  deductions      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  avatar_url      VARCHAR(255)  DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. ATTENDANCE  (clock-in / clock-out per day)
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  employee_id     INT           NOT NULL,
  date            DATE          NOT NULL,
  check_in        TIME          DEFAULT NULL,
  check_out       TIME          DEFAULT NULL,
  status          ENUM('Present', 'Late', 'Absent') NOT NULL DEFAULT 'Present',
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_att_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_emp_date (employee_id, date)
);

-- ============================================================
-- 4. LEAVES  (leave requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS leaves (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  employee_id     INT           NOT NULL,
  type            ENUM('Annual', 'Sick', 'Personal') NOT NULL DEFAULT 'Annual',
  start_date      DATE          NOT NULL,
  end_date        DATE          NOT NULL,
  duration        INT           NOT NULL DEFAULT 1,   -- calendar days
  reason          TEXT          DEFAULT NULL,
  status          ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  comment         VARCHAR(255)  DEFAULT NULL,          -- manager comment on approve/reject
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_leave_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. PAYROLL  (processed payslips)
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  employee_id     INT           NOT NULL,
  month           VARCHAR(20)   NOT NULL,   -- e.g. "June 2025"
  basic_salary    DECIMAL(12,2) NOT NULL,
  allowances      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  deductions      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  net_pay         DECIMAL(12,2) NOT NULL,
  processed_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_emp_month (employee_id, month)
);

-- ============================================================
-- INDEXES for common query patterns
-- ============================================================
CREATE INDEX idx_att_employee ON attendance(employee_id);
CREATE INDEX idx_att_date     ON attendance(date);
CREATE INDEX idx_leave_emp    ON leaves(employee_id);
CREATE INDEX idx_leave_status ON leaves(status);
CREATE INDEX idx_pay_emp      ON payroll(employee_id);
