'use client';

import { useRouter } from 'next/navigation';
import { login } from '../lib/auth';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(form)) {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin');
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 mt-20 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>
      <input name="username" onChange={handleChange} placeholder="Username" className="block mb-2 p-2 border w-full" />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" className="block mb-4 p-2 border w-full" />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="bg-black text-white px-4 py-2">Login</button>
    </form>
  );
}
