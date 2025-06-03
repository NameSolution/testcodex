import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function ClientApp() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room') || '001';
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
    <div className="p-4">
      <h1 className="text-2xl mb-4">Service Request - Room {room}</h1>
      <select className="border p-2" value={type} onChange={e => setType(e.target.value)}>
        <option value="room_service">Room Service</option>
        <option value="cleaning">Cleaning</option>
        <option value="maintenance">Maintenance</option>
        <option value="taxi">Taxi</option>
      </select>
      <textarea className="border p-2 w-full mt-2" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
      <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={submit}>Send</button>
      <h2 className="text-xl mt-4">Your Requests</h2>
      <ul>
        {requests.map(r => (
          <li key={r.id} className="border-b py-1 flex justify-between">
            <span>{r.type}</span>
            <span>{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
