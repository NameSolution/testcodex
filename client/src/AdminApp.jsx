import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import Requests from './Requests';
import Rooms from './Rooms';
import AdminLogin from './AdminLogin';

function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-48 bg-gray-800 text-white p-4 space-y-2">
        <Link className="block hover:bg-gray-700 rounded px-2 py-1" to="requests">Requests</Link>
        <Link className="block hover:bg-gray-700 rounded px-2 py-1" to="rooms">Rooms</Link>
      </nav>
      <main className="flex-1 p-6 space-y-4">
        <Outlet />
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  if (!token) return <AdminLogin onLogin={setToken} />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="requests" element={<Requests />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="*" element={<Navigate to="requests" replace />} />
      </Route>
    </Routes>
  );
}
