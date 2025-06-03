import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ClientApp from './ClientApp';
import AdminApp from './AdminApp';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/client" element={<ClientApp />} />
      <Route path="/admin" element={<AdminApp />} />
    </Routes>
  </Router>
);
