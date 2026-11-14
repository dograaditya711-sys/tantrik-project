import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import { Link } from 'react-router-dom';

// 🎯 Detailed Data for Popup Modal
const destinyDetails = {
  1: { num: 1, planet: 'Sun (Surya)', traits: 'Leadership, confidence, independence, and ambition.', luckyColor: 'Orange, Red', luckyDay: 'Sunday', element: 'Fire', mantra: 'Om Suryaya Namaha' },
  2: { num: 2, planet: 'Moon (Chandra)', traits: 'Emotional, intuitive, peaceful, and sensitive.', luckyColor: 'White, Silver', luckyDay: 'Monday', element: 'Water', mantra: 'Om Somaya Namaha' },
  3: { num: 3, planet: 'Jupiter (Guru)', traits: 'Creative, expressive, optimistic, and wise.', luckyColor: 'Yellow, Gold', luckyDay: 'Thursday', element: 'Air/Ether', mantra: 'Om Brim Brihaspataye Namaha' },
  4: { num: 4, planet: 'Rahu', traits: 'Practical, disciplined, unconventional, and builders.', luckyColor: 'Blue, Grey', luckyDay: 'Saturday', element: 'Air', mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namaha' },
  5: { num: 5, planet: 'Mercury (Budh)', traits: 'Energetic, freedom-loving, quick-witted, and adaptable.', luckyColor: 'Green, Light Green', luckyDay: 'Wednesday', element: 'Earth', mantra: 'Om Bum Budhaya Namaha' },
  6: { num: 6, planet: 'Venus (Shukra)', traits: 'Caring, responsible, artistic, and nurturing.', luckyColor: 'Blue, Pink, White', luckyDay: 'Friday', element: 'Water', mantra: 'Om Shum Shukraya Namaha' },
  7: { num: 7, planet: 'Ketu', traits: 'Analytical, spiritual, introspective, and mysterious.', luckyColor: 'Light Blue, Grey', luckyDay: 'Tuesday', element: 'Fire', mantra: 'Om Kem Ketave Namaha' },
  8: { num: 8, planet: 'Saturn (Shani)', traits: 'Powerful, business-minded, hardworking, and serious.', luckyColor: 'Black, Dark Blue', luckyDay: 'Saturday', element: 'Air', mantra: 'Om Sham Shanaishcharaya Namaha' },
  9: { num: 9, planet: 'Mars (Mangal)', traits: 'Compassionate, selfless, energetic, and bold.', luckyColor: 'Red, Coral', luckyDay: 'Tuesday', element: 'Fire', mantra: 'Om Am Aangarakaya Namaha' },
};

const destinyMeanings = Object.values(destinyDetails);

const faqs = [
  { q: "What is a Naam Rashi?", a: "Naam Rashi is the zodiac sign calculated based on the first letter (Namakshar) of your name. In Vedic Astrology, it is believed that your name carries a specific vibrational energy that aligns with a particular Rashi." },
  { q: "What is a Destiny Number (Bhagyank)?", a: "Destiny number is calculated by adding the numerical values of all the letters in your name (A=1, B=2... Z=26) and reducing it to a single digit. It reveals your core personality and life path." },
  { q: "Are Name Rashi and Date of Birth Rashi the same?", a: "Not necessarily. Your birth Rashi (Moon Sign) is calculated from your exact date, time, and place of birth. Name Rashi is an additional astrological layer based on your name." },
];

export default function NameRashi() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 🎯 State for Modal
  const [selectedDestiny, setSelectedDestiny] = useState(null);

  const calculateNameRashi = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");

    setLoading(true);
    try {
      const { data } = await api.post('/api/astrology/name-rashi', { name });
      setResult(data);
      toast.success("Naam Rashi Calculated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden">
      {/* ================= TOP SECTION (TOOL) ================= */}
      <div className="py-16 px-4 max-w-4xl mx-auto relative">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Name <span className="text-[#FFD700]">Rashi & Numerology</span>
          </motion.h1>
          <p className="text-gray-400">Find out what your name says about your destiny and zodiac sign.</p>
        </div>

        <div className="bg-[#110505] border border-purple-900/30 p-8 rounded-3xl shadow-2xl mb-16">
          <form onSubmit={calculateNameRashi} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm text-gray-400 mb-2 block">Enter Your Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Aditya Sharma" 
                className="w-full bg-black border border-purple-900/50 rounded-lg p-4 text-white focus:border-[#FFD700] outline-none" 
                required 
              />
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-purple-700 to-purple-500 text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(147,51,234,0.4)] disabled:opacity-50">
              {loading ? 'Calculating...' : 'Reveal My Destiny'}
            </button>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl text-gray-300">Hi, <span className="text-white font-bold">{result.name}</span></h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center flex flex-col justify-center">
                  <p className="text-gray-400 mb-2 text-xs md:text-sm">Naam Rashi</p>
                  <h3 className="text-lg md:text-xl font-bold text-[#FFD700]">{result.naamRashi}</h3>
                </div>
                <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center flex flex-col justify-center">
                  <p className="text-gray-400 mb-2 text-xs md:text-sm">Destiny Rashi</p>
                  <h3 className="text-lg md:text-xl font-bold text-[#FFD700]">{result.destinyRashi}</h3>
                </div>
                <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center flex flex-col justify-center">
                  <p className="text-gray-400 mb-2 text-xs md:text-sm">Destiny Number</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">{result.destinyNumber}</h3>
                </div>
                <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center flex flex-col justify-center">
                  <p className="text-gray-400 mb-2 text-xs md:text-sm">Lucky Color</p>
                  <h3 className="text-lg md:text-xl font-bold text-white">{result.luckyColor}</h3>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ================= SECTION 1: 9 DESTINY NUMBERS (Clickable) ================= */}
      <section className="py-20 bg-black/40 border-y border-purple-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-4">The 9 Destiny Numbers</h2>
          <p className="text-center text-gray-400 mb-12">Click on any number to know its astrological details.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinyMeanings.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.05 }} 
                key={item.num} 
                onClick={() => setSelectedDestiny(item)} // 🎯 Open Modal on Click
                className="bg-[#110505] p-6 rounded-2xl border border-purple-900/30 hover:border-[#FFD700]/50 transition-all cursor-pointer group hover:scale-[1.02] shadow-lg"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-xl font-bold text-white border border-purple-500/50 group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-[#FFD700] transition-colors">Number {item.num}</h3>
                    <p className="text-xs text-[#FFD700]">Ruling Planet: {item.planet}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{item.traits}</p>
                <p className="text-xs text-gray-500 mt-3 font-semibold">Click to view full details →</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 🎯 MODAL (POPUP) ================= */}
      <AnimatePresence>
        {selectedDestiny && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDestiny(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#110505] border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(147,51,234,0.2)] z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDestiny(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-red-900 transition-colors"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] mb-4">
                  {selectedDestiny.num}
                </div>
                <h2 className="text-2xl font-bold text-[#FFD700]">Destiny Number {selectedDestiny.num}</h2>
                <p className="text-purple-400 text-sm font-semibold">{selectedDestiny.planet}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-xs mb-1">Personality Traits</p>
                  <p className="text-white text-sm">{selectedDestiny.traits}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1">Lucky Color</p>
                    <p className="text-[#FFD700] text-sm font-bold">{selectedDestiny.luckyColor}</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-xs mb-1">Lucky Day</p>
                    <p className="text-white text-sm font-bold">{selectedDestiny.luckyDay}</p>
                  </div>
                </div>

                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20">
                  <p className="text-gray-400 text-xs mb-1">Vedic Mantra for {selectedDestiny.planet}</p>
                  <p className="text-purple-300 text-sm italic font-serif">"{selectedDestiny.mantra}"</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <Link to="/tantriks">
                  <button className="w-full bg-gradient-to-r from-[#FFD700] to-yellow-600 text-black font-bold py-3 rounded-xl hover:scale-105 transition-transform">
                    Consult Astrologer to know more
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SECTION 3: FAQs ================= */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={i} className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-lg font-bold text-[#FFD700] mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: CTA ================= */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-purple-900/50 to-[#1a0505] p-12 rounded-3xl border border-purple-500/30 relative overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-4">Want to change your destiny?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Our expert astrologers can analyze your full birth chart and suggest powerful name corrections.</p>
            <Link to="/tantriks">
              <button className="bg-[#FFD700] text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                Talk to Astrologer
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}