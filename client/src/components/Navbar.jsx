import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'; // 🎯 Naya Import

const menuItems = [
  { 
    title: 'Consultations', 
    items: [
      { name: 'Chat with Tantrik', link: '/tantriks' },
      { name: 'Call with Tantrik', link: '/tantriks' }
    ] 
  },
  { 
    title: 'Horoscope', 
    items: [
      { name: 'Daily Horoscope', link: '/horoscope' },
      { name: 'Weekly Horoscope', link: '/horoscope' },
      { name: 'Monthly Horoscope', link: '/horoscope' },
      { name: 'Yearly Horoscope', link: '/horoscope' }
    ] 
  },
  { 
    title: 'Free Services', 
    items: [
      { name: 'Free Kundli', link: '/free-kundli' },
      { name: 'Name Rashi (Naam Se)', link: '/name-rashi' },
      { name: 'Kundli Matching', link: '/kundli-matching' },
      { name: 'Compatibility', link: '/compatibility' } // 🎯 Alag Page
    ] 
  },
  { 
    title: 'Calculators', 
    items: [
      { name: 'Love Calculator', link: '/calculators' },
      { name: 'Numerology Calculator', link: '/calculators' },
      { name: 'Rashi Calculator', link: '/rashi-calculator' } // 🎯 Alag Page
    ] 
  },
  { 
    title: 'Shop', 
    items: [
      { name: 'All Products', link: '/shop' },
      { name: 'Rudraksha', link: '/shop' },
      { name: 'Yantra & Tabiz', link: '/yantra-tabiz' } // 🎯 Alag Page
    ] 
  },
];
export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
    setIsMobileMenuOpen(false); 
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully'); // 🎯 Logout par bhi toast
    navigate('/login');
  };

  // 🎯 Naya Function: Dead links ke liye
  const handleComingSoon = (e, name) => {
    e.preventDefault();
    toast.info(`${name} is coming soon!`, {
      description: "Our team is working hard to bring this feature to you."
    });
  };

  return (
    <nav className="bg-[#050000] border-b border-red-900/30 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer z-50 relative flex-shrink-0 group">
          <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.3)] group-hover:scale-105 transition-transform">
            <span className="text-[#FFD700] font-bold text-xl">ॐ</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-wide group-hover:text-[#FFD700] transition-colors hidden sm:block">
            TantraTalk
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-6 text-sm font-medium text-gray-300">
          {menuItems.map((menu) => (
            <div
              key={menu.title}
              className="relative"
              onMouseEnter={() => setActiveDropdown(menu.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="hover:text-[#FFD700] transition-colors py-4 px-1 whitespace-nowrap">
                {menu.title}
              </button>
              
              <AnimatePresence>
                {activeDropdown === menu.title && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 bg-[#110505] border border-red-900/40 rounded-lg shadow-2xl w-56 py-2 z-50"
                  >
                    {menu.items.map((item, index) => (
                      item.link ? (
                        <Link
                          key={index}
                          to={item.link}
                          className="block px-4 py-2 text-sm text-gray-400 hover:bg-red-900/30 hover:text-[#FFD700] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={(e) => handleComingSoon(e, item.name)}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-400 hover:bg-red-900/30 hover:text-[#FFD700] transition-colors"
                        >
                          {item.name}
                        </button>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          {/* BLOGS DIRECT LINK (DESKTOP) */}
          <Link to="/blogs" className="hover:text-[#FFD700] transition-colors py-4 px-1 whitespace-nowrap">
            Blog
          </Link>
        </div>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-shrink-0">
          <Link to="/tantrik-login" className="text-gray-400 hover:text-[#FFD700] text-[10px] xl:text-xs font-bold border border-gray-700 px-2 xl:px-3 py-1.5 rounded-full hover:border-[#FFD700] transition-all whitespace-nowrap">
            Tantrik Login
          </Link>

          {user ? (
            <div className="flex items-center gap-3 xl:gap-4">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-[#FFD700] border border-[#FFD700]/50 px-2 xl:px-4 py-1.5 rounded-full text-[10px] xl:text-sm font-bold hover:bg-[#FFD700]/10 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)] whitespace-nowrap flex items-center gap-1.5">
                  👑 Admin
                </Link>
              )}

              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-red-900/50 border border-red-500 flex items-center justify-center text-xs font-bold text-white group-hover:border-[#FFD700] transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-300 group-hover:text-[#FFD700] text-sm font-medium hidden xl:block transition-colors">
                  Dashboard
                </span>
              </Link>
              
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors whitespace-nowrap">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-300 hover:text-white px-2 py-2 text-sm font-medium transition-colors whitespace-nowrap">
                User Login
              </Link>
            </div>
          )}
          
          <Link to={user ? "/wallet" : "/login"}>
            <button className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-red-400/50 hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2">
              {user ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse hidden xl:block"></span>
                  ₹{user.walletBalance || 0}
                </>
              ) : (
                'Talk Now →'
              )}
            </button>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="lg:hidden flex items-center z-50 relative">
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
             className="text-white focus:outline-none p-2 rounded-lg hover:bg-red-900/20 transition-colors"
           >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
           </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-[#0a0000] border-b border-red-900/30 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6 flex flex-col max-h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
              
              {menuItems.map((menu) => (
                <div key={menu.title}>
                  <p className="text-[#FFD700] font-bold mb-2 text-sm uppercase tracking-wider">{menu.title}</p>
                  <div className="space-y-2 pl-2">
                    {menu.items.map((item, index) => (
                       item.link ? (
                        <Link key={index} to={item.link} className="block text-gray-400 text-sm py-1 hover:text-[#FFD700] transition-colors">
                          {item.name}
                        </Link>
                       ) : (
                        <button 
                          key={index} 
                          onClick={(e) => handleComingSoon(e, item.name)} 
                          className="block text-left w-full text-gray-400 text-sm py-1 hover:text-[#FFD700] transition-colors"
                        >
                          {item.name}
                        </button>
                       )
                    ))}
                  </div>
                </div>
              ))}

              {/* BLOGS LINK (MOBILE) */}
              <div>
                <p className="text-[#FFD700] font-bold mb-2 text-sm uppercase tracking-wider">Blogs</p>
                <div className="space-y-2 pl-2">
                  <Link to="/blogs" className="block text-gray-400 text-sm py-1 hover:text-[#FFD700] transition-colors">
                    Read Articles
                  </Link>
                </div>
              </div>
              
              <div className="pt-6 border-t border-red-900/30 flex flex-col gap-3">
                <Link to="/tantrik-login" className="text-[#FFD700] border border-[#FFD700]/50 text-center py-3 rounded-lg font-bold bg-[#FFD700]/5">
                  🧘‍♂️ Tantrik Login
                </Link>

                {user ? (
                  <>
                    <div className="bg-[#110505] border border-red-900/50 rounded-xl p-4 flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500 flex items-center justify-center font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{user.name}</p>
                          <p className="text-[#FFD700] text-xs">Wallet: ₹{user.walletBalance || 0}</p>
                        </div>
                      </div>
                    </div>

                    {user.role === 'admin' && (
                       <Link to="/admin" className="text-[#FFD700] border border-[#FFD700]/50 text-center py-3 rounded-lg font-bold bg-[#FFD700]/10 flex items-center justify-center gap-2">
                         👑 Admin Panel
                       </Link>
                    )}
                    <Link to="/dashboard" className="text-white border border-gray-600 text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                      My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-red-500 border border-red-500/50 text-center py-3 rounded-lg font-bold hover:bg-red-500/10 transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="bg-gradient-to-r from-red-800 to-red-600 text-white text-center py-3 rounded-lg font-bold shadow-lg shadow-red-900/30">
                    User Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}