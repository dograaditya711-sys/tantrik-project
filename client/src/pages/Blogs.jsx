import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get('/api/users/blogs');
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#050000] text-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-900/20 rounded-full blur-[80px] -z-10"></div>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold mb-4">
            Astrology & <span className="text-[#FFD700]">Spiritual Blog</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Read the latest articles, remedies, and insights from our experts.
          </p>
        </div>

        {/* BLOGS GRID */}
        {loading ? (
          <div className="text-center text-[#FFD700] text-xl mt-20 animate-pulse">Loading Articles...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400 text-xl mt-20 bg-[#110505] p-10 rounded-2xl border border-red-900/30 max-w-lg mx-auto">
            <p className="text-4xl mb-4">📝</p>
            <p>No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }} 
                key={blog._id} 
                className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-gray-900 relative">
                  <img 
                    src={blog.image || `https://picsum.photos/400/200?random=${index}`} 
                    alt={blog.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FFD700] border border-[#FFD700]/30">
                    {blog.tags?.[0] || 'Astrology'}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-red-400 mb-2">{new Date(blog.createdAt).toLocaleDateString()}</p>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors">{blog.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">{blog.content}</p>
                  
                  <Link 
                    to={`/blog/${blog._id}`} 
                    className="text-[#FFD700] text-sm font-bold hover:underline inline-block mt-auto"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-12">Why Read Astrology Blogs?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📖', title: 'Learn Ancient Wisdom', desc: 'Discover the deep secrets of Vedic Astrology, Mantras, and spiritual remedies.' },
              { icon: '🧿', title: 'Daily Remedies', desc: 'Simple and powerful tips to remove negative energies from your home and life.' },
              { icon: '🌟', title: 'Planetary Insights', desc: 'Understand how planetary transits affect your daily life, career, and relationships.' }
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