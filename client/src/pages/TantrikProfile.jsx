import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function TantrikProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tantrik, setTantrik] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: tantrikData } = await api.get(`/api/users/tantrik/${id}`);
        setTantrik(tantrikData);

        const { data: reviewsData } = await api.get(`/api/users/reviews/${id}`);
        setReviews(reviewsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile", error);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20 text-xl font-bold animate-pulse">Loading Profile...</div>;
  if (!tantrik) return <div className="text-white text-center mt-20">Tantrik Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050000] text-white pb-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* PROFILE HEADER CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] border border-red-900/30 rounded-3xl overflow-hidden relative shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <div className="h-32 bg-gradient-to-r from-red-950 via-red-900 to-red-950"></div>
          
          <div className="px-8 pb-8 relative">
            <div className="w-32 h-32 rounded-full border-4 border-[#110505] bg-gray-800 overflow-hidden absolute -top-16 shadow-xl">
              <img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=15`} alt={tantrik.name} className="w-full h-full object-cover" />
              <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-[#110505] ${tantrik.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            </div>

            <div className="ml-40 pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-[#FFD700]">{tantrik.name}</h1>
                  <p className="text-red-400 text-sm font-semibold mt-1">{tantrik.specializations?.join(', ')}</p>
                  <p className="text-gray-400 text-sm mt-1">{tantrik.experience} Yrs Exp | {tantrik.languages?.join(', ')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-[#FFD700] text-xl">
                    <span>★</span> <span className="font-bold">{tantrik.rating || '5.0'}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{tantrik.totalReviews || 0} reviews</p>
                </div>
              </div>
            </div>

            <div className="ml-40 mt-6 flex gap-4 border-t border-red-900/30 pt-6">
              <Link to={`/chat/${tantrik._id}`} className="flex-1">
                <button className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                  Chat Now - ₹{tantrik.pricePerMinute}/min
                </button>
              </Link>
              <Link to={`/chat/${tantrik._id}`} className="flex-1">
                <button className="w-full bg-black border border-[#FFD700]/50 text-[#FFD700] py-3 rounded-xl font-bold text-lg hover:bg-[#FFD700]/10 transition-colors">
                  Call Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ABOUT SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 bg-[#110505] border border-red-900/30 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">About {tantrik.name}</h2>
          <p className="text-gray-300 leading-relaxed">
            {tantrik.name} is a highly experienced {tantrik.specializations?.[0]} expert with over {tantrik.experience} years of practice. 
            They have helped thousands of people find solutions to their problems related to {tantrik.specializations?.join(', ')}. 
            Get instant guidance and remedies by connecting with them.
          </p>
        </motion.div>

        {/* REVIEWS SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 bg-[#110505] border border-red-900/30 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-6">User Reviews</h2>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to consult and leave a review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-black/50 border border-red-900/20 p-5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                        {rev.userId?.profileImage ? (
                          <img src={rev.userId.profileImage} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          rev.userId?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <p className="font-bold text-sm text-gray-200">{rev.userId?.name || 'Anonymous User'}</p>
                    </div>
                    <div className="text-[#FFD700] text-sm">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{rev.comment || "No comment provided."}</p>
                  <p className="text-xs text-gray-600 mt-3">{new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#FFD700] mb-12">Why Consult {tantrik.name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '🔮', title: 'Expert Guidance', desc: 'Deep knowledge of Vedic Shastras and Tantra to solve complex life problems.' },
              { icon: '⚡', title: 'Instant Remedies', desc: 'Get immediate solutions and powerful mantras that show results quickly.' },
              { icon: '🔒', title: '100% Confidential', desc: 'Your secrets and problems are safe. Complete privacy is guaranteed.' }
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

      {/* FAQ SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How will I get the remedies?", a: "After the consultation, the Tantrik will provide you with specific mantras, poojas, or gemstone recommendations via chat." },
            { q: "What if I don't like the consultation?", a: "If you face any issue, you can end the chat immediately. You are only charged for the minutes you speak." },
            { q: "Are the solutions guaranteed?", a: "Astrology is a guiding science. Results depend on your faith and karma, but our experts provide the most effective traditional remedies." }
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