import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import { Link } from 'react-router-dom';

const zodiacSignsList = [
  { name: 'Aries (Mesh)', date: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus (Vrishabha)', date: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini (Mithun)', date: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer (Karka)', date: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo (Simha)', date: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo (Kanya)', date: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra (Tula)', date: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio (Vrishchik)', date: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius (Dhanu)', date: 'Nov 22 - Dec 21', element: 'Fire' },
  { name: 'Capricorn (Makar)', date: 'Dec 22 - Jan 19', element: 'Earth' },
  { name: 'Aquarius (Kumbh)', date: 'Jan 20 - Feb 18', element: 'Air' },
  { name: 'Pisces (Meen)', date: 'Feb 19 - Mar 20', element: 'Water' },
];

export default function RashiCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRashi = async (e) => {
    e.preventDefault();
    if (!dob) return toast.error("Please select your Date of Birth");

    setLoading(true);
    try {
      const { data } = await api.post('/api/astrology/rashi', { dob });
      setResult(data);
      toast.success("Rashi Calculated Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden">
      <div className="py-16 px-4 max-w-4xl mx-auto relative">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Rashi & Nakshatra <span className="text-[#FFD700]">Calculator</span>
          </motion.h1>
          <p className="text-gray-400">Find your Moon sign (Rashi) and birth star (Nakshatra).</p>
        </div>

        <div className="bg-[#110505] border border-yellow-900/30 p-8 rounded-3xl shadow-2xl mb-16">
          <form onSubmit={calculateRashi} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm text-gray-400 mb-2 block">Enter Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-black border border-yellow-900/50 rounded-lg p-4 text-white focus:border-[#FFD700] outline-none" required />
            </div>
            <button type="submit" disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.4)] disabled:opacity-50">
              {loading ? 'Calculating...' : 'Calculate Now'}
            </button>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center">
                <p className="text-gray-400 mb-2">Your Rashi (Moon Sign)</p>
                <h3 className="text-3xl font-bold text-[#FFD700]">{result.rashi}</h3>
              </div>
              <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center">
                <p className="text-gray-400 mb-2">Your Nakshatra</p>
                <h3 className="text-3xl font-bold text-[#FFD700]">{result.nakshatra}</h3>
              </div>
              <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center">
                <p className="text-gray-400 mb-2">Lucky Number</p>
                <h3 className="text-3xl font-bold text-white">{result.luckyNumber}</h3>
              </div>
              <div className="bg-black/50 border border-[#FFD700]/30 p-6 rounded-xl text-center">
                <p className="text-gray-400 mb-2">Lucky Color</p>
                <h3 className="text-3xl font-bold text-white">{result.luckyColor}</h3>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-16 bg-black/40 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-12">The 12 Zodiac Signs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zodiacSignsList.map((sign, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} key={i} 
                className="bg-[#110505] p-5 rounded-xl border border-red-900/30 hover:border-[#FFD700]/50 transition-colors">
                <h3 className="font-bold text-white mb-1">{sign.name}</h3>
                <p className="text-xs text-[#FFD700] mb-2">{sign.date}</p>
                <p className="text-sm text-gray-500">Element: {sign.element}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Difference between Sun Sign & Moon Sign</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm leading-relaxed">
           <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Sun Sign (Surya Rashi)</h3>
              <p>The Sun sign is calculated based on the date of birth and changes every month. It represents your outer personality and ego.</p>
           </div>
           <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-[#FFD700] mb-2">Moon Sign (Chandra Rashi)</h3>
              <p>The Moon sign is calculated based on exact date, time, and place of birth. It changes every 2.5 days and represents your inner emotions.</p>
           </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Rashi FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "Is Rashi based on Date of Birth?", a: "Yes, but for exact calculation, the time of birth is required because the Moon changes signs within 2.5 days." },
            { q: "What is Nakshatra?", a: "A Nakshatra is a lunar mansion. There are 27 Nakshatras in Vedic astrology, and each person is born under a specific one." }
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