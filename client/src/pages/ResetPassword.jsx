import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ForgotPassword page se email utha rahe hain
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/reset-password', { email, otp, newPassword });
      toast.success(data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-black/60 backdrop-blur-md border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-2">Reset Password</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Enter the OTP sent to your email and new password</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="you@example.com" required />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">OTP (6 digits)</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors tracking-widest text-center text-lg" placeholder="123456" required />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#110505] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="••••••••" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Back to <Link to="/login" className="text-[#FFD700] hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}