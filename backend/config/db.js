const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hrms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const jsonDbPath = path.resolve(__dirname, '../../database/db.json');

const seedData = {
  users: [
    { id: 'AD00001', name: 'Sarah Connor', email: 'admin@company.com', password: '$2a$10$2LIGknsXsrJhkf/MJIR0r.MGvGoJGaffjdrS6/7Zy/w0O0h3Z3dyS', role: 'admin' },
    { id: 'EM00089', name: 'John Doe', email: 'employee@company.com', password: '$2a$10$eLtuFJHBEZIHah6hVejQFecfmi7OdxztLlBqJKyjK.CmpEMBQspVK', role: 'employee' }
  ],
  employees: [
    { id: 'EM00089', name: 'John Doe', email: 'employee@company.com', role: 'employee', department: 'Engineering', jobTitle: 'Lead Developer', joinDate: '2023-01-15', supervisor: 'Sarah Connor (CTO)', phone: '+1 (555) 019-2834', address: '123 Cyberpunk Drive, Neo City', basicSalary: 4500, allowances: 300, deductions: 550 },
    { id: 'AD00001', name: 'Sarah Connor', email: 'admin@company.com', role: 'admin', department: 'Management', jobTitle: 'Chief Technology Officer', joinDate: '2022-06-01', supervisor: 'CEO', phone: '+1 (555) 019-1000', address: '456 Cyberpunk Drive, Neo City', basicSalary: 8500, allowances: 800, deductions: 1000 }
  ],
  attendance: [
    { id: 1, empId: 'EM00089', date: '2026-07-03', checkIn: '09:02 AM', checkOut: '05:04 PM', status: 'Present' },
    { id: 2, empId: 'EM00089', date: '2026-07-02', checkIn: '08:58 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 3, empId: 'EM00089', date: '2026-07-01', checkIn: '09:12 AM', checkOut: '05:01 PM', status: 'Late' },
    { id: 4, empId: 'EM00089', date: '2026-06-30', checkIn: '09:00 AM', checkOut: '05:03 PM', status: 'Present' },
    { id: 5, empId: 'AD00001', date: '2026-07-03', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'Present' },
    { id: 6, empId: 'AD00001', date: '2026-07-02', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'Present' }
  ],
  leaves: [
    { id: '1', empId: 'EM00089', name: 'John Doe', department: 'Engineering', type: 'Annual', dates: '2026-08-10 to 2026-08-15', duration: '5 Days', reason: 'Family trip', comment: '', status: 'Approved' },
    { id: '2', empId: 'EM00089', name: 'John Doe', department: 'Engineering', type: 'Sick', dates: '2026-07-01 to 2026-07-01', duration: '1 Day', reason: 'Medical appointment', comment: 'Feel better soon', status: 'Approved' },
    { id: '3', empId: 'EM00089', name: 'John Doe', department: 'Engineering', type: 'Personal', dates: '2026-09-02 to 2026-09-04', duration: '3 Days', reason: 'Moving household', comment: '', status: 'Pending' },
    { id: '4', empId: 'AD00001', name: 'Sarah Connor', department: 'Management', type: 'Annual', dates: '2026-07-15 to 2026-07-16', duration: '2 Days', reason: 'Personal rest', comment: '', status: 'Approved' }
  ],
  payroll: [
    { id: 1, empId: 'EM00089', month: 'June 2026', base: 4500, allowances: 300, deductions: 550, netPay: 4250, status: 'Paid' },
    { id: 2, empId: 'EM00089', month: 'May 2026', base: 4500, allowances: 200, deductions: 550, netPay: 4150, status: 'Paid' },
    { id: 3, empId: 'AD00001', month: 'June 2026', base: 8500, allowances: 800, deductions: 1000, netPay: 8300, status: 'Paid' }
  ]
};

function readJson() {
  const dir = path.dirname(jsonDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(jsonDbPath)) {
    fs.writeFileSync(jsonDbPath, JSON.stringify(seedData, null, 2), 'utf8');
    return seedData;
  }
  try {
    return JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
  } catch (e) {
    return seedData;
  }
}

function writeJson(data) {
  fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf8');
}

let useJsonDb = false;

// Check MySQL connection status on startup
pool.query('SELECT 1')
  .then(() => {
    console.log('[HRMS Database] Connected to live MySQL server on port 3306.');
  })
  .catch((err) => {
    useJsonDb = true;
    console.warn('[HRMS Database] MySQL connection failed. Falling back to local file database (database/db.json).');
  });

async function executeJsonQuery(sql, params = []) {
  const db = readJson();
  const sqlNormalized = sql.replace(/\s+/g, ' ').trim();

  if (sqlNormalized.startsWith('SELECT id, email FROM users WHERE id = ? OR email = ?')) {
    const id = params[0];
    const email = params[1];
    return [db.users.filter(u => u.id === id || u.email === email)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM users WHERE email = ?')) {
    const email = params[0];
    return [db.users.filter(u => u.email === email)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM employees WHERE id = ?')) {
    const id = params[0];
    return [db.employees.filter(e => e.id === id)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM employees')) {
    return [db.employees];
  }

  if (sqlNormalized.startsWith('SELECT * FROM attendance WHERE empId = ? AND date = ?')) {
    const empId = params[0];
    const date = params[1];
    return [db.attendance.filter(a => a.empId === empId && a.date === date)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM attendance WHERE empId = ?')) {
    const empId = params[0];
    return [db.attendance.filter(a => a.empId === empId)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM attendance')) {
    return [db.attendance];
  }

  if (sqlNormalized.startsWith('SELECT * FROM leaves WHERE empId = ?')) {
    const empId = params[0];
    return [db.leaves.filter(l => l.empId === empId)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM leaves')) {
    return [db.leaves];
  }

  if (sqlNormalized.startsWith('SELECT * FROM payroll WHERE empId = ?')) {
    const empId = params[0];
    return [db.payroll.filter(p => p.empId === empId)];
  }

  if (sqlNormalized.startsWith('SELECT * FROM payroll')) {
    return [db.payroll];
  }

  if (sqlNormalized.startsWith('SELECT id FROM payroll WHERE month = ?')) {
    const month = params[0];
    return [db.payroll.filter(p => p.month === month).map(p => ({ id: p.id }))];
  }

  if (sqlNormalized.startsWith('INSERT INTO users')) {
    const newUser = {
      id: params[0],
      name: params[1],
      email: params[2],
      password: params[3],
      role: params[4]
    };
    db.users.push(newUser);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('INSERT INTO employees')) {
    const newEmp = {
      id: params[0],
      name: params[1],
      email: params[2],
      role: params[3],
      department: params[4],
      jobTitle: params[5],
      joinDate: params[6],
      supervisor: params[7],
      phone: params[8],
      address: params[9],
      basicSalary: Number(params[10]),
      allowances: Number(params[11]),
      deductions: Number(params[12])
    };
    db.employees.push(newEmp);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('INSERT INTO attendance')) {
    const newLog = {
      id: db.attendance.length + 1,
      empId: params[0],
      date: params[1],
      checkIn: params[2],
      checkOut: params[3],
      status: params[4]
    };
    db.attendance.push(newLog);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('INSERT INTO leaves')) {
    const newLeave = {
      id: params[0],
      empId: params[1],
      name: params[2],
      department: params[3],
      type: params[4],
      dates: params[5],
      duration: params[6],
      reason: params[7],
      comment: params[8],
      status: params[9]
    };
    db.leaves.push(newLeave);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('UPDATE attendance SET checkOut = ? WHERE id = ?')) {
    const checkOut = params[0];
    const id = params[1];
    db.attendance = db.attendance.map(a => a.id === Number(id) ? { ...a, checkOut } : a);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('UPDATE leaves SET status = ?, comment = ? WHERE id = ?')) {
    const status = params[0];
    const comment = params[1];
    const id = params[2];
    db.leaves = db.leaves.map(l => l.id === id ? { ...l, status, comment } : l);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('UPDATE users SET name = ? WHERE id = ?')) {
    const name = params[0];
    const id = params[1];
    db.users = db.users.map(u => u.id === id ? { ...u, name } : u);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('UPDATE employees SET basicSalary = ?, allowances = ?, deductions = ? WHERE id = ?')) {
    const basicSalary = Number(params[0]);
    const allowances = Number(params[1]);
    const deductions = Number(params[2]);
    const id = params[3];
    db.employees = db.employees.map(e => e.id === id ? { ...e, basicSalary, allowances, deductions } : e);
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('UPDATE employees SET')) {
    const id = params[params.length - 1];
    const updatePart = sqlNormalized.split('SET')[1].split('WHERE')[0];
    const fields = updatePart.split(',').map(f => f.trim().split('=')[0].trim());
    
    db.employees = db.employees.map(e => {
      if (e.id === id) {
        const updated = { ...e };
        fields.forEach((field, idx) => {
          updated[field] = params[idx];
        });
        return updated;
      }
      return e;
    });
    writeJson(db);
    return [{ affectedRows: 1 }];
  }

  if (sqlNormalized.startsWith('INSERT INTO payroll')) {
    const entries = params[0];
    entries.forEach(entry => {
      db.payroll.push({
        id: db.payroll.length + 1,
        empId: entry[0],
        month: entry[1],
        base: Number(entry[2]),
        allowances: Number(entry[3]),
        deductions: Number(entry[4]),
        netPay: Number(entry[5]),
        status: entry[6]
      });
    });
    writeJson(db);
    return [{ affectedRows: entries.length }];
  }

  console.warn('Unhandled simulated SQL query:', sqlNormalized);
  return [[]];
}

// Wrapper DB interface
const dbInterface = {
  query: async (sql, params) => {
    if (useJsonDb) {
      return executeJsonQuery(sql, params);
    }
    try {
      return await pool.query(sql, params);
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        useJsonDb = true;
        console.warn('[HRMS Database] MySQL connection lost. Falling back to local file database.');
        return executeJsonQuery(sql, params);
      }
      throw err;
    }
  },
  getConnection: async () => {
    if (useJsonDb) {
      // Mock Connection interface for transaction support
      return {
        query: async (sql, params) => executeJsonQuery(sql, params),
        beginTransaction: async () => {},
        commit: async () => {},
        rollback: async () => {},
        release: () => {}
      };
    }
    try {
      return await pool.getConnection();
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        useJsonDb = true;
        console.warn('[HRMS Database] MySQL connection failed on transaction start. Falling back to local file database.');
        return {
          query: async (sql, params) => executeJsonQuery(sql, params),
          beginTransaction: async () => {},
          commit: async () => {},
          rollback: async () => {},
          release: () => {}
        };
      }
      throw err;
    }
  }
};

module.exports = dbInterface;