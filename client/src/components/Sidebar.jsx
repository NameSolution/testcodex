import React from 'react';

export default function Sidebar() {
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="#">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </a>
      <hr className="sidebar-divider my-0" />
      <li className="nav-item active">
        <a className="nav-link" href="#">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
      </li>
    </ul>
  );
}
