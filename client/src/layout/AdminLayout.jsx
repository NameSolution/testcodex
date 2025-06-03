import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 font-outfit">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <main className="p-4 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
