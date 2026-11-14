import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Compatibility() {
  const [formData, setFormData] = useState({ yourName: '', partnerName: '', yourDob: '', partnerDob: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!formData.yourName || !formData.partnerName || !formData.yourDob || !formData.partnerDob) {
      return toast.error("Please fill all the details!");
    }

    setLoading(true);
    try {
      // 🎯 Backend API Call
      const { data } = await api.post('/api/astrology/compatibility', { 
        boyDob: formData.yourDob, 
        girlDob: formData.partnerDob 
      });

      let message = "";
      if (data.score >= 30) message = "A cosmic connection! You both share a deep spiritual bond and understand each other effortlessly.";
      else if (data.score >= 18) message = "A strong bond with minor differences. Communication is the key to your relationship.";
      else message = "You both are quite different. While this can be challenging, it also offers a great opportunity to grow together.";

      setResult({ score: data.score, message: message, doshas: data.doshas });
      toast.success("Compatibility Checked!");
    } catch (error) {
      toast.error("Failed to check compatibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden">
      <div className="py-16 px-4 max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-900/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Love <span className="text-[#FFD700]">Compatibility</span>
          </motion.h1>
          <p className="text-gray-400">Discover the cosmic connection between you and your partner.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#110505] border border-pink-900/30 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-pink-400 mb-6 flex items-center gap-2"><span className="text-2xl">♂</span> Your Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" value={formData.yourName} onChange={(e) => setFormData({...formData, yourName: e.target.value})} className="w-full bg-black border border-pink-900/50 rounded-lg p-3 text-white focus:border-pink-500 outline-none" />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Your Date of Birth</label>
                <input type="date" value={formData.yourDob} onChange={(e) => setFormData({...formData, yourDob: e.target.value})} className="w-full bg-black border border-pink-900/50 rounded-lg p-3 text-white focus:border-pink-500 outline-none" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#110505] border border-blue-900/30 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><span className="text-2xl">♀</span> Partner's Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Partner's Name" value={formData.partnerName} onChange={(e) => setFormData({...formData, partnerName: e.target.value})} className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Partner's Date of Birth</label>
                <input type="date" value={formData.partnerDob} onChange={(e) => setFormData({...formData, partnerDob: e.target.value})} className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={handleCheck} disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-pink-700 to-red-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(219,39,119,0.4)] disabled:opacity-50">
            {loading ? 'Calculating...' : 'Check Compatibility'}
          </button>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-[#110505] border border-[#FFD700]/50 p-8 rounded-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Ashtakoota Guna Milan</h2>
            <p className="text-sm text-gray-500 mb-6">Based on Vedic Astrology (Out of 36 Points)</p>
            
            <div className="relative w-full max-w-md mx-auto h-4 bg-gray-800 rounded-full mb-6 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(result.score / 36) * 100}%` }} transition={{ duration: 1.5 }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-[#FFD700]"></motion.div>
            </div>
            <p className="text-5xl font-extrabold text-[#FFD700] mb-4">{result.score} <span className="text-2xl text-gray-500">/ 36</span></p>
            <p className="text-lg text-gray-300 italic mb-4">"{result.message}"</p>
            
            {result.doshas && result.doshas.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg inline-block text-left">
                <p className="text-red-400 font-bold text-sm mb-1">⚠️ Astrological Warnings:</p>
                <ul className="list-disc pl-5 text-sm text-gray-400">{result.doshas.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* EXTRA SECTION: HOW IT WORKS */}
      <section className="py-20 bg-black/50 border-y border-red-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-12">Why Check Kundli Milan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Understand Each Other', desc: 'Guna Milan reveals the mental, physical, and emotional compatibility between partners.' },
              { title: 'Identify Doshas', desc: 'Detect Manglik Dosha or Kaal Sarp Dosha that might affect the relationship.' },
              { title: 'Long-term Harmony', desc: 'Plan your future together with the blessings of the stars and Vedic remedies.' }
            ].map((item, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA SECTION: CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-pink-900/50 to-[#1a0505] p-12 rounded-3xl border border-pink-500/30">
            <h2 className="text-3xl font-bold text-white mb-4">Is Your Match Score Low?</h2>
            <p className="text-gray-300 mb-8">Don't worry! Our expert Tantriks can suggest powerful remedies to remove doshas and strengthen your bond.</p>
            <Link to="/tantriks">
              <button className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(219,39,119,0.4)]">
                Consult Love Specialist
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}