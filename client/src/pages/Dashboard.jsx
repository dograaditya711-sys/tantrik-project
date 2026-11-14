import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';  // 🎯 FIX (H1): api instance — baseURL + token auto

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [poojaBookings, setPoojaBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!token || !userInfo) {
        navigate('/login');
        return;
      }

      try {
        // 🎯 FIX (H1): api.get — Authorization interceptor se auto
        const profileRes = await api.get('/api/users/profile');
        setUser(profileRes.data);

        const updatedUser = { ...profileRes.data, token };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        const sessionsRes = await api.get('/api/users/my-sessions');
        setSessions(sessionsRes.data);

        const ordersRes = await api.get('/api/users/my-orders');
        setOrders(ordersRes.data);

        const poojaRes = await api.get('/api/users/my-poojas');
        setPoojaBookings(poojaRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (loading) return <div className="text-white text-center mt-20 text-xl font-bold animate-pulse">Loading Dashboard...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050000] text-white p-8 relative z-40">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-[#110505] border border-red-900/30 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-red-500 text-[#FFD700]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#FFD700]">Welcome, {user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-red-500 hover:text-white border border-red-500 px-4 py-2 rounded-lg transition-colors">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* WALLET CARD */}
          <div className="md:col-span-1 bg-[#110505] p-8 rounded-2xl border border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            <h2 className="text-gray-400 mb-2 font-semibold">Wallet Balance</h2>
            <p className="text-4xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] mb-6">
              ₹{user.walletBalance || 0}
            </p>
            <Link to="/wallet">
              <button className="w-full bg-gradient-to-r from-red-800 to-red-600 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                + Recharge Wallet
              </button>
            </Link>
          </div>

          {/* RECENT CHATS */}
          <div className="md:col-span-2 bg-[#110505] p-8 rounded-2xl border border-red-900/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-200">Recent Consultations</h2>
              <Link to="/tantriks" className="text-[#FFD700] text-sm hover:underline">Book New →</Link>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <p>No recent chats or calls.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-black/50 border border-red-900/20 p-4 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                        <img
                          src={session.tantrikId?.profileImage || `https://i.pravatar.cc/150?img=15`}
                          alt="Tantrik"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#FFD700]">{session.tantrikId?.name || 'Unknown Tantrik'}</h3>
                        <p className="text-xs text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()} | {session.durationInMinutes} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-500">-₹{session.totalCost}</p>
                      <p className="text-xs text-green-500">{session.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* MY POOJA BOOKINGS */}
          <div className="bg-[#110505] p-8 rounded-2xl border border-red-900/30">
            <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">🪔 My Pooja Bookings</h2>
            {poojaBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No Poojas booked yet.</p>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {poojaBookings.map((booking) => (
                  <div key={booking._id} className="bg-black/50 border border-red-900/20 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-[#FFD700]">{booking.poojaId?.title}</h3>
                      <p className="text-xs text-gray-400">{new Date(booking.preferredDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'Completed' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-[#110505] p-8 rounded-2xl border border-red-900/30">
            <h2 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">🛍️ Recent Shop Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No orders yet.</p>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((order) => (
                  <div key={order._id} className="bg-black/50 border border-red-900/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                      <img src={order.products[0]?.productId?.image || 'https://picsum.photos/100'} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#FFD700] line-clamp-1">{order.products[0]?.productId?.name}</h3>
                      <p className="text-xs text-gray-400">₹{order.totalAmount}</p>
                    </div>
                    <p className="text-xs text-green-500 font-bold">{order.orderStatus}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}