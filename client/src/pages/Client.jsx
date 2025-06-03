import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io();

export default function Client() {
  const [room, setRoom] = useState('');
  const [type, setType] = useState('room service');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    socket.on('update-request', (req) => {
      setRequests((prev) => prev.map((r) => (r.id === req.id ? req : r)));
    });
  }, []);

  async function submit(e) {
    e.preventDefault();
    const { data } = await axios.post('/api/requests', { room, type, message });
    setRequests([data, ...requests]);
  }

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={submit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <select className="border p-2 w-full" value={type} onChange={(e) => setType(e.target.value)}>
          <option>room service</option>
          <option>cleaning</option>
          <option>maintenance</option>
          <option>taxi</option>
        </select>
        <textarea
          className="border p-2 w-full"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white" type="submit">Send</button>
      </form>
      <ul className="space-y-1">
        {requests.map((r) => (
          <li key={r.id} className="border p-2">
            {r.type} - {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
