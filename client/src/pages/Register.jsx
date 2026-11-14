import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; // 🎯 Naya Import
import api from '../lib/api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/register', formData);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // 🎯 FIX: Alert() hatakar Toast lagaya
      toast.success('Registration Successful!', {
        description: 'Welcome to TantraTalk!'
      });
      
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/60 backdrop-blur-md border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-2">Create Account</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Join TantraTalk to find your solutions</p>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email Address</label>
            <input type="email" name="email" onChange={handleChange} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
            <input type="text" name="phone" onChange={handleChange} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="9876543210" required />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform mt-4 shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-[#FFD700] hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}