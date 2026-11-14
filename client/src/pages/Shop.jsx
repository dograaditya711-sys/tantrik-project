import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState({ name: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/users/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to purchase items.");
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
    setShowCheckout(true);
  };

  const confirmOrder = async (e) => {
    e.preventDefault();
    setBuyingId(selectedProduct._id);
    try {
      const { data } = await api.post(
        '/api/users/order', 
        { productId: selectedProduct._id, shippingAddress: address }
      );

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...userInfo, walletBalance: data.newBalance };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      toast.success(`Successfully purchased ${selectedProduct.name}!`, {
        description: `Remaining Balance: ₹${data.newBalance}`
      });
      
      setShowCheckout(false);
      setAddress({ name: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
      setTimeout(() => window.location.reload(), 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase Failed. Check wallet balance.');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/20 rounded-full blur-[80px] -z-10"></div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Energized <span className="text-[#FFD700]">Spiritual Items</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Authentic Rudraksha, Yantras, and Kavach, energized by our top Tantriks.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Loading Shop...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20 bg-[#110505] p-10 rounded-2xl border border-red-900/30 max-w-lg mx-auto">
            <p className="text-4xl mb-4">🛍️</p>
            <p>No products available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} key={product._id} 
                className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-gray-900 relative">
                  <img 
                    src={product.image || `https://picsum.photos/400/400?random=${index}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FFD700] border border-[#FFD700]/30">
                    {product.category || 'Spiritual'}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-red-900/20">
                    <div>
                      <span className="text-2xl font-bold text-[#FFD700]">₹{product.price}</span>
                    </div>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="bg-gradient-to-r from-red-800 to-red-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.3)]"
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
      <section className="py-20 bg-black/40 border-t border-red-900/20 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Authentic & Energized</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '100% Original', desc: 'Sourced directly from certified vendors and temples.' },
              { title: 'Prana Pratishtha', desc: 'Each item is energized with Vedic mantras before shipping.' },
              { title: 'Secure Delivery', desc: 'Carefully packaged and delivered safely to your doorstep.' }
            ].map((item, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Spiritual Items FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "How do I wear a Rudraksha?", a: "It is recommended to wear it on a Monday or Maha Shivratri after chanting 'Om Namah Shivaya' 108 times." },
            { q: "Are these items energized?", a: "Yes, all our Yantras and Kavach are energized by experienced Pandits before dispatch." },
            { q: "Can I return the product?", a: "Physical products can be returned within 7 days if they are damaged. Please check our Refund Policy." }
          ].map((faq, i) => (
            <div key={i} className="bg-[#110505] p-6 rounded-xl border border-red-900/30">
              <h3 className="text-lg font-bold text-[#FFD700] mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/50 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Checkout</h2>
            <p className="text-sm text-gray-400 mb-6">Purchasing: <span className="text-white font-bold">{selectedProduct.name}</span> for ₹{selectedProduct.price}</p>
            
            <form onSubmit={confirmOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
                <input type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
              </div>
              <input type="text" placeholder="Address Line (House No, Street)" value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
                <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
                <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={buyingId} className="flex-1 bg-gradient-to-r from-red-800 to-red-600 py-3 rounded-lg font-bold text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                  {buyingId ? 'Processing...' : `Pay ₹${selectedProduct.price} & Order`}
                </button>
                <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}