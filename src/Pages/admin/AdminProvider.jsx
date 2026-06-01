// src/Pages/admin/AdminProvider.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    const token = localStorage.getItem('adminToken');
    if (adminData && token) {
      setAdmin(JSON.parse(adminData));
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const adminLogin = (data) => {
    localStorage.setItem('admin', JSON.stringify(data.user));
    localStorage.setItem('adminToken', data.token);
    setAdmin(data.user);
    setIsAdmin(true);
  };

  const adminLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ admin, isAdmin, loading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}