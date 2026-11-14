import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true }
};

export default function Home() {
  return (
    <div className="relative text-white bg-[#050000] min-h-screen overflow-hidden">
      
      {/* ================= MYSTICAL BACKGROUND ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-800/10 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-red-900/20 blur-[100px] rounded-full -z-10"></div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B30000] drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]"
          >
            TantraTalk
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl mt-4 text-gray-300 tracking-widest uppercase"
          >
            India's Most Trusted Tantra & Spiritual Platform
          </motion.p>
          
          <div className="flex gap-4 mt-10">
            <Link to="/tantriks">
              <button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-red-400/50">
                Start Free Chat →
              </button>
            </Link>
            <Link to="/poojas">
              <button className="bg-black/50 backdrop-blur-md border border-[#FFD700]/50 text-[#FFD700] px-10 py-4 rounded-full font-bold text-lg hover:scale-105 hover:bg-[#FFD700]/10 transition-all">
                Book a Pooja
              </button>
            </Link>
          </div>
        </section>

        {/* STATS SECTION */}
        <motion.section {...fadeInUp} className="bg-black/60 backdrop-blur-md py-16 border-y border-red-900/30">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '5Cr+', label: 'Users Guided' },
              { num: '50,000+', label: 'Verified Tantriks' },
              { num: '13+', label: 'Languages' },
              { num: '60+', label: 'Countries' }
            ].map((stat, i) => (
              <div key={i} className="border-r border-red-900/30 last:border-0">
                <h2 className="text-4xl font-bold text-[#FFD700]">{stat.num}</h2>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* BROWSE BY CATEGORY */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-12">
            Find the Right <span className="text-red-500">Tantrik</span> for You
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Love Problem', 'Vashikaran', 'Black Magic Removal', 'Career & Business', 'Grah Shanti', 'Health & Family', 'Court Case', 'Santaan Prapti'].map((cat, i) => (
              <Link to="/tantriks" key={i}>
                <motion.div 
                  {...fadeInUp}
                  whileHover={{ scale: 1.05, borderColor: '#ff0000', boxShadow: '0 0 15px rgba(255,0,0,0.3)' }}
                  className="bg-[#110505]/80 backdrop-blur-sm p-6 rounded-xl border border-red-900/30 cursor-pointer text-center transition-all h-full"
                >
                  <div className="w-12 h-12 mx-auto bg-red-900/30 rounded-full mb-4 flex items-center justify-center text-red-500 text-xl">
                    🔮
                  </div>
                  <h3 className="font-semibold text-lg">{cat}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* BOOK A POOJA */}
        <section className="bg-black/80 backdrop-blur-md py-24 border-y border-red-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-12 text-center">
              Book Powerful <span className="text-[#FFD700]">Poojas & Anushthan</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Maha Mrityunjay Jaap', desc: 'For health and protection from negative energies.' },
                { title: 'Baglamukhi Pooja', desc: 'For victory in legal battles and enemy protection.' },
                { title: 'Kaal Sarp Dosh Shanti', desc: 'To remove obstacles in career and marriage.' }
              ].map((pooja, i) => (
                <motion.div key={i} {...fadeInUp} className="bg-gradient-to-b from-[#1a0505] to-black p-8 rounded-2xl border border-red-900/50 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                   <h3 className="text-2xl font-bold text-[#FFD700] mb-4">{pooja.title}</h3>
                   <p className="text-gray-400 mb-6">{pooja.desc}</p>
                   <Link to="/poojas">
                     <button className="border border-red-500 text-red-500 px-6 py-2 rounded-full text-sm hover:bg-red-500 hover:text-white transition-all">
                       Book Now
                     </button>
                   </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TOP RATED TANTRIKS */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex justify-between items-end mb-12">
            <motion.h2 {...fadeInUp} className="text-4xl font-bold">
              Talk to <span className="text-[#FFD700]">Top Rated</span> Tantriks
            </motion.h2>
            <Link to="/tantriks">
              <button className="text-[#FFD700] border border-[#FFD700]/50 px-4 py-2 rounded-full text-sm hover:bg-[#FFD700] hover:text-black transition-all">View All</button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                {...fadeInUp}
                className="bg-[#110505]/90 backdrop-blur-md p-6 rounded-2xl border border-red-900/30 hover:border-[#FFD700]/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-red-600 overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                    <img src={`https://i.pravatar.cc/150?img=${item+10}`} alt="Tantrik" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">Pandit Sharma {item} <span className="text-green-500 text-xs">● Online</span></h3>
                    <p className="text-red-400 text-sm">Vashikaran Specialist</p>
                    <p className="text-gray-400 text-sm">15 Yrs Exp | Hindi</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-red-900/30">
                  <div>
                    <span className="text-2xl font-bold text-[#FFD700]">₹50</span><span className="text-gray-400 text-sm">/min</span>
                  </div>
                  <div className="flex gap-3">
                    <Link to="/tantriks">
                      <button className="border border-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors">Chat</button>
                    </Link>
                    <Link to="/tantriks">
                      <button className="bg-gradient-to-r from-red-800 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-colors">Call</button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SPIRITUAL ITEMS SHOP */}
        <section className="bg-[#050000] py-24 border-y border-red-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-12">
              Energized <span className="text-[#FFD700]">Spiritual Items</span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {['Rudraksha Mala', 'Shree Yantra', 'Kamakhya Kavach', 'Evil Eye Bracelet'].map((item, i) => (
                 <Link to="/shop" key={i}>
                   <motion.div {...fadeInUp} className="bg-black border border-red-900/30 rounded-xl p-4 text-center group cursor-pointer hover:border-[#FFD700]/50 transition-all h-full">
                     <div className="h-32 bg-gray-900 rounded-lg mb-4 overflow-hidden relative">
                        <img src={`https://picsum.photos/200/200?random=${i+10}`} alt={item} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
                     </div>
                     <h4 className="font-semibold text-[#FFD700]">{item}</h4>
                     <p className="text-sm text-gray-500 mt-1">₹1,100</p>
                   </motion.div>
                 </Link>
               ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-black/60 backdrop-blur-md py-24">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-16 text-center">
              How Does <span className="text-red-500">Consultation</span> Work?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
              <div className="hidden md:block absolute top-8 left-[10%] w-[80%] h-[2px] bg-red-900/50 -z-10"></div>
              {[
                { step: '1', title: 'Create Account', desc: 'Recharge your wallet securely.' },
                { step: '2', title: 'Choose Tantrik', desc: 'Select from verified experts.' },
                { step: '3', title: 'Connect', desc: 'Chat or Call via our platform.' },
                { step: '4', title: 'Get Solution', desc: 'Find remedies for your problems.' }
              ].map((item, i) => (
                <motion.div key={i} {...fadeInUp} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#110505] border border-red-600 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-[0_0_15px_rgba(220,38,38,0.5)]">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2 text-[#FFD700]">{item.title}</h3>
                  <p className="text-gray-400 text-sm px-4">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-4 py-24">
           <motion.h2 {...fadeInUp} className="text-4xl font-bold mb-12 text-center">
            Real People. <span className="text-[#FFD700]">Real Miracles.</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[1, 2].map((item) => (
               <motion.div key={item} {...fadeInUp} className="bg-[#110505]/80 p-8 rounded-2xl border border-red-900/30">
                 <div className="text-[#FFD700] text-2xl mb-4">★★★★★</div>
                 <p className="text-gray-300 italic mb-6">"I was facing severe black magic issues. Pandit ji's remedies worked wonders within 21 days. I am finally at peace."</p>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden border border-red-600">
                     <img src={`https://i.pravatar.cc/150?img=${item+30}`} alt="User" />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#FFD700]">Amar Thakur</h4>
                     <p className="text-gray-500 text-sm">Pune, India</p>
                   </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black py-12 border-t border-red-900/30 text-center text-gray-500 text-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-12">
            <div>
              <h4 className="text-[#FFD700] font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/tantriks" className="hover:text-red-500 transition-colors">Vashikaran</Link></li>
                <li><Link to="/tantriks" className="hover:text-red-500 transition-colors">Black Magic Removal</Link></li>
                <li><Link to="/tantriks" className="hover:text-red-500 transition-colors">Grah Shanti</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#FFD700] font-bold mb-4">Poojas</h4>
              <ul className="space-y-2">
                <li><Link to="/poojas" className="hover:text-red-500 transition-colors">Maha Mrityunjay</Link></li>
                <li><Link to="/poojas" className="hover:text-red-500 transition-colors">Baglamukhi</Link></li>
                <li><Link to="/poojas" className="hover:text-red-500 transition-colors">Kaal Sarp</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#FFD700] font-bold mb-4">Consultations</h4>
              <ul className="space-y-2">
                <li><Link to="/tantriks" className="hover:text-red-500 transition-colors">Chat with Tantrik</Link></li>
                <li><Link to="/tantriks" className="hover:text-red-500 transition-colors">Call with Tantrik</Link></li>
                <li><Link to="/poojas" className="hover:text-red-500 transition-colors">Book a Pooja</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#FFD700] font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                {/* 🎯 Legal Pages Links Added Here */}
                <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="hover:text-red-500 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600">© 2026 TantraTalk. All Rights Reserved.</p>
        </footer>

      </div>
    </div>
  );
}