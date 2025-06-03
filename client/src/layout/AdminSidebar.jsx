import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { path: 'requests', label: 'Requests' },
  { path: 'rooms', label: 'Rooms' },
];

export default function AdminSidebar({ onToggle }) {
  const location = useLocation();
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen hidden md:block">
      <div className="p-4 text-2xl font-semibold">Hotel Admin</div>
      <nav className="mt-4 space-y-1">
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`block px-4 py-2 hover:bg-gray-700 ${location.pathname.includes(l.path) ? 'bg-gray-800' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
