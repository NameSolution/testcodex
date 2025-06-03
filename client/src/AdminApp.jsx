import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io();

export default function AdminApp() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/requests').then(res => res.json()).then(setRequests);
    socket.on('requests', setRequests);
    return () => socket.off('requests');
  }, []);

  function updateStatus(id, status) {
    fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Room</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Message</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-2">{r.room}</td>
              <td className="px-4 py-2">{r.type}</td>
              <td className="px-4 py-2">{r.message}</td>
              <td className="px-4 py-2">{r.status}</td>
              <td className="px-4 py-2 space-x-1">
                {['pending','in_progress','done'].map(s => (
                  <button key={s} className="px-2 py-1 bg-gray-200" onClick={() => updateStatus(r.id, s)}>{s}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
