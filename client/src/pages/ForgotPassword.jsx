import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/forgot-password', { email });
      toast.success(data.message || 'OTP sent successfully!');
      // OTP bhejne ke baad user ko Reset page par bhej dein aur email pass kar dein
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-md border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-2">Forgot Password</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Enter your email to receive an OTP</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="you@example.com" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Remember your password? <Link to="/login" className="text-[#FFD700] hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}