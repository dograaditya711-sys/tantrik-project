import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('Login Successful!', {
        description: `Welcome back, ${data.name}!`
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/60 backdrop-blur-md border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Login to consult with our top Tantriks</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            {/* 🎯 Yahan Forgot Password Link add kiya gaya hai */}
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-400 text-sm">Password</label>
              <Link to="/forgot-password" className="text-sm text-[#FFD700] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account? <Link to="/register" className="text-[#FFD700] hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}