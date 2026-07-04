import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Guard route for authenticated users.
 */
export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If user is null, wait for initial load or redirect
  // Note: we check if hrms_user key is present to prevent flashes during loading
  const hasUser = user || localStorage.getItem('hrms_user');

  if (!hasUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}