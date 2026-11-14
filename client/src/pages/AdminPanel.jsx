import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';  // 🎯 FIX (H1)

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');

  // DATA STATES
  const [stats, setStats] = useState({ totalUsers: 0, totalTantriks: 0, totalSessions: 0, totalRevenue: 0 });
  const [tantriks, setTantriks] = useState([]);
  const [users, setUsers] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FORM STATES
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', specializations: '', experience: '', languages: '', pricePerMinute: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [poojaData, setPoojaData] = useState({ title: '', description: '', price: '', imageFile: null });
  const [productData, setProductData] = useState({ name: '', description: '', price: '', category: '', stock: '', imageFile: null });
  const [blogData, setBlogData] = useState({ title: '', content: '', tags: '', imageFile: null });

  // FETCH DATA
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const { data } = await api.get('/api/admin/stats');
        setStats(data);
      } else if (activeTab === 'tantriks') {
        const { data } = await api.get('/api/admin/tantrik');
        setTantriks(data);
      } else if (activeTab === 'users') {
        const { data } = await api.get('/api/admin/users');
        setUsers(data);
      } else if (activeTab === 'poojas') {
        const { data } = await api.get('/api/admin/poojas');
        setPoojas(data);
      } else if (activeTab === 'bookings') {
        const { data } = await api.get('/api/admin/pooja-bookings');
        setBookings(data);
      } else if (activeTab === 'withdrawals') {
        const { data } = await api.get('/api/admin/withdrawals');
        setWithdrawals(data);
      } else if (activeTab === 'products') {
        const { data } = await api.get('/api/admin/products');
        setProducts(data);
      } else if (activeTab === 'blogs') {
        const { data } = await api.get('/api/admin/blogs');
        setBlogs(data);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // HANDLERS
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTantrikSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()),
        languages: formData.languages.split(',').map(s => s.trim()),
        experience: Number(formData.experience),
        pricePerMinute: Number(formData.pricePerMinute)
      };

      if (isEditing) {
        await api.put(`/api/admin/tantrik/${editId}`, payload);
        toast.success('Tantrik Updated!');
      } else {
        await api.post('/api/admin/tantrik', payload);
        toast.success('Tantrik Added!');
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action Failed');
    }
  };

  const handleDeleteTantrik = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Tantrik?')) return;
    try {
      await api.delete(`/api/admin/tantrik/${id}`);
      toast.success('Tantrik Deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete Failed');
    }
  };

  const handleEditClick = (tantrik) => {
    setFormData({
      name: tantrik.name, email: tantrik.email, phone: tantrik.phone, password: '',
      specializations: tantrik.specializations.join(', '), experience: tantrik.experience,
      languages: tantrik.languages.join(', '), pricePerMinute: tantrik.pricePerMinute
    });
    setIsEditing(true);
    setEditId(tantrik._id);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', specializations: '', experience: '', languages: '', pricePerMinute: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleBlockUser = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/block`, {});
      toast.success("User status updated!");
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handlePoojaSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', poojaData.title);
      formData.append('description', poojaData.description);
      formData.append('price', Number(poojaData.price));
      if (poojaData.imageFile) formData.append('image', poojaData.imageFile);

      // 🎯 FormData — Content-Type override (interceptor default JSON hai)
      await api.post('/api/admin/poojas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Pooja Added Successfully!");
      setPoojaData({ title: '', description: '', price: '', imageFile: null });
      fetchData();
    } catch (error) {
      toast.error("Failed to add Pooja");
    }
  };

  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/pooja-bookings/${id}`, { status: newStatus });
      toast.success("Booking status updated!");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateWithdrawal = async (id, status) => {
    try {
      await api.put(`/api/admin/withdrawals/${id}`, { status });
      toast.success(`Withdrawal ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', Number(productData.price));
      formData.append('category', productData.category);
      formData.append('stock', Number(productData.stock));
      if (productData.imageFile) formData.append('image', productData.imageFile);

      await api.post('/api/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Product Added Successfully!");
      setProductData({ name: '', description: '', price: '', category: '', stock: '', imageFile: null });
      fetchData();
    } catch (error) {
      toast.error("Failed to add Product");
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('tags', blogData.tags);
      if (blogData.imageFile) formData.append('image', blogData.imageFile);

      await api.post('/api/admin/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Blog Published Successfully!");
      setBlogData({ title: '', content: '', tags: '', imageFile: null });
      fetchData();
    } catch (error) {
      toast.error("Failed to publish Blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-white p-8 relative z-40">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-[#FFD700] mb-8">👑 Admin Dashboard</h1>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-red-900/30 pb-4 overflow-x-auto">
          {['stats', 'tantriks', 'users', 'poojas', 'bookings', 'withdrawals', 'products', 'blogs'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); resetForm(); }}
              className={`px-6 py-2 rounded-lg font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-red-900 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              {tab === 'stats' ? 'Platform Stats' :
                tab === 'tantriks' ? 'Manage Tantriks' :
                tab === 'users' ? 'Manage Users' :
                tab === 'poojas' ? 'Manage Poojas' :
                tab === 'bookings' ? 'Pooja Bookings' :
                tab === 'withdrawals' ? 'Withdrawals' :
                tab === 'products' ? 'Manage Shop' : 'Manage Blogs'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-[#FFD700] animate-pulse mt-20 text-xl">Loading Data...</div>
        ) : (
          <>
            {/* TAB 1: STATS */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                  { label: 'Total Tantriks', value: stats.totalTantriks, icon: '🧘‍♂️' },
                  { label: 'Total Sessions', value: stats.totalSessions, icon: '💬' },
                  { label: 'Admin Revenue (30%)', value: `₹${stats.totalRevenue}`, icon: '💰' },
                ].map((item, i) => (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-[#110505] p-6 rounded-2xl border border-red-900/30">
                    <p className="text-3xl mb-2">{item.icon}</p>
                    <h3 className="text-gray-400 mb-1">{item.label}</h3>
                    <p className="text-3xl font-bold text-[#FFD700]">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* TAB 2: TANTRIKS */}
            {activeTab === 'tantriks' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-[#110505] p-6 rounded-2xl border border-red-900/30 h-fit">
                  <h2 className="text-xl font-bold mb-4 text-red-500">{isEditing ? 'Edit Tantrik' : 'Add New Tantrik'}</h2>
                  <form onSubmit={handleTantrikSubmit} className="space-y-3">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="password" name="password" placeholder={isEditing ? "New Password (Leave blank)" : "Password"} value={formData.password} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required={!isEditing} />
                    <input type="text" name="specializations" placeholder="Specializations (comma separated)" value={formData.specializations} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="text" name="languages" placeholder="Languages (comma separated)" value={formData.languages} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="number" name="pricePerMinute" placeholder="Price Per Minute (₹)" value={formData.pricePerMinute} onChange={handleChange} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 bg-red-700 hover:bg-red-600 font-bold py-2 rounded transition-colors">{isEditing ? 'Update' : 'Save'}</button>
                      {isEditing && <button type="button" onClick={resetForm} className="flex-1 bg-gray-700 hover:bg-gray-600 font-bold py-2 rounded transition-colors">Cancel</button>}
                    </div>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-4">All Tantriks ({tantriks.length})</h2>
                  <div className="space-y-3">
                    {tantriks.map((t) => (
                      <div key={t._id} className="bg-[#110505] border border-red-900/30 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-[#FFD700]">{t.name}</h3>
                          <p className="text-sm text-gray-400">{t.email} | ₹{t.pricePerMinute}/min</p>
                          <p className="text-xs text-red-400">{t.specializations.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(t)} className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded text-sm hover:bg-blue-800">Edit</button>
                          <button onClick={() => handleDeleteTantrik(t._id)} className="bg-red-900/50 text-red-200 px-3 py-1 rounded text-sm hover:bg-red-800">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: USERS */}
            {activeTab === 'users' && (
              <div className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black/50 text-gray-400 text-sm">
                    <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Wallet</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-red-900/20">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-red-900/10">
                        <td className="p-4 font-bold">{u.name}</td>
                        <td className="p-4 text-gray-400">{u.email}</td>
                        <td className="p-4 text-[#FFD700]">₹{u.walletBalance}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${u.isBlocked ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleBlockUser(u._id)} className={`px-4 py-1 rounded text-xs font-bold border ${u.isBlocked ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'} transition-colors`}>
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: POOJAS */}
            {activeTab === 'poojas' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-[#110505] p-6 rounded-2xl border border-red-900/30 h-fit">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Add New Pooja</h2>
                  <form onSubmit={handlePoojaSubmit} className="space-y-3">
                    <input type="text" placeholder="Pooja Title" value={poojaData.title} onChange={(e) => setPoojaData({ ...poojaData, title: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <textarea placeholder="Description" value={poojaData.description} onChange={(e) => setPoojaData({ ...poojaData, description: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none h-24 resize-none" required />
                    <input type="number" placeholder="Price (₹)" value={poojaData.price} onChange={(e) => setPoojaData({ ...poojaData, price: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Upload Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setPoojaData({ ...poojaData, imageFile: e.target.files[0] })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-900/50 file:text-red-200 hover:file:bg-red-800 cursor-pointer" />
                    </div>
                    <button type="submit" className="w-full bg-red-700 hover:bg-red-600 font-bold py-2 rounded transition-colors mt-2">Add Pooja</button>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-4">All Poojas ({poojas.length})</h2>
                  <div className="space-y-3">
                    {poojas.map((p) => (
                      <div key={p._id} className="bg-[#110505] border border-red-900/30 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-[#FFD700]">{p.title}</h3>
                          <p className="text-sm text-gray-400">₹{p.price}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    ))}
                    {poojas.length === 0 && <p className="text-gray-500">No poojas added yet.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-black/50 text-gray-400 text-sm">
                    <tr><th className="p-4">User Details</th><th className="p-4">Pooja Name</th><th className="p-4">Amount</th><th className="p-4">Booking Date</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-red-900/20">
                    {bookings.map(b => (
                      <tr key={b._id} className="hover:bg-red-900/10">
                        <td className="p-4">
                          <p className="font-bold text-white">{b.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-gray-400">{b.userId?.email || 'No Email'}</p>
                        </td>
                        <td className="p-4 text-[#FFD700] font-bold">{b.poojaId?.title || 'Deleted Pooja'}</td>
                        <td className="p-4 text-green-500 font-bold">₹{b.amountPaid}</td>
                        <td className="p-4 text-gray-400 text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Completed' ? 'bg-green-900 text-green-200' : b.status === 'Pending' ? 'bg-yellow-900 text-yellow-200' : b.status === 'In-Progress' ? 'bg-blue-900 text-blue-200' : 'bg-red-900 text-red-200'}`}>{b.status}</span>
                        </td>
                        <td className="p-4">
                          <select value={b.status} onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)} className="bg-black border border-red-900/50 rounded p-1.5 text-sm text-white focus:outline-none focus:border-[#FFD700] cursor-pointer">
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (<tr><td colSpan="6" className="p-8 text-center text-gray-500">No Pooja bookings yet.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 6: WITHDRAWALS */}
            {activeTab === 'withdrawals' && (
              <div className="bg-[#110505] border border-red-900/30 rounded-2xl overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-black/50 text-gray-400 text-sm">
                    <tr><th className="p-4">Tantrik Details</th><th className="p-4">Amount</th><th className="p-4">Bank Details</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-red-900/20">
                    {withdrawals.map(w => (
                      <tr key={w._id} className="hover:bg-red-900/10">
                        <td className="p-4"><p className="font-bold text-white">{w.tantrikId?.name || 'Unknown'}</p><p className="text-xs text-gray-400">{w.tantrikId?.email || 'No Email'}</p></td>
                        <td className="p-4 text-green-500 font-bold">₹{w.amount}</td>
                        <td className="p-4 text-xs text-gray-400">Acc: {w.accountNumber}<br />IFSC: {w.ifscCode}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${w.status === 'Approved' ? 'bg-green-900 text-green-200' : w.status === 'Pending' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>{w.status}</span></td>
                        <td className="p-4 flex gap-2">
                          {w.status === 'Pending' && (
                            <>
                              <button onClick={() => handleUpdateWithdrawal(w._id, 'Approved')} className="bg-green-700 px-3 py-1 rounded text-xs font-bold hover:bg-green-600">Approve</button>
                              <button onClick={() => handleUpdateWithdrawal(w._id, 'Rejected')} className="bg-red-700 px-3 py-1 rounded text-xs font-bold hover:bg-red-600">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (<tr><td colSpan="5" className="p-8 text-center text-gray-500">No withdrawal requests yet.</td></tr>)}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 7: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-[#110505] p-6 rounded-2xl border border-red-900/30 h-fit">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Add New Product</h2>
                  <form onSubmit={handleProductSubmit} className="space-y-3">
                    <input type="text" placeholder="Product Name" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <textarea placeholder="Description" value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none h-20 resize-none" required />
                    <input type="number" placeholder="Price (₹)" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="text" placeholder="Category (e.g., Rudraksha)" value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <input type="number" placeholder="Stock Quantity" value={productData.stock} onChange={(e) => setProductData({ ...productData, stock: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Upload Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setProductData({ ...productData, imageFile: e.target.files[0] })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-900/50 file:text-red-200 hover:file:bg-red-800 cursor-pointer" />
                    </div>
                    <button type="submit" className="w-full bg-red-700 hover:bg-red-600 font-bold py-2 rounded transition-colors mt-2">Add Product</button>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-4">All Products ({products.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p._id} className="bg-[#110505] border border-red-900/30 p-4 rounded-xl flex flex-col">
                        <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-32 object-cover rounded mb-2" />
                        <h3 className="font-bold text-[#FFD700] line-clamp-1">{p.name}</h3>
                        <p className="text-sm text-gray-400">₹{p.price} | Stock: {p.stock}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: BLOGS */}
            {activeTab === 'blogs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-[#110505] p-6 rounded-2xl border border-red-900/30 h-fit">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Write New Blog</h2>
                  <form onSubmit={handleBlogSubmit} className="space-y-3">
                    <input type="text" placeholder="Blog Title" value={blogData.title} onChange={(e) => setBlogData({ ...blogData, title: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" required />
                    <textarea placeholder="Content..." value={blogData.content} onChange={(e) => setBlogData({ ...blogData, content: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none h-32 resize-none" required />
                    <input type="text" placeholder="Tags (comma separated, e.g., Vastu, Love)" value={blogData.tags} onChange={(e) => setBlogData({ ...blogData, tags: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm focus:border-red-500 outline-none" />
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Thumbnail Image</label>
                      <input type="file" accept="image/*" onChange={(e) => setBlogData({ ...blogData, imageFile: e.target.files[0] })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-900/50 file:text-red-200 hover:file:bg-red-800 cursor-pointer" />
                    </div>
                    <button type="submit" className="w-full bg-red-700 hover:bg-red-600 font-bold py-2 rounded transition-colors mt-2">Publish Blog</button>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold mb-4">Published Blogs ({blogs.length})</h2>
                  <div className="space-y-3">
                    {blogs.map((b) => (
                      <div key={b._id} className="bg-[#110505] border border-red-900/30 p-4 rounded-xl flex gap-4">
                        {b.image && <img src={b.image} alt={b.title} className="w-20 h-20 object-cover rounded-lg" />}
                        <div>
                          <h3 className="font-bold text-[#FFD700]">{b.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{b.content}</p>
                        </div>
                      </div>
                    ))}
                    {blogs.length === 0 && <p className="text-gray-500">No blogs published yet.</p>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}