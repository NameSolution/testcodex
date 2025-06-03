import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div id="wrapper">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
