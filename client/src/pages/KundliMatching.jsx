import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function KundliMatching() {
  const [boy, setBoy] = useState({ name: '', dob: '' });
  const [girl, setGirl] = useState({ name: '', dob: '' });
  const [result, setResult] = useState(null);

  const handleMatch = (e) => {
    e.preventDefault();
    if(!boy.name || !boy.dob || !girl.name || !girl.dob) {
      return toast.error("Please fill all details for both Boy and Girl");
    }
    // Mock Guna Milan (Out of 36)
    const score = Math.floor(Math.random() * 20) + 16; // Random score between 16 and 36
    let verdict = "";
    if(score >= 18) verdict = "Excellent Match! Highly recommended.";
    else if(score >= 24) verdict = "Very Good Match. You both will be happy.";
    else verdict = "Average Match. Needs some compromises.";

    setResult({ score, verdict });
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Kundli <span className="text-[#FFD700]">Matching</span></h1>
          <p className="text-gray-400">Check your compatibility with your partner based on Vedic Astrology.</p>
        </div>

        <form onSubmit={handleMatch} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Boy Details */}
          <div className="bg-[#110505] border border-blue-900/30 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">♂ Boy's Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Boy's Name" value={boy.name} onChange={e => setBoy({...boy, name: e.target.value})} className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date of Birth</label>
                <input type="date" value={boy.dob} onChange={e => setBoy({...boy, dob: e.target.value})} className="w-full bg-black border border-blue-900/50 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Girl Details */}
          <div className="bg-[#110505] border border-pink-900/30 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">♀ Girl's Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Girl's Name" value={girl.name} onChange={e => setGirl({...girl, name: e.target.value})} className="w-full bg-black border border-pink-900/50 rounded-lg p-3 text-white focus:border-pink-500 outline-none" />
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date of Birth</label>
                <input type="date" value={girl.dob} onChange={e => setGirl({...girl, dob: e.target.value})} className="w-full bg-black border border-pink-900/50 rounded-lg p-3 text-white focus:border-pink-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full bg-gradient-to-r from-red-800 to-red-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Check Kundli Match
            </button>
          </div>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 bg-gradient-to-b from-[#1a0505] to-black border border-[#FFD700]/50 p-8 rounded-3xl text-center shadow-[0_0_30px_rgba(255,215,0,0.1)]">
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Guna Milan Score</h2>
            <div className="text-6xl font-extrabold text-[#FFD700] mb-4">
              {result.score} <span className="text-3xl text-gray-500">/ 36</span>
            </div>
            <p className="text-xl text-white font-bold mb-2">{result.verdict}</p>
            <p className="text-gray-400">This is a computer-generated mock report. For a detailed analysis, please consult a Tantrik.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}