import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Card from './components/Card';
import Button from './components/Button';

const socket = io();

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetch('/api/requests', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setRequests);
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
    let current = [];
    socket.on('requests', data => {
      if (current.length && data.length > current.length) audio.play();
      current = data;
      setRequests(data);
    });
    return () => socket.off('requests');
  }, []);

  function updateStatus(id, status) {
    fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Requests</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map(r => (
          <Card key={r.id} className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Room {r.room}</span>
              <span className="capitalize">{r.type.replace('_', ' ')}</span>
            </div>
            {r.message && <p className="text-gray-700 text-sm">{r.message}</p>}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{r.status}</span>
              <div className="space-x-1">
                {['pending', 'in_progress', 'done'].map(s => (
                  <Button
                    key={s}
                    className={`px-2 py-1 text-sm ${r.status === s ? '' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                    onClick={() => updateStatus(r.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
