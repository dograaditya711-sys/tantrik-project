import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../lib/api'; 

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await api.get('/api/users/profile');
        setUser(profileRes.data);
        setName(profileRes.data.name);
        setPhone(profileRes.data.phone || '');

        const txRes = await api.get('/api/users/wallet/transactions');
        setTransactions(txRes.data);
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (imageFile) formData.append('profileImage', imageFile);

      const { data } = await api.put('/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success("Profile updated successfully!");
      setImageFile(null); 
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      await api.put('/api/users/profile', { password });
      toast.success("Password updated successfully!");
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Failed to update password");
    }
    setLoading(false);
  };

  // 🎯 NEW: Account Delete Function
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.");
    
    if (confirmDelete) {
      try {
        await api.delete('/api/users/delete-account');
        localStorage.clear();
        toast.success("Account deleted successfully");
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete account");
      }
    }
  };

  if (!user) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050000] text-white p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-[#FFD700] mb-8">👤 My Profile</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-red-900/30 pb-4">
          {['profile', 'password', 'transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-red-900 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'profile' ? 'Edit Profile' : tab === 'password' ? 'Change Password' : 'Wallet History'}
            </button>
          ))}
        </div>

        {/* 1. Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-red-900/50 flex items-center justify-center text-3xl font-bold border-2 border-[#FFD700] overflow-hidden">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" />
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Profile Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full bg-black border border-red-900/50 rounded-lg p-2 mt-1 focus:border-[#FFD700] outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900/50 file:text-white hover:file:bg-red-800 cursor-pointer" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-800 to-red-600 py-3 rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* 🎯 NEW: Danger Zone (Account Deletion) */}
            <div className="mt-12 pt-8 border-t border-red-900/30">
              <h3 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. All your data, wallet balance, and chat history will be permanently deleted.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-6 rounded-lg transition-colors w-full"
              >
                Delete My Account
              </button>
            </div>

          </motion.div>
        )}

        {/* 2. Password Tab */}
        {activeTab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/30 max-w-lg">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <div>
                <label className="text-sm text-gray-400">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 mt-1 focus:border-[#FFD700] outline-none" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black py-3 rounded-lg font-bold hover:scale-105 transition-transform disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        )}

        {/* 3. Transactions Tab */}
        {activeTab === 'transactions' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-red-900/30 bg-black/40">
              <h2 className="text-xl font-bold text-[#FFD700]">Wallet Transactions</h2>
              <p className="text-sm text-gray-400">Current Balance: ₹{user.walletBalance}</p>
            </div>

            {transactions.length === 0 ? (
              <p className="p-8 text-center text-gray-500">No transactions found.</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-black/50 text-gray-400 text-sm">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-900/20">
                  {transactions.map(tx => (
                    <tr key={tx._id} className="hover:bg-red-900/10">
                      <td className="p-4 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-300">{tx.description}</td>
                      <td className={`p-4 font-bold ${tx.type === 'recharge' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'recharge' ? '+' : '-'}₹{tx.amount}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}