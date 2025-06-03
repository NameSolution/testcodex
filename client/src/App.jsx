import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Client from './pages/Client';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route
          path="/admin"
          element={(
            <AppLayout>
              <Admin />
            </AppLayout>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
