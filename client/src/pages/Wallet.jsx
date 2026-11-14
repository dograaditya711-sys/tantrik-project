import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../lib/api';

export default function Wallet() {
  const [amount, setAmount] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      const { data: orderData } = await api.post('/api/users/create-payment-order', { amount: Number(amount) });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TantraTalk',
        description: 'Wallet Recharge',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 🎯 FIX: 'amount' field yahan se hata diya gaya hai
            const verifyRes = await api.post('/api/users/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            const updatedUser = { ...user, walletBalance: verifyRes.data.newBalance };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            toast.success(`Successfully recharged ₹${amount}`, {
              description: `New Balance: ₹${verifyRes.data.newBalance}`
            });
            setAmount('');
            
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
          }
        },
        theme: { color: '#050000' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("Payment Failed or Cancelled");
      });

      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050000] flex flex-col items-center pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-[120px] -z-10"></div>

      <div className="pt-16 px-4 w-full flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative z-10 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          {/* Current Balance */}
          <div className="text-center mb-8">
            <p className="text-gray-400 mb-2">Current Wallet Balance</p>
            <h2 className="text-5xl font-bold text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              ₹{user.walletBalance || 0}
            </h2>
          </div>

          {/* Recharge Form */}
          <form onSubmit={handleRecharge}>
            <label className="block text-gray-300 mb-2 font-medium">Enter Amount (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] mb-4 text-lg" placeholder="e.g. 500" required min="10" />

            <div className="flex gap-3 mb-6">
              {[100, 500, 1000].map((val) => (
                <button key={val} type="button" onClick={() => setAmount(val)} className="flex-1 bg-red-900/20 border border-red-900/50 rounded-lg py-2 text-sm hover:bg-red-900/40 transition-colors">
                  +₹{val}
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50">
              {loading ? 'Processing...' : 'Proceed to Pay'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-xs">
            * Secure payments powered by Razorpay.
          </p>
        </motion.div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 w-full bg-black/40 border-y border-red-900/20 mt-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Why Recharge on TantraTalk?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🛡️', title: '100% Secure', desc: 'Your payments are processed securely via Razorpay. We do not store your card details.' },
              { icon: '💰', title: 'Instant Credit', desc: 'Money is instantly added to your wallet so you can consult without waiting.' },
              { icon: '🎧', title: '24/7 Support', desc: 'Facing any issue with recharge? Our support team is available round the clock.' }
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

      <section className="py-20 max-w-4xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Wallet FAQs</h2>
        <div className="space-y-4">
          {[
            { q: "Can I withdraw the money from my wallet?", a: "Currently, the wallet balance is only for using consultation services on the platform. It cannot be withdrawn back to your bank." },
            { q: "What if my money got deducted but balance not updated?", a: "In rare cases, bank servers take 2-3 hours to sync. If it takes longer, contact support with the Order ID." },
            { q: "Do I get a refund if the Tantrik doesn't reply?", a: "Yes! If a Tantrik doesn't reply within 2 minutes of starting the chat, your money is automatically refunded to your wallet." }
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