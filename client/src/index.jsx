import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ClientApp from './ClientApp';
import AdminApp from './AdminApp';
import InfoPanel from './InfoPanel';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/client" element={<ClientApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/info" element={<InfoPanel />} />
      <Route path="/" element={<Navigate to="/client" replace />} />
    </Routes>
  </Router>
);
