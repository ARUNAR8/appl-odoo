import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Components & Layout
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import logo from '../assets/logo/logo.png';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeAttendance from '../pages/employee/Attendance';
import EmployeeLeave from '../pages/employee/Leave';
import EmployeePayroll from '../pages/employee/Payroll';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminEmployees from '../pages/admin/Employees';
import AdminAttendance from '../pages/admin/Attendance';
import AdminLeaveApproval from '../pages/admin/LeaveApproval';
import AdminPayroll from '../pages/admin/Payroll';
import Error404 from '../pages/Error404';

// Layout wrapper for authenticated pages
function DashboardLayout({ children }) {
  const { user, logout, getActiveEmployee } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dark/Light Theme mode state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // If loading or no user, skip layout
  if (!user) return children;

  const employeeMenuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    {
      name: 'Attendance',
      path: '/attendance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Leaves',
      path: '/leave',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
    {
      name: 'Salary Slip',
      path: '/payroll',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5zm1.5 3h13.5m-13.5 3h13.5m-13.5 3h13.5" />
        </svg>
      )
    }
  ];

  const adminMenuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      )
    },
    {
      name: 'Employees',
      path: '/admin/employees',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.243 0-4.32-.647-6.079-1.757m11.145-2.138a3.07 3.07 0 00-4.68-2.724m3.07 3.197H3.375c-.621 0-1.125-.504-1.125-1.125v-1.14a4.125 4.125 0 018.16-1.443m.007-.008a3 3 0 11-4.004-4.004m0 0a3 3 0 013.996 3.996z" />
        </svg>
      )
    },
    {
      name: 'Attendance Tracker',
      path: '/admin/attendance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Leave Approvals',
      path: '/admin/leaves',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      )
    },
    {
      name: 'Payroll Control',
      path: '/admin/payroll',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.958-.59-1.04-.75-1.04-1.97 0-2.72.933-.673 2.45-.673 3.384 0l.474.341" />
        </svg>
      )
    }
  ];

  const menuItems = user.role === 'admin' ? adminMenuItems : employeeMenuItems;

  // Determine current page title
  const getPageTitle = () => {
    const matchedItem = [...employeeMenuItems, ...adminMenuItems].find(item => item.path === location.pathname);
    let title = matchedItem ? matchedItem.name : 'HR Portal';
    
    // Show switched context alert for Admin
    const activeEmp = getActiveEmployee();
    if (user.role === 'admin' && activeEmp && activeEmp.id !== user.id) {
      title += ` (Viewing: ${activeEmp.name})`;
    }
    return title;
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        logoSrc={logo}
        logoText="Odoo HRMS"
        menuItems={menuItems}
        activePath={location.pathname}
        onItemClick={(path) => navigate(path)}
        user={getActiveEmployee() || { name: user.name, role: user.role }}
        onLogout={handleLogoutClick}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          title={getPageTitle()}
          notificationsCount={user.role === 'admin' ? 3 : 1}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNotificationsClick={() => alert('Notifications: All systems operational.')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// Redirect helpers
function DefaultDashboardRedirect() {
  const { user } = useContext(AuthContext);
  const activeUser = user || (localStorage.getItem('hrms_user') ? JSON.parse(localStorage.getItem('hrms_user')) : null);
  if (!activeUser) return <Navigate to="/login" replace />;
  return activeUser.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <EmployeeDashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <EmployeeProfile />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <EmployeeAttendance />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <EmployeeLeave />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <EmployeePayroll />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Admin Specific Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminEmployees />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminAttendance />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminLeaveApproval />
            </DashboardLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payroll"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminPayroll />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      {/* Fallback route redirection */}
      <Route path="/" element={<DefaultDashboardRedirect />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}