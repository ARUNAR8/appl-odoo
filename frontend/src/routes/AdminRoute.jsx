import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Guard route for admin-only pages.
 */
export default function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  const activeUser = user || (localStorage.getItem('hrms_user') ? JSON.parse(localStorage.getItem('hrms_user')) : null);

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (activeUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}