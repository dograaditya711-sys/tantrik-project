import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'sonner';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export default function Horoscope() {
  const [activeTab, setActiveTab] = useState('Daily');
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const { data } = await api.post('/api/astrology/horoscope', { sign: selectedSign, period: activeTab });
        setPrediction(data);
      } catch (error) {
        toast.error("Failed to load horoscope");
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedSign, activeTab]);

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden">
      <div className="py-16 px-4 max-w-5xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Astrology <span className="text-[#FFD700]">Horoscope</span>
          </motion.h1>
          <p className="text-gray-400">Select your zodiac sign to read your prediction.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {zodiacSigns.map((sign) => (
            <button key={sign} onClick={() => setSelectedSign(sign)}
              className={`py-3 rounded-xl border font-bold text-sm transition-all ${selectedSign === sign ? 'bg-red-900 border-red-500 text-white scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-[#110505] border-red-900/30 text-gray-400 hover:border-[#FFD700]'}`}>
              {sign}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-2">
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-transparent border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10'}`}>
              {tab}
            </button>
          ))}
        </div>

        <motion.div key={activeTab + selectedSign} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-[#110505] border border-red-900/30 p-8 md:p-12 rounded-3xl text-center shadow-2xl relative mb-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
          
          {loading ? (
            <p className="text-[#FFD700] animate-pulse text-xl">Consulting the stars...</p>
          ) : prediction && (
            <>
              <h2 className="text-3xl font-bold text-white mb-6">{selectedSign} - {activeTab} Prediction</h2>
              <p className="text-xl text-gray-300 leading-relaxed italic mb-6">"{prediction.prediction}"</p>
              {prediction.detail && <p className="text-md text-gray-400 mb-8">{prediction.detail}</p>}
              
              <div className="flex justify-center gap-8 border-t border-red-900/30 pt-6">
                <div><p className="text-gray-500 text-sm mb-1">Lucky Number</p><p className="text-2xl font-bold text-[#FFD700]">{prediction.luckyNumber}</p></div>
                <div><p className="text-gray-500 text-sm mb-1">Lucky Color</p><p className="text-2xl font-bold text-[#FFD700]">{prediction.luckyColor}</p></div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Why Read Your Daily Horoscope?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🌟', title: 'Plan Your Day', desc: 'Knowing planetary positions helps you schedule important tasks at the right time.' },
              { icon: '🛡️', title: 'Avoid Negativity', desc: 'Predictions warn you about potential challenges so you can stay cautious.' },
              { icon: '📈', title: 'Career & Finance', desc: 'Understand the right time to invest, change jobs, or start a new business.' }
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

      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Horoscope FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "How often is the horoscope updated?", a: "Our daily horoscopes are updated every midnight based on the transit of the Moon and other planets." },
            { q: "Should I follow only my Sun Sign?", a: "Your Sun sign gives a general prediction. For accurate results, you should also check your Moon sign (Rashi) and Ascendant." },
            { q: "Can horoscopes predict exact events?", a: "Horoscopes indicate trends and energies. They guide you, but your actions and free will also shape your future." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-lg font-bold text-[#FFD700] mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-red-900 to-[#1a0505] p-12 rounded-3xl border border-[#FFD700]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-[80px]"></div>
            <h2 className="text-4xl font-bold text-white mb-4">Need a Detailed Analysis?</h2>
            <p className="text-gray-300 mb-8">Get a personalized Kundli reading from our top astrologers.</p>
            <Link to="/tantriks">
              <button className="bg-[#FFD700] text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                Talk to Astrologer Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}