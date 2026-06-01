// src/Pages/admin/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './auth';

export const isAuthenticated = () => {
  return auth.isAuthenticated();
};

export const logout = () => {
  auth.logout();
};

export const getToken = () => {
  return auth.getToken();
};

export const getCurrentUser = () => {
  return auth.getCurrentUser();
};

function ProtectedRoute({ children }) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;