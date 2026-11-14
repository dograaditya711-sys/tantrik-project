import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState('Love');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLoveCalc = async (e) => {
    e.preventDefault();
    if(!name1 || !name2) return toast.error("Please enter both names");
    
    setLoading(true);
    try {
      // 🎯 Backend API Call
      const { data } = await api.post('/api/astrology/love', { name1, name2 });
      setResult({ title: "Love Compatibility", score: `${data.score}%`, text: data.score > 80 ? "Perfect Match! You both are made for each other." : "Good match, but requires some understanding." });
    } catch (error) {
      toast.error("Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNumCalc = async (e) => {
    e.preventDefault();
    if(!fullName) return toast.error("Please enter your name");
    
    setLoading(true);
    try {
      // 🎯 Backend API Call
      const { data } = await api.post('/api/astrology/numerology', { name: fullName });
      setResult({ title: "Your Destiny Number", score: data.destinyNumber, text: data.meaning });
    } catch (error) {
      toast.error("Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20">
      <div className="py-16 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Astrology <span className="text-[#FFD700]">Calculators</span></h1>
          <p className="text-gray-400">Discover hidden insights with our free tools.</p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {['Love', 'Numerology'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                activeTab === tab ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-[#110505] border border-[#FFD700]/30 text-[#FFD700]'
              }`}
            >
              {tab} Calculator
            </button>
          ))}
        </div>

        <div className="bg-[#110505] border border-red-900/30 p-8 rounded-3xl shadow-2xl relative">
          {activeTab === 'Love' && (
            <form onSubmit={handleLoveCalc} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Your Name" value={name1} onChange={e => setName1(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-4 text-white focus:border-[#FFD700] outline-none" />
                <input type="text" placeholder="Partner's Name" value={name2} onChange={e => setName2(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-4 text-white focus:border-[#FFD700] outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform">Calculate Love</button>
            </form>
          )}

          {activeTab === 'Numerology' && (
            <form onSubmit={handleNumCalc} className="space-y-6">
              <input type="text" placeholder="Enter Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-4 text-white focus:border-[#FFD700] outline-none" />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform">Get Destiny Number</button>
            </form>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-black/50 border border-[#FFD700]/50 rounded-2xl text-center">
              <h3 className="text-xl text-[#FFD700] font-bold mb-2">{result.title}</h3>
              <p className="text-5xl font-extrabold text-white mb-4">{result.score}</p>
              <p className="text-gray-300">{result.text}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-t border-red-900/20 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-8">How Do These Calculators Work?</h2>
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed text-center">
            <p><strong>Love Calculator:</strong> This tool uses the ancient science of name numerology. It calculates the vibrational frequency of your names and compares them to find the compatibility percentage.</p>
            <p><strong>Numerology Calculator:</strong> Numerology is the study of numbers in your life. By adding the numerical values of the letters in your name, we find your Destiny (Moolank) number which reveals your core personality traits.</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Is the Love Calculator accurate?", a: "It is based on name numerology. For 100% accuracy, you should match your Kundli (Moon signs) with an astrologer." },
            { q: "What is a Destiny Number?", a: "In numerology, the Destiny Number (Bhagyank) represents the opportunities and challenges you will face in life." }
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