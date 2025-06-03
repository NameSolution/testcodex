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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white shadow rounded p-4 space-y-2">
              <div className="flex justify-between font-medium">
                <span>Room {r.room}</span>
                <span className="capitalize">{r.type.replace('_',' ')}</span>
              </div>
              {r.message && <p className="text-gray-700 text-sm">{r.message}</p>}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{r.status}</span>
                <div className="space-x-1">
                  {['pending','in_progress','done'].map(s => (
                    <button
                      key={s}
                      className={`px-2 py-1 rounded text-sm ${r.status===s? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => updateStatus(r.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
