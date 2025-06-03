import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Requests from './Requests';
import Rooms from './Rooms';
import AdminLogin from './AdminLogin';
import AdminLayout from './layout/AdminLayout';

export default function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  if (!token) return <AdminLogin onLogin={setToken} />;

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="requests" element={<Requests />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="*" element={<Navigate to="requests" replace />} />
      </Route>
    </Routes>
  );
}
