import React, { useState } from 'react';
import Card from './components/Card';
import Input from './components/Input';
import Button from './components/Button';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit() {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      })
      .catch(() => setError('Wrong password'));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-80 space-y-4 text-center">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button className="w-full" onClick={submit}>
          Login
        </Button>
      </Card>
    </div>
  );
}
