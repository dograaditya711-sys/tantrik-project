// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';
// import api from '../lib/api'; // 🎯 FIX (H1)

// export default function Poojas() {
//   const [poojas, setPoojas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [bookingId, setBookingId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPoojas = async () => {
//       try {
//         const { data } = await api.get('/api/users/poojas'); // Assuming route exists
//         setPoojas(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching poojas", error);
//         setLoading(false);
//       }
//     };
//     fetchPoojas();
//   }, []);

//   const handleBookPooja = async (pooja) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error("Please login to book a pooja.");
//       navigate('/login');
//       return;
//     }

//     setBookingId(pooja._id);
//     try {
//       const { data } = await api.post(
//         '/api/users/book-pooja', 
//         { poojaId: pooja._id, fullName: 'User', gotra: 'Kashyap', preferredDate: new Date() }
//       );

//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, walletBalance: data.newBalance }));

//       toast.success(`Successfully booked ${pooja.title}!`, {
//         description: `Remaining Balance: ₹${data.newBalance}`
//       });
      
//       setTimeout(() => window.location.reload(), 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Booking Failed. Check wallet balance.');
//     } finally {
//       setBookingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#050000] text-white pt-10 pb-20">
//       <div className="max-w-7xl mx-auto px-4">
        
//         <div className="text-center mb-16">
//           <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
//             Book Powerful <span className="text-[#FFD700]">Poojas</span>
//           </motion.h1>
//           <p className="text-gray-400 max-w-2xl mx-auto">
//             Authentic Vedic Poojas and Anushthans performed by experienced Pandits.
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Loading Poojas...</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {poojas.map((pooja, index) => (
//               <motion.div 
//                 key={pooja._id} 
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} 
//                 className="bg-gradient-to-b from-[#1a0505] to-black p-8 rounded-2xl border border-red-900/50 text-center relative overflow-hidden group"
//               >
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
//                 <h3 className="text-2xl font-bold text-[#FFD700] mb-4">{pooja.title}</h3>
//                 <p className="text-gray-400 mb-6 line-clamp-3">{pooja.description}</p>
//                 <p className="text-3xl font-bold text-white mb-6">₹{pooja.price}</p>
                
//                 <button 
//                   onClick={() => handleBookPooja(pooja)}
//                   disabled={bookingId === pooja._id}
//                   className={`w-full border border-red-500 text-red-500 px-6 py-3 rounded-full font-bold text-sm transition-all ${
//                     bookingId === pooja._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white'
//                   }`}
//                 >
//                   {bookingId === pooja._id ? 'Processing...' : 'Book Now'}
//                 </button>
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Poojas() {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const { data } = await api.get('/api/users/poojas');
        setPoojas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoojas();
  }, []);

  const handleBookPooja = async (pooja) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to book a pooja.");
      navigate('/login');
      return;
    }
    setBookingId(pooja._id);
    try {
      const { data } = await api.post('/api/users/book-pooja', { poojaId: pooja._id, fullName: 'User', gotra: 'Kashyap', preferredDate: new Date() });
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, walletBalance: data.newBalance }));
      toast.success(`Successfully booked ${pooja.title}!`, { description: `Remaining Balance: ₹${data.newBalance}` });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking Failed. Check wallet balance.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20">
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Book Powerful <span className="text-[#FFD700]">Poojas</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Authentic Vedic Poojas and Anushthans performed by experienced Pandits.</p>
        </div>

        {loading ? (
          <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Loading Poojas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {poojas.map((pooja, index) => (
              <motion.div key={pooja._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-b from-[#1a0505] to-black p-8 rounded-2xl border border-red-900/50 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-4">{pooja.title}</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">{pooja.description}</p>
                <p className="text-3xl font-bold text-white mb-6">₹{pooja.price}</p>
                <button onClick={() => handleBookPooja(pooja)} disabled={bookingId === pooja._id} className={`w-full border border-red-500 text-red-500 px-6 py-3 rounded-full font-bold text-sm transition-all ${bookingId === pooja._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white'}`}>
                  {bookingId === pooja._id ? 'Processing...' : 'Book Now'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-8">How are Poojas Performed?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-white mb-2">1. Sankalp (Intention)</h3>
              <p className="text-gray-400 text-sm">Your name and Gotra are chanted to dedicate the Pooja to you and your family.</p>
            </div>
            <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-white mb-2">2. Vedic Mantras</h3>
              <p className="text-gray-400 text-sm">Highly experienced Pandits chant specific mantras for the deity.</p>
            </div>
            <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-white mb-2">3. Havan & Aarti</h3>
              <p className="text-gray-400 text-sm">The Pooja concludes with a Havan (fire ritual) for purification and blessings.</p>
            </div>
            <div className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-xl font-bold text-white mb-2">4. Video Proof</h3>
              <p className="text-gray-400 text-sm">A video of your Pooja is recorded and sent to you on your dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}