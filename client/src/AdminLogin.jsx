import React, { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(res => {
      if (res.ok) return res.json();
      throw new Error('invalid');
    }).then(data => {
      localStorage.setItem('adminToken', data.token);
      onLogin(data.token);
    }).catch(() => setError('Wrong password'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow space-y-4 w-80">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <input
          type="password"
          className="border rounded w-full p-2"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white rounded py-2" onClick={submit}>Login</button>
      </div>
    </div>
  );
}
