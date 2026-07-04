import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const sessionUser = localStorage.getItem('hrms_user');
    const sessionToken = localStorage.getItem('hrms_token');
    if (sessionUser && sessionToken) {
      try {
        return JSON.parse(sessionUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  
  // App state mirroring database tables
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all data from database depending on role
  const fetchAppData = useCallback(async (currentUser) => {
    const activeUser = currentUser || user;
    if (!activeUser) return;

    try {
      setIsLoading(true);
      if (activeUser.role === 'admin') {
        // Admin loads all records
        const [empRes, attRes, leaveRes, payRes] = await Promise.all([
          api.get('/employees'),
          api.get('/attendance'),
          api.get('/leaves'),
          api.get('/payroll')
        ]);
        setEmployees(empRes.data);
        setAttendance(attRes.data);
        setLeaves(leaveRes.data);
        setPayroll(payRes.data);
      } else {
        // Employee loads only their specific records
        const [empRes, attRes, leaveRes, payRes] = await Promise.all([
          api.get('/employees/profile'),
          api.get('/attendance'),
          api.get('/leaves'),
          api.get('/payroll')
        ]);
        setEmployees([empRes.data]); // single element array for consistency
        setAttendance(attRes.data);
        setLeaves(leaveRes.data);
        setPayroll(payRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const initialFetchDone = useRef(false);

  // Load initial app data on startup if user is already authenticated
  useEffect(() => {
    if (user && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchAppData(user);
    }
  }, [user, fetchAppData]);

  // Refresh app data whenever Switched employee ID context changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAppData();
    }
  }, [selectedEmployeeId, user, fetchAppData]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data;
      
      localStorage.setItem('hrms_token', token);
      localStorage.setItem('hrms_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      
      // Pull database records immediately
      await fetchAppData(loggedUser);
      return loggedUser;
    } catch (err) {
      const msg = err.response?.data?.error || 'Login API request failed';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user: registeredUser } = res.data;
      
      localStorage.setItem('hrms_token', token);
      localStorage.setItem('hrms_user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      
      await fetchAppData(registeredUser);
      return registeredUser;
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration API request failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedEmployeeId('');
    setEmployees([]);
    setAttendance([]);
    setLeaves([]);
    setPayroll([]);
    initialFetchDone.current = false;
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
  };

  // Clock In / Out check-in trigger
  const clockInOrOut = async (empId) => {
    try {
      await api.post('/attendance', { empId });
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Attendance logging failed');
    }
  };

  // Submit Leave request
  const applyForLeave = async (empId, leaveData) => {
    try {
      await api.post('/leaves', { empId, ...leaveData });
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit leave');
    }
  };

  // Approve / Reject Leave request
  const approveLeave = async (leaveId, status, comment) => {
    try {
      await api.put(`/leaves/${leaveId}`, { status, comment });
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update leave request');
    }
  };

  // Update profile contact details (address, phone, name, department, title, supervisor)
  const updateProfile = async (empId, profileData) => {
    try {
      await api.put(`/employees/profile/${empId}`, profileData);
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update employee profile');
    }
  };

  // Adjust compensation salary parameters
  const updateSalaryStructure = async (empId, basicSalary, allowances, deductions) => {
    try {
      await api.put(`/employees/salary/${empId}`, { basicSalary, allowances, deductions });
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update salary details');
    }
  };

  // Run payroll processed statement cycles
  const runPayrollCycle = async (month) => {
    try {
      await api.post('/payroll', { month });
      await fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to process payroll cycle');
    }
  };

  // Switched employee context helpers (Admin switches profile tabs view context)
  const getActiveEmployeeContextId = () => {
    if (user && user.role === 'admin' && selectedEmployeeId) {
      // selectedEmployeeId is the employees table id (set from dropdown)
      return selectedEmployeeId;
    }
    // For employees, user.empId is the employees table id returned by login
    // For admin without a selected employee, fall back to their own empId
    return user ? (user.empId || user.id) : '';
  };

  const getActiveEmployee = () => {
    const activeId = getActiveEmployeeContextId();
    // Compare as same type — DB ids are numbers, selectedEmployeeId may be string from select
    return employees.find(e => String(e.id) === String(activeId)) || null;
  };

  // Expose relational table data in local format to match page views
  const databaseWrapper = {
    users: [], // users fetched through directory if needed
    employees,
    attendance,
    leaves,
    payroll
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        database: databaseWrapper,
        selectedEmployeeId,
        setSelectedEmployeeId,
        isLoading,
        login,
        register,
        logout,
        clockInOrOut,
        applyForLeave,
        approveLeave,
        updateProfile,
        updateSalaryStructure,
        runPayrollCycle,
        getActiveEmployeeContextId,
        getActiveEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}