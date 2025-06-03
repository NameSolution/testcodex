import React from 'react';

export default function AdminHeader() {
  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between md:ml-64">
      <button className="md:hidden" aria-label="Open menu">
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <h1 className="text-xl font-semibold">Dashboard</h1>
    </header>
  );
}
