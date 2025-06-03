import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden font-outfit bg-gray-50">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex flex-1 flex-col">
        <Header onMenu={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
