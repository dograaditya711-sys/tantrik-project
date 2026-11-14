import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/api/users/blogs/${id}`);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20 text-xl animate-pulse">Loading Article...</div>;
  if (!blog) return <div className="text-white text-center mt-20 text-xl">Blog not found</div>;

  return (
    <div className="min-h-screen bg-[#050000] text-white py-12 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/blogs" className="text-gray-400 hover:text-[#FFD700] mb-6 inline-block">
          ← Back to Blogs
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] border border-red-900/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="w-full h-[400px] relative">
            <img 
              src={blog.image || `https://picsum.photos/800/400?random=${id}`} 
              alt={blog.title} 
              className="w-full h-full object-cover opacity-90" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#110505] to-transparent"></div>
          </div>

          <div className="p-8 md:p-12 relative -mt-20">
            <div className="flex gap-2 mb-4">
              {blog.tags?.map((tag, i) => (
                <span key={i} className="bg-red-900/50 text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold border border-[#FFD700]/30">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">{blog.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 border-b border-red-900/30 pb-6">
              <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>✍️ By Admin</span>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {blog.content}
            </div>
          </div>
        </motion.div>
      </div>

      {/* EXTRA SCROLLABLE SECTIONS */}
      <section className="py-20 bg-black/40 border-y border-red-900/20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6">Did you find this helpful?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Astrology is a vast ocean of knowledge. If you want a personalized solution for your specific problem, our expert astrologers are just a click away.</p>
          <Link to="/tantriks">
            <button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              Talk to Astrologer Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}