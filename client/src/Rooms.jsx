import React, { useEffect, useState } from 'react';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [number, setNumber] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadRooms();
  }, []);

  function loadRooms() {
    fetch('/api/rooms', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setRooms);
  }

  function addRoom() {
    if (!number) return;
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ number })
    })
      .then(res => res.json())
      .then(() => {
        setNumber('');
        loadRooms();
      });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Rooms</h1>
      <div className="bg-white p-4 shadow rounded flex space-x-2">
        <input
          className="border flex-1 p-2 rounded"
          placeholder="Room number"
          value={number}
          onChange={e => setNumber(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded" onClick={addRoom}>Add</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rooms.map(r => (
          <div key={r.id} className="bg-white shadow rounded p-4 space-y-2">
            <p className="font-medium">Room {r.number}</p>
            {r.qr && <img src={r.qr} alt="qr" className="w-32" />}
          </div>
        ))}
      </div>
    </div>
  );
}
