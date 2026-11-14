// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import api from '../lib/api';  // 🎯 FIX (H1)

// export default function FindTantrik() {
//   const [tantriks, setTantriks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const categories = ['All', 'Love Problem', 'Vashikaran', 'Black Magic Removal', 'Career', 'Grah Shanti'];

//   useEffect(() => {
//     const fetchTantriks = async () => {
//       setLoading(true);
//       try {
//         // 🎯 FIX (H1): api.get — baseURL auto
//         const { data } = await api.get(
//           `/api/users/tantriks?search=${searchQuery}&specialization=${selectedCategory}`
//         );
//         setTantriks(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching tantriks", error);
//         setLoading(false);
//       }
//     };

//     const delayDebounceFn = setTimeout(() => {
//       fetchTantriks();
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery, selectedCategory]);

//   return (
//     <div className="min-h-screen bg-[#050000] text-white pt-10 pb-20">
//       <div className="max-w-7xl mx-auto px-4">

//         <div className="text-center mb-10 relative">
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/20 rounded-full blur-[80px] -z-10"></div>
//           <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
//             Connect with <span className="text-[#FFD700]">Expert Tantriks</span>
//           </motion.h1>
//           <p className="text-gray-400 max-w-2xl mx-auto">
//             Verified spiritual guides for Love, Career, Health, and Protection.
//           </p>
//         </div>

//         <div className="max-w-xl mx-auto mb-8 relative">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by name or problem (e.g., Vashikaran, Shivshankar)..."
//             className="w-full bg-[#110505] border border-red-900/50 rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#FFD700] shadow-lg pl-12"
//           />
//           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
//         </div>

//         <div className="flex flex-wrap gap-3 justify-center mb-10">
//           {categories.map((filter, i) => (
//             <button
//               key={i}
//               onClick={() => setSelectedCategory(filter)}
//               className={`px-6 py-2 rounded-full border text-sm transition-all ${
//                 selectedCategory === filter
//                   ? 'bg-gradient-to-r from-red-800 to-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
//                   : 'bg-black border-gray-700 text-gray-400 hover:border-red-500'
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Finding Best Tantriks for you...</div>
//         ) : tantriks.length === 0 ? (
//           <div className="text-center text-gray-400 text-xl mt-20 bg-[#110505] p-10 rounded-2xl border border-red-900/30 max-w-lg mx-auto">
//             <p className="text-3xl mb-4">🔍</p>
//             <p>No Tantriks found matching your search.</p>
//             <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-[#FFD700] hover:underline">Clear Filters</button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {tantriks.map((tantrik, index) => (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={tantrik._id}
//                 className="bg-[#110505] border border-red-900/30 rounded-2xl p-6 hover:border-[#FFD700]/50 transition-all group"
//               >
//                 <Link to={`/tantrik/${tantrik._id}`} className="flex items-center gap-4 mb-4">
//                   <div className="relative">
//                     <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-[#FFD700] overflow-hidden">
//                       <img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=${index + 20}`} alt={tantrik.name} className="w-full h-full object-cover" />
//                     </div>
//                     <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#110505] ${tantrik.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">{tantrik.name}</h3>
//                     <p className="text-sm text-red-400 line-clamp-1">{tantrik.specializations?.join(', ')}</p>
//                     <p className="text-xs text-gray-400 mt-1">{tantrik.experience} Yrs Exp | {tantrik.languages?.join(', ')}</p>
//                   </div>
//                 </Link>

//                 <div className="flex justify-between items-center py-3 border-y border-red-900/20 my-4">
//                   <div className="flex items-center gap-1 text-[#FFD700]">
//                     <span>★</span> <span className="font-bold">{tantrik.rating || '5.0'}</span>
//                     <span className="text-gray-500 text-xs ml-1">({tantrik.totalReviews || 0} reviews)</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-2xl font-bold text-[#FFD700]">₹{tantrik.pricePerMinute}</span>
//                     <span className="text-gray-400 text-sm">/min</span>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <Link to={`/chat/${tantrik._id}`} className="flex-1">
//                     <button className="w-full py-2.5 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors font-medium text-sm">Chat</button>
//                   </Link>
//                   <Link to={`/chat/${tantrik._id}`} className="flex-1">
//                     <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-800 to-red-600 hover:scale-105 transition-transform font-bold text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">Call</button>
//                   </Link>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function FindTantrik() {
  const [tantriks, setTantriks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Love Problem', 'Vashikaran', 'Black Magic Removal', 'Career', 'Grah Shanti'];

  useEffect(() => {
    const fetchTantriks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/users/tantriks?search=${searchQuery}&specialization=${selectedCategory}`);
        setTantriks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(fetchTantriks, 500);
    return () => clearTimeout(delay);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20">
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Connect with <span className="text-[#FFD700]">Expert Tantriks</span>
          </motion.h1>
          <p className="text-gray-400">Verified spiritual guides for Love, Career, Health, and Protection.</p>
        </div>

        <div className="max-w-xl mx-auto mb-8 relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or problem..." className="w-full bg-[#110505] border border-red-900/50 rounded-full px-6 py-4 pl-12 text-white focus:border-[#FFD700] outline-none" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((filter, i) => (
            <button key={i} onClick={() => setSelectedCategory(filter)}
              className={`px-6 py-2 rounded-full border text-sm transition-all ${selectedCategory === filter ? 'bg-red-900 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-black border-gray-700 text-gray-400 hover:border-red-500'}`}>
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Finding Best Tantriks...</div>
        ) : tantriks.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20 bg-[#110505] p-10 rounded-2xl border border-red-900/30 max-w-lg mx-auto">
            <p className="text-3xl mb-4">🔍</p><p>No Tantriks found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tantriks.map((tantrik, index) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={tantrik._id} className="bg-[#110505] border border-red-900/30 rounded-2xl p-6 hover:border-[#FFD700]/50 transition-all group">
                <Link to={`/tantrik/${tantrik._id}`} className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-[#FFD700] overflow-hidden">
                      <img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=${index + 20}`} alt={tantrik.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#110505] ${tantrik.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FFD700] transition-colors">{tantrik.name}</h3>
                    <p className="text-sm text-red-400 line-clamp-1">{tantrik.specializations?.join(', ')}</p>
                    <p className="text-xs text-gray-400 mt-1">{tantrik.experience} Yrs Exp | {tantrik.languages?.join(', ')}</p>
                  </div>
                </Link>
                <div className="flex justify-between items-center py-3 border-y border-red-900/20 my-4">
                  <div className="flex items-center gap-1 text-[#FFD700]"><span>★</span> <span className="font-bold">{tantrik.rating || '5.0'}</span></div>
                  <div className="text-right"><span className="text-2xl font-bold text-[#FFD700]">₹{tantrik.pricePerMinute}</span><span className="text-gray-400 text-sm">/min</span></div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/chat/${tantrik._id}`} className="flex-1"><button className="w-full py-2.5 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors font-medium text-sm">Chat</button></Link>
                  <Link to={`/chat/${tantrik._id}`} className="flex-1"><button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-800 to-red-600 font-bold text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">Call</button></Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Why Consult Online?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: '100% Anonymous', desc: 'Your identity and problems are kept strictly confidential. Talk freely without judgment.' },
              { icon: '⏱️', title: '24/7 Availability', desc: 'Astrologers are available round the clock to help you in urgent situations.' },
              { icon: '💰', title: 'Affordable', desc: 'Pay only for the minutes you use. No hidden charges or expensive appointments.' }
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