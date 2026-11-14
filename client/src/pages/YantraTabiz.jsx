import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function YantraTabiz() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchYantras = async () => {
      try {
        const { data } = await api.get('/api/users/products?category=Yantra');
        
        if (data.length > 0) {
            setProducts(data);
        } else {
            setProducts([
                { _id: '1', name: 'Shree Yantra', price: 1100, image: 'https://picsum.photos/400/400?random=1', category: 'Yantra' },
                { _id: '2', name: 'Maha Mrityunjay Yantra', price: 850, image: 'https://picsum.photos/400/400?random=2', category: 'Yantra' },
                { _id: '3', name: 'Baglamukhi Yantra', price: 1500, image: 'https://picsum.photos/400/400?random=3', category: 'Yantra' },
                { _id: '4', name: 'Kuber Yantra', price: 950, image: 'https://picsum.photos/400/400?random=4', category: 'Yantra' }
            ]);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load items");
        setLoading(false);
      }
    };
    fetchYantras();
  }, []);

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20">
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Energized <span className="text-[#FFD700]">Yantra & Tabiz</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Authentic, energized items for protection, wealth, and peace.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Loading Spiritual Items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={product._id} 
                className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-gray-900 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FFD700] border border-[#FFD700]/30">
                    {product.category || 'Yantra'}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">Highly energized and blessed by our expert Pandits.</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-red-900/20">
                    <span className="text-2xl font-bold text-[#FFD700]">₹{product.price}</span>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="bg-gradient-to-r from-red-800 to-red-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Why Buy Energized Yantras?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔥', title: '100% Energized', desc: 'Each Yantra is energized with powerful Vedic Mantras by our Pandits.' },
              { icon: '🛡️', title: 'Protection', desc: 'Yantras act as a shield against negative energies and evil eye.' },
              { icon: '💰', title: 'Attract Wealth', desc: 'Specific Yantras like Kuber Yantra help in financial growth.' }
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
        <h2 className="text-3xl font-bold text-center text-white mb-12">Yantra FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "Where should I place a Yantra?", a: "Yantras should ideally be placed in the Pooja room or the North-East direction of your home." },
            { q: "How to maintain a Yantra?", a: "Clean it regularly with a soft cloth. You can also offer incense or flowers to keep the energy positive." }
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