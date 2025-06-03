import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Card from './components/Card';
import Button from './components/Button';

const socket = io();

export default function ClientApp() {
  const { room } = useParams();
  const [type, setType] = useState('room_service');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`/api/rooms/${room}/requests`).then(res => res.json()).then(setRequests);
    socket.on('requests', setRequests);
    return () => socket.off('requests');
  }, [room]);

  function submit() {
    fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room, type, message })
    });
    setMessage('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <h1 className="text-2xl font-semibold mb-4">Room {room}</h1>
          <div className="space-y-3">
            <select
              className="border rounded px-3 py-2 w-full"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="room_service">Room Service</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="taxi">Taxi</option>
            </select>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Message"
            />
            <Button className="w-full" onClick={submit}>Send</Button>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold mb-2">Your Requests</h2>
          <ul className="space-y-2">
            {requests.map(r => (
              <li key={r.id} className="flex justify-between border rounded p-2">
                <span className="font-medium capitalize">{r.type.replace('_', ' ')}</span>
                <span className="text-sm text-gray-500">{r.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
