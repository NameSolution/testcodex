import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io();

export default function Admin() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    load();
    socket.on('new-request', (req) => setRequests((prev) => [req, ...prev]));
    socket.on('update-request', (req) => {
      setRequests((prev) => prev.map((r) => (r.id === req.id ? req : r)));
    });
  }, []);

  async function load() {
    const { data } = await axios.get('/api/requests');
    setRequests(data);
  }

  async function update(id, status) {
    await axios.put(`/api/requests/${id}`, { status });
  }

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-semibold">Requests</h2>
      <ul className="space-y-1">
        {requests.map((r) => (
          <li key={r.id} className="border p-2 flex justify-between items-center">
            <span>
              #{r.room} {r.type} - {r.status}
            </span>
            <div className="space-x-1">
              {r.status !== 'in_progress' && (
                <button className="px-2 py-1 bg-yellow-500 text-white" onClick={() => update(r.id, 'in_progress')}>
                  In Progress
                </button>
              )}
              {r.status !== 'resolved' && (
                <button className="px-2 py-1 bg-green-600 text-white" onClick={() => update(r.id, 'resolved')}>
                  Resolve
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
