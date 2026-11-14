import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function FreeKundli() {
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '', pob: '' });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/generate-kundli', formData);
      setReport(data.report);
      toast.success("Kundli Generated Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate Kundli');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20">
      <div className="py-12 px-4 max-w-6xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-900/10 rounded-full blur-[120px] -z-10"></div>

        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold mb-4">
            Free <span className="text-[#FFD700]">Kundli</span> Analysis
          </motion.h1>
          <p className="text-gray-400">Enter your birth details to get a quick astrological insight.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FORM SECTION */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#110505] border border-red-900/30 p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Birth Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <div>
                <label className="text-sm text-gray-400">Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <div>
                <label className="text-sm text-gray-400">Time of Birth</label>
                <input type="time" name="tob" value={formData.tob} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <div>
                <label className="text-sm text-gray-400">Place of Birth</label>
                <input type="text" name="pob" value={formData.pob} onChange={handleChange} placeholder="e.g. New Delhi" className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50 mt-4">
                {loading ? 'Calculating...' : 'Generate Kundli'}
              </button>
            </form>
          </motion.div>

          {/* REPORT SECTION */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#110505] border border-red-900/30 p-8 rounded-2xl shadow-xl flex flex-col">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Your Report</h2>
            
            {!report ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center">
                <div className="text-5xl mb-4">🔮</div>
                <p>Fill the form to see your Kundli</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                <div className="border-b border-red-900/30 pb-3">
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-lg font-bold">{report.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-gray-400 text-sm">Sun Sign</p><p className="text-[#FFD700] font-bold">{report.sunSign}</p></div>
                  <div><p className="text-gray-400 text-sm">Moon Sign</p><p className="text-[#FFD700] font-bold">{report.moonSign}</p></div>
                  <div><p className="text-gray-400 text-sm">Ascendant</p><p className="text-[#FFD700] font-bold">{report.ascendant}</p></div>
                  <div><p className="text-gray-400 text-sm">Nakshatra</p><p className="text-[#FFD700] font-bold">{report.nakshatra}</p></div>
                  <div><p className="text-gray-400 text-sm">Manglik</p><p className={`font-bold ${report.manglik === 'Yes' ? 'text-red-500' : 'text-green-500'}`}>{report.manglik}</p></div>
                  <div><p className="text-gray-400 text-sm">Lucky Number</p><p className="text-white font-bold">{report.luckyNumber}</p></div>
                </div>
                <div className="mt-6 pt-4 border-t border-red-900/30 text-center">
                   <Link to="/tantriks">
                     <button className="text-[#FFD700] hover:underline text-sm font-bold">Consult Tantrik for Detailed Analysis →</button>
                   </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">What Does a Kundli Reveal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💼', title: 'Career & Wealth', desc: 'Understand your true potential, favorable periods for job changes, and wealth accumulation.' },
              { icon: '❤️', title: 'Love & Marriage', desc: 'Find out about your future spouse, marriage timing, and harmony in married life.' },
              { icon: '🏥', title: 'Health & Wellness', desc: 'Identify vulnerable health areas and periods when you need to be extra careful.' }
            ].map((item, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}