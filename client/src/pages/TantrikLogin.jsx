import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function TantrikLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/users/tantrik-login', { email, password });
      
      localStorage.setItem('tantrikToken', data.token);
      localStorage.setItem('tantrikInfo', JSON.stringify(data));
      
      navigate('/tantrik-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden flex flex-col items-center">
      <div className="pt-20 px-4 w-full max-w-md relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-900/20 rounded-full blur-[100px] -z-10"></div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] border border-red-900/30 p-8 rounded-2xl w-full shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-2">Tantrik Login</h2>
          <p className="text-gray-400 text-center text-sm mb-6">Log in to your Dashboard and start earning.</p>
          
          {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm border border-red-500">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-[#FFD700] outline-none" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white focus:border-[#FFD700] outline-none" required />
            <button type="submit" className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)]">Login</button>
          </form>
        </motion.div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 w-full max-w-5xl mx-auto px-4 mt-16">
        <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-12">Why Join as a Tantrik on TantraTalk?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '💰', title: 'Highest Earnings', desc: 'Earn 70% of every consultation. Withdraw your money easily to your bank account.' },
            { icon: '📱', title: 'Work From Home', desc: 'Consult with clients via chat or call from the comfort of your home, 24/7.' },
            { icon: '🔒', title: '100% Privacy', desc: 'Your phone number and personal details are never shared with the users.' }
          ].map((item, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30 text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20 w-full max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Tantrik FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "How do I get clients?", a: "Once you log in and toggle your status to 'Online', your profile will be visible to users looking for consultations." },
            { q: "When can I withdraw my earnings?", a: "You can request a withdrawal anytime once your wallet balance reaches ₹10. The amount is usually processed within 24-48 hours." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-lg font-bold text-[#FFD700] mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}