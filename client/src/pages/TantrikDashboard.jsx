// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'sonner';
// import AgoraRTC from 'agora-rtc-sdk-ng';
// import api from '../lib/api';       
// import { API_URL } from '../config'; 

// export default function TantrikDashboard() {
//   const [tantrik, setTantrik] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [input, setInput] = useState('');
//   const [activeUser, setActiveUser] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // UI States
//   const [isUserTyping, setIsUserTyping] = useState(false);
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [settingsData, setSettingsData] = useState({
//     name: '', phone: '', experience: '', pricePerMinute: '',
//     accountName: '', accountNumber: '', ifscCode: '', upiId: '',
//     imageFile: null // 🎯 NEW: For image upload
//   });

//   // Agora States
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [inCall, setInCall] = useState(false);
//   const [callClient, setCallClient] = useState(null);
//   const [localAudioTrack, setLocalAudioTrack] = useState(null);

//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const typingTimeoutRef = useRef(null);
//   const navigate = useNavigate();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const tantrikInfo = JSON.parse(localStorage.getItem('tantrikInfo'));
//     const token = localStorage.getItem('tantrikToken');

//     if (!tantrikInfo || tantrikInfo.role !== 'tantrik' || !token) {
//       navigate('/tantrik-login');
//       return;
//     }

//     const fetchDashboardData = async () => {
//       try {
//         const profileRes = await api.get('/api/users/tantrik-profile');
//         setTantrik(profileRes.data);

//         setSettingsData({
//           name: profileRes.data.name || '',
//           phone: profileRes.data.phone || '',
//           experience: profileRes.data.experience || '',
//           pricePerMinute: profileRes.data.pricePerMinute || '',
//           accountName: profileRes.data.bankDetails?.accountName || '',
//           accountNumber: profileRes.data.bankDetails?.accountNumber || '',
//           ifscCode: profileRes.data.bankDetails?.ifscCode || '',
//           upiId: profileRes.data.bankDetails?.upiId || '',
//           imageFile: null
//         });

//         const historyRes = await api.get('/api/users/my-sessions');
//         setSessions(historyRes.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data", error);
//         setTantrik(tantrikInfo);
//       }
//     };
//     fetchDashboardData();

//     socketRef.current = io(API_URL, { auth: { token } });

//     socketRef.current.on('connect', () => {
//       setIsConnected(true);
//       socketRef.current.emit('join_room');
//     });

//     socketRef.current.on('disconnect', () => setIsConnected(false));

//     socketRef.current.on('receive_message', (data) => {
//       setMessages((prev) => [...prev, data]);
//       if (data.senderId !== tantrikInfo._id) {
//         setActiveUser({ id: data.senderId, name: data.senderName });
//       }
//     });

//     socketRef.current.on('user_typing', (data) => {
//       setActiveUser(prevUser => {
//         if (prevUser && data.senderId === prevUser.id) setIsUserTyping(true);
//         return prevUser;
//       });
//     });

//     socketRef.current.on('user_stopped_typing', (data) => {
//       setActiveUser(prevUser => {
//         if (prevUser && data.senderId === prevUser.id) setIsUserTyping(false);
//         return prevUser;
//       });
//     });

//     socketRef.current.on('incoming_call', (data) => {
//       setIncomingCall(data);
//     });

//     socketRef.current.on('session_ended', (data) => {
//       toast.info(`A chat was auto-ended (inactivity).`);
//       setActiveUser(null);
//       api.get('/api/users/tantrik-profile')
//         .then(({ data }) => setTantrik(data))
//         .catch(() => {});
//     });

//     socketRef.current.on('error', (err) => {
//       toast.error(err?.message || "Socket error");
//     });

//     return () => {
//       if (socketRef.current) socketRef.current.disconnect();
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//       if (localAudioTrack) { localAudioTrack.stop(); localAudioTrack.close(); }
//       if (callClient) callClient.leave();
//     };
//   }, [navigate]);

//   useEffect(() => {
//     if (!activeUser?.id || !socketRef.current) return;
//     const interval = setInterval(() => {
//       if (socketRef.current?.connected) {
//         socketRef.current.emit('heartbeat', { receiverId: activeUser.id });
//       }
//     }, 30000);
//     return () => clearInterval(interval);
//   }, [activeUser?.id]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const acceptIncomingCall = async () => {
//     if (!incomingCall) return;
//     try {
//       const { data } = await api.post('/api/users/generate-call-token', { channelName: incomingCall.channelName });
//       const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
//       setCallClient(client);
//       await client.join(data.appID, incomingCall.channelName, data.token, data.uid);

//       const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//       setLocalAudioTrack(audioTrack);
//       await client.publish([audioTrack]);

//       setInCall(true);
//       setIncomingCall(null);
//       toast.success("Call connected!");
//     } catch (error) {
//       toast.error("Mic permission required to join call.");
//     }
//   };

//   const rejectIncomingCall = () => {
//     if (incomingCall && socketRef.current) {
//       socketRef.current.emit('reject_call', { receiverId: incomingCall.senderId });
//       setIncomingCall(null);
//     }
//   };

//   const leaveTantrikCall = async () => {
//     if (localAudioTrack) { localAudioTrack.stop(); localAudioTrack.close(); }
//     if (callClient) { await callClient.leave(); }
//     setInCall(false); setCallClient(null); setLocalAudioTrack(null);
//   };

//   const handleOnlineToggle = async () => {
//     try {
//       const { data } = await api.put('/api/users/tantrik-online-status', {});
//       setTantrik({ ...tantrik, isOnline: data.isOnline });
//       toast.success(`Status: ${data.isOnline ? 'Online' : 'Offline'}`);
//     } catch (error) { toast.error("Failed to change status"); }
//   };

//   const handleWithdrawRequest = async (e) => {
//     e.preventDefault();
//     if (Number(withdrawAmount) < 10) return toast.error("Minimum withdrawal is ₹10");
//     if (Number(withdrawAmount) > tantrik.walletBalance) return toast.error("Amount exceeds balance");

//     try {
//       const { data } = await api.post('/api/users/request-withdrawal', { amount: Number(withdrawAmount) });
//       toast.success(`Withdrawal request of ₹${withdrawAmount} submitted!`);
//       setTantrik({ ...tantrik, walletBalance: data.newBalance });
//       setShowWithdrawModal(false);
//       setWithdrawAmount('');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed');
//     }
//   };

//   const handleUpdateSettings = async (e) => {
//     e.preventDefault();
//     try {
//       // 🎯 NEW: Using FormData for image upload
//       const formData = new FormData();
//       formData.append('name', settingsData.name);
//       formData.append('phone', settingsData.phone);
//       formData.append('experience', settingsData.experience);
//       formData.append('pricePerMinute', settingsData.pricePerMinute);
//       formData.append('bankDetails[accountName]', settingsData.accountName);
//       formData.append('bankDetails[accountNumber]', settingsData.accountNumber);
//       formData.append('bankDetails[ifscCode]', settingsData.ifscCode);
//       formData.append('bankDetails[upiId]', settingsData.upiId);
//       if (settingsData.imageFile) formData.append('profileImage', settingsData.imageFile);

//       const { data } = await api.put('/api/users/tantrik-settings', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       setTantrik(data.tantrik);
//       toast.success("Settings Updated Successfully!");
//       setShowSettingsModal(false);
//     } catch (error) {
//       toast.error("Failed to update settings");
//     }
//   };

//   const handleTyping = (e) => {
//     setInput(e.target.value);
//     if (isConnected && activeUser && tantrik) {
//       socketRef.current.emit('typing', { receiverId: activeUser.id });
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//       typingTimeoutRef.current = setTimeout(() => {
//         socketRef.current.emit('stop_typing', { receiverId: activeUser.id });
//       }, 2000);
//     }
//   };

//   const handleReply = (e) => {
//     e.preventDefault();
//     if (!input.trim() || !activeUser) return;
//     socketRef.current.emit('stop_typing', { receiverId: activeUser.id });
//     socketRef.current.emit('send_message', {
//       senderName: tantrik.name,
//       receiverId: activeUser.id,
//       message: input,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     });
//     setInput('');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('tantrikToken');
//     localStorage.removeItem('tantrikInfo');
//     navigate('/tantrik-login');
//   };

//   if (!tantrik) return <div className="text-white text-center mt-20">Loading...</div>;

//   const chatMessages = messages.filter(m => m.senderId === activeUser?.id || m.receiverId === activeUser?.id);

//   return (
//     <div className="min-h-screen bg-[#050000] text-white p-4 relative z-40">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 h-[90vh]">
//         <div className="w-full md:w-1/3 flex flex-col gap-4">
//           <div className="bg-[#110505] border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
//             <div className="flex items-center gap-4 mb-6">
//               <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] overflow-hidden bg-gray-800">
//                 <img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=15`} alt="Profile" className="w-full h-full object-cover" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-[#FFD700]">{tantrik.name}</h2>
//                 <p className={`text-xs font-bold ${tantrik.isOnline ? 'text-green-500' : 'text-red-500'}`}>
//                   {tantrik.isOnline ? '● Online' : '○ Offline'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg border border-red-900/30 mb-4">
//               <div><p className="text-sm font-bold text-white">Availability Status</p></div>
//               <button onClick={handleOnlineToggle} className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${tantrik.isOnline ? 'bg-green-600' : 'bg-gray-600'}`}>
//                 <span className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${tantrik.isOnline ? 'translate-x-8' : 'translate-x-1'}`}></span>
//               </button>
//             </div>

//             <div className="bg-black/50 p-4 rounded-lg border border-red-900/30 text-center mb-4">
//               <p className="text-sm text-gray-400 mb-1">Total Earnings (70%)</p>
//               <h3 className="text-3xl font-bold text-[#FFD700]">₹{Number(tantrik.walletBalance || 0).toFixed(2)}</h3>
//             </div>

//             <button onClick={() => setShowSettingsModal(true)} className="w-full mb-3 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700">⚙️ Account Settings</button>
//             <button onClick={() => setShowWithdrawModal(true)} className="w-full mb-3 bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-transform">Withdraw Money</button>
//             <button onClick={handleLogout} className="w-full text-sm text-red-500 border border-red-500/50 py-2 rounded-lg hover:bg-red-500 hover:text-white">Logout</button>
//           </div>

//           <div className="bg-[#110505] border border-red-900/30 rounded-xl p-4 flex-1">
//             <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Active Users</h3>
//             {activeUser ? (
//               <div onClick={() => setActiveUser(activeUser)} className="bg-red-900/30 p-3 rounded-lg cursor-pointer border border-red-500/50 hover:bg-red-900/50">
//                 <p className="font-bold text-sm text-white">{activeUser.name}</p>
//               </div>
//             ) : <p className="text-gray-500 text-sm text-center mt-10">No active chats yet.</p>}
//           </div>
//         </div>

//         <div className="w-full md:w-2/3 flex flex-col gap-4">
//           <div className="bg-[#110505] border border-red-900/30 rounded-xl flex flex-col flex-1">
//             {activeUser ? (
//               <>
//                 <div className="p-4 border-b border-red-900/30 bg-black/50 rounded-t-xl flex justify-between items-center">
//                   <div>
//                     <h3 className="font-bold text-[#FFD700]">{activeUser.name}</h3>
//                     {isUserTyping ? (
//                       <p className="text-xs text-[#FFD700] font-bold animate-pulse mt-1">Typing...</p>
//                     ) : (
//                       <p className="text-xs text-green-500">● Live Session</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
//                   {chatMessages.map((m, i) => (
//                     <div key={i} className={`flex ${m.senderId === tantrik._id ? 'justify-end' : 'justify-start'}`}>
//                       <div className={`max-w-[75%] p-3 rounded-xl text-sm shadow-md ${m.senderId === tantrik._id ? 'bg-gradient-to-r from-green-700 to-green-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
//                         <p>{m.message}</p>
//                         <span className="text-[10px] text-gray-300 mt-1 block text-right opacity-70">{m.time}</span>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 <form onSubmit={handleReply} className="p-4 border-t border-red-900/30 bg-black/50 rounded-b-xl flex gap-3">
//                   <input type="text" value={input} onChange={handleTyping} placeholder="Type your reply..." className="flex-1 bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFD700]" />
//                   <button type="submit" className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 rounded-lg font-bold hover:scale-105 transition-transform">Reply</button>
//                 </form>
//               </>
//             ) : (
//               <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
//                 <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">💬</div>
//                 <p>Select a chat to start replying</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-[#110505] border border-red-900/30 rounded-xl p-4 h-40 overflow-y-auto custom-scrollbar">
//             <h3 className="text-sm font-bold text-gray-400 mb-2">Recent Completed Sessions</h3>
//             {sessions.map((sess) => (
//               <div key={sess._id} className="bg-black/50 p-2 rounded flex justify-between items-center text-xs mb-2">
//                 <div>
//                   <p className="text-white font-bold">{sess.userId?.name || 'User'}</p>
//                   <p className="text-gray-400">{sess.durationInMinutes} min</p>
//                 </div>
//                 <p className="text-green-500 font-bold">+₹{(sess.totalCost * 0.70).toFixed(0)}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* INCOMING CALL POPUP */}
//       {incomingCall && !inCall && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]">
//           <div className="bg-[#110505] p-8 rounded-2xl border-2 border-green-500 text-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pulse">
//             <h2 className="text-2xl font-bold text-white mb-2">Incoming Call</h2>
//             <p className="text-[#FFD700] text-lg mb-8">{incomingCall.senderName} is calling you...</p>
//             <div className="flex gap-4 justify-center">
//               <button onClick={rejectIncomingCall} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 text-2xl">❌</button>
//               <button onClick={acceptIncomingCall} className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 animate-bounce text-2xl">📞</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ACTIVE CALL MODAL */}
//       {inCall && (
//         <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
//           <div className="text-center">
//             <div className="w-32 h-32 bg-[#110505] border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.3)]">
//               <span className="text-4xl text-green-500">🎙️</span>
//             </div>
//             <h2 className="text-3xl text-white font-bold mb-2">On Call with {incomingCall?.senderName || activeUser?.name}</h2>
//             <p className="text-gray-400 mb-8 flex items-center justify-center gap-2">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Voice connected...
//             </p>
//             <button onClick={leaveTantrikCall} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.6)]">
//               <svg className="w-8 h-8 text-white transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.73 0 .97-.65.97-1.19v-3.44c0-.54-.45-.99-.99-.99z" /></svg>
//             </button>
//             <p className="text-sm text-gray-500 mt-4">Tap to end call</p>
//           </div>
//         </div>
//       )}

//       {/* SETTINGS MODAL */}
//       <AnimatePresence>
//         {showSettingsModal && (
//           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/50 w-full max-w-lg shadow-2xl">
//               <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Account Settings</h2>
//               <form onSubmit={handleUpdateSettings} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div><label className="text-xs text-gray-400">Name</label><input type="text" value={settingsData.name} onChange={e => setSettingsData({ ...settingsData, name: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                   <div><label className="text-xs text-gray-400">Phone</label><input type="text" value={settingsData.phone} onChange={e => setSettingsData({ ...settingsData, phone: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                   <div><label className="text-xs text-gray-400">Experience</label><input type="number" value={settingsData.experience} onChange={e => setSettingsData({ ...settingsData, experience: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                   <div><label className="text-xs text-gray-400">Price/Min</label><input type="number" value={settingsData.pricePerMinute} onChange={e => setSettingsData({ ...settingsData, pricePerMinute: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                 </div>
                
//                 {/* 🎯 NEW: Image upload field */}
//                 <div>
//                   <label className="text-xs text-gray-400 mb-1 block">Profile Image</label>
//                   <input type="file" accept="image/*" onChange={e => setSettingsData({ ...settingsData, imageFile: e.target.files[0] })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-900/50 file:text-red-200 hover:file:bg-red-800 cursor-pointer" />
//                 </div>

//                 <div className="border-t border-red-900/30 pt-4 mt-4">
//                   <h3 className="text-sm font-bold text-[#FFD700] mb-3">Bank Details</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div><label className="text-xs text-gray-400">Acc Holder</label><input type="text" value={settingsData.accountName} onChange={e => setSettingsData({ ...settingsData, accountName: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                     <div><label className="text-xs text-gray-400">Acc Number</label><input type="text" value={settingsData.accountNumber} onChange={e => setSettingsData({ ...settingsData, accountNumber: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                     <div><label className="text-xs text-gray-400">IFSC</label><input type="text" value={settingsData.ifscCode} onChange={e => setSettingsData({ ...settingsData, ifscCode: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" required /></div>
//                     <div><label className="text-xs text-gray-400">UPI ID</label><input type="text" value={settingsData.upiId} onChange={e => setSettingsData({ ...settingsData, upiId: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white focus:border-[#FFD700] outline-none" /></div>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button type="submit" className="flex-1 bg-[#FFD700] text-black py-2 rounded-lg font-bold">Save Changes</button>
//                   <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 bg-gray-800 py-2 rounded-lg font-bold text-gray-300">Cancel</button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* WITHDRAWAL MODAL */}
//       <AnimatePresence>
//         {showWithdrawModal && (
//           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/50 w-full max-w-md shadow-2xl">
//               <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Withdraw Earnings</h2>
//               <p className="text-sm text-gray-400 mb-6">Available: <span className="text-white font-bold">₹{Number(tantrik.walletBalance).toFixed(2)}</span></p>
//               <form onSubmit={handleWithdrawRequest}>
//                 <input type="number" placeholder="Amount (Min ₹10)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 text-white mb-2 focus:border-[#FFD700] outline-none" required />
//                 <div className="flex gap-3 mt-6">
//                   <button type="submit" className="flex-1 bg-green-600 py-3 rounded-lg font-bold text-white">Submit Request</button>
//                   <button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-gray-300">Cancel</button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs'; 
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';       
import { API_URL } from '../config'; 

export default function TantrikDashboard() {
  const [tantrik, setTantrik] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isUserTyping, setIsUserTyping] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsData, setSettingsData] = useState({
    name: '', phone: '', experience: '', pricePerMinute: '',
    accountName: '', accountNumber: '', ifscCode: '', upiId: '', imageFile: null
  });

  // 🎯 Call States
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const peerRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const myAudioStream = useRef(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', () => peerRef.current = newPeer);

    newPeer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        myAudioStream.current = stream;
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
          setInCall(true);
          setIncomingCall(null);
          toast.success("Call connected!");
        });
      }).catch(err => toast.error("Mic permission required to answer call."));
    });

    return () => { 
      if (newPeer) { try { if (typeof newPeer.destroy === 'function') newPeer.destroy(); } catch(e) {} }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (inCall) {
      setCallSeconds(0);
      interval = setInterval(() => setCallSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  useEffect(() => {
    const tantrikInfo = JSON.parse(localStorage.getItem('tantrikInfo'));
    const token = localStorage.getItem('tantrikToken');

    if (!tantrikInfo || tantrikInfo.role !== 'tantrik' || !token) {
      navigate('/tantrik-login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const profileRes = await api.get('/api/users/tantrik-profile');
        setTantrik(profileRes.data);
        setSettingsData({
          name: profileRes.data.name || '', phone: profileRes.data.phone || '',
          experience: profileRes.data.experience || '', pricePerMinute: profileRes.data.pricePerMinute || '',
          accountName: profileRes.data.bankDetails?.accountName || '', accountNumber: profileRes.data.bankDetails?.accountNumber || '',
          ifscCode: profileRes.data.bankDetails?.ifscCode || '', upiId: profileRes.data.bankDetails?.upiId || '',
          imageFile: null
        });
        const historyRes = await api.get('/api/users/my-sessions');
        setSessions(historyRes.data);
      } catch (error) { setTantrik(tantrikInfo); }
    };
    fetchDashboardData();

    socketRef.current = io(API_URL, { auth: { token } });
    socketRef.current.on('connect', () => { setIsConnected(true); socketRef.current.emit('join_room'); });
    socketRef.current.on('disconnect', () => setIsConnected(false));

    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
      if (data.senderId !== tantrikInfo._id && data.senderId !== 'system') {
        setActiveUser({ id: data.senderId, name: data.senderName });
      }
    });

    socketRef.current.on('user_typing', (data) => setActiveUser(prev => { if (prev && data.senderId === prev.id) setIsUserTyping(true); return prev; }));
    socketRef.current.on('user_stopped_typing', (data) => setActiveUser(prev => { if (prev && data.senderId === prev.id) setIsUserTyping(false); return prev; }));
    socketRef.current.on('incoming_call', (data) => setIncomingCall(data));

    // 🎯 Naya Listener: Jab User call cut kare
    socketRef.current.on('call_ended', () => {
      toast.info("Call ended by User.");
      leaveTantrikCall(false);
    });

    socketRef.current.on('session_ended', (data) => {
      toast.info(`A chat was auto-ended (inactivity).`);
      setActiveUser(null);
      api.get('/api/users/tantrik-profile').then(({ data }) => setTantrik(data)).catch(() => {});
    });

    socketRef.current.on('error', (err) => toast.error(err?.message || "Socket error"));

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (myAudioStream.current) myAudioStream.current.getTracks().forEach(track => track.stop());
    };
  }, [navigate]);

  useEffect(() => {
    if (!activeUser?.id || !socketRef.current) return;
    const interval = setInterval(() => { if (socketRef.current?.connected) socketRef.current.emit('heartbeat', { receiverId: activeUser.id }); }, 30000);
    return () => clearInterval(interval);
  }, [activeUser?.id]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const acceptIncomingCall = async () => {
    if (!incomingCall || !peerRef.current) return;
    try {
      socketRef.current.emit('call_accepted', { receiverId: incomingCall.senderId, peerId: peerRef.current.id });
      toast.info("Connecting call...");
    } catch (error) { toast.error("Call accept failed."); }
  };

  const rejectIncomingCall = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit('reject_call', { receiverId: incomingCall.senderId });
      setIncomingCall(null);
    }
  };

  // 🎯 Update: Backend ko notify karein jab call cut ho
  const leaveTantrikCall = (notifyBackend = true) => {
    if (myAudioStream.current) {
      myAudioStream.current.getTracks().forEach(track => track.stop());
      myAudioStream.current = null;
    }
    setInCall(false);
    if (notifyBackend && socketRef.current && (incomingCall?.senderId || activeUser?.id)) {
      socketRef.current.emit('end_call', { receiverId: incomingCall?.senderId || activeUser?.id });
    }
  };

  const handleOnlineToggle = async () => {
    try {
      const { data } = await api.put('/api/users/tantrik-online-status', {});
      setTantrik({ ...tantrik, isOnline: data.isOnline });
      toast.success(`Status: ${data.isOnline ? 'Online' : 'Offline'}`);
    } catch (error) { toast.error("Failed to change status"); }
  };

  const handleWithdrawRequest = async (e) => {
    e.preventDefault();
    if (Number(withdrawAmount) < 10) return toast.error("Minimum withdrawal is ₹10");
    if (Number(withdrawAmount) > tantrik.walletBalance) return toast.error("Amount exceeds balance");

    try {
      const { data } = await api.post('/api/users/request-withdrawal', { amount: Number(withdrawAmount) });
      setTantrik({ ...tantrik, walletBalance: data.newBalance });
      setShowWithdrawModal(false); setWithdrawAmount('');
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', settingsData.name);
      formData.append('phone', settingsData.phone);
      formData.append('experience', settingsData.experience);
      formData.append('pricePerMinute', settingsData.pricePerMinute);
      formData.append('bankDetails[accountName]', settingsData.accountName);
      formData.append('bankDetails[accountNumber]', settingsData.accountNumber);
      formData.append('bankDetails[ifscCode]', settingsData.ifscCode);
      formData.append('bankDetails[upiId]', settingsData.upiId);
      if (settingsData.imageFile) formData.append('profileImage', settingsData.imageFile);

      const { data } = await api.put('/api/users/tantrik-settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setTantrik(data.tantrik);
      toast.success("Settings Updated Successfully!");
      setShowSettingsModal(false);
    } catch (error) { toast.error("Failed to update settings"); }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (isConnected && activeUser && tantrik) {
      socketRef.current.emit('typing', { receiverId: activeUser.id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socketRef.current.emit('stop_typing', { receiverId: activeUser.id }), 2000);
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUser) return;
    socketRef.current.emit('stop_typing', { receiverId: activeUser.id });
    socketRef.current.emit('send_message', { senderName: tantrik.name, receiverId: activeUser.id, message: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('tantrikToken'); localStorage.removeItem('tantrikInfo'); navigate('/tantrik-login');
  };

  if (!tantrik) return <div className="text-white text-center mt-20">Loading...</div>;
  
  const chatMessages = messages.filter(m => m.senderId === activeUser?.id || m.receiverId === activeUser?.id || m.senderId === 'system');

  return (
    <div className="min-h-screen bg-[#050000] text-white p-4 relative z-40">
      <audio ref={remoteAudioRef} autoPlay className="hidden" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 h-[90vh]">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="bg-[#110505] border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-[#FFD700] overflow-hidden bg-gray-800"><img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=15`} alt="Profile" className="w-full h-full object-cover" /></div>
              <div><h2 className="text-xl font-bold text-[#FFD700]">{tantrik.name}</h2><p className={`text-xs font-bold ${tantrik.isOnline ? 'text-green-500' : 'text-red-500'}`}>{tantrik.isOnline ? '● Online' : '○ Offline'}</p></div>
            </div>

            <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg border border-red-900/30 mb-4">
              <div><p className="text-sm font-bold text-white">Availability Status</p></div>
              <button onClick={handleOnlineToggle} className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${tantrik.isOnline ? 'bg-green-600' : 'bg-gray-600'}`}><span className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${tantrik.isOnline ? 'translate-x-8' : 'translate-x-1'}`}></span></button>
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-red-900/30 text-center mb-4">
              <p className="text-sm text-gray-400 mb-1">Total Earnings (70%)</p><h3 className="text-3xl font-bold text-[#FFD700]">₹{Number(tantrik.walletBalance || 0).toFixed(2)}</h3>
            </div>

            <button onClick={() => setShowSettingsModal(true)} className="w-full mb-3 bg-gray-800 text-white font-bold py-2 rounded-lg hover:bg-gray-700">⚙️ Account Settings</button>
            <button onClick={() => setShowWithdrawModal(true)} className="w-full mb-3 bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-2 rounded-lg hover:scale-105 transition-transform">Withdraw Money</button>
            <button onClick={handleLogout} className="w-full text-sm text-red-500 border border-red-500/50 py-2 rounded-lg hover:bg-red-500 hover:text-white">Logout</button>
          </div>

          <div className="bg-[#110505] border border-red-900/30 rounded-xl p-4 flex-1">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Active Users</h3>
            {activeUser ? <div onClick={() => setActiveUser(activeUser)} className="bg-red-900/30 p-3 rounded-lg cursor-pointer border border-red-500/50 hover:bg-red-900/50"><p className="font-bold text-sm text-white">{activeUser.name}</p></div> : <p className="text-gray-500 text-sm text-center mt-10">No active chats yet.</p>}
          </div>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="bg-[#110505] border border-red-900/30 rounded-xl flex flex-col flex-1">
            {activeUser ? (
              <>
                <div className="p-4 border-b border-red-900/30 bg-black/50 rounded-t-xl flex justify-between items-center">
                  <div><h3 className="font-bold text-[#FFD700]">{activeUser.name}</h3>{isUserTyping ? <p className="text-xs text-[#FFD700] font-bold animate-pulse mt-1">Typing...</p> : <p className="text-xs text-green-500">● Live Session</p>}</div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                  {chatMessages.map((m, i) => {
                    if (m.senderId === 'system') return <div key={i} className="flex justify-center my-2"><div className="bg-gray-800/80 text-gray-300 text-xs px-4 py-1.5 rounded-full border border-gray-700">{m.message} - {m.time}</div></div>;
                    return (
                      <div key={i} className={`flex ${m.senderId === tantrik._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-xl text-sm shadow-md ${m.senderId === tantrik._id ? 'bg-gradient-to-r from-green-700 to-green-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}><p>{m.message}</p><span className="text-[10px] text-gray-300 mt-1 block text-right opacity-70">{m.time}</span></div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleReply} className="p-4 border-t border-red-900/30 bg-black/50 rounded-b-xl flex gap-3">
                  <input type="text" value={input} onChange={handleTyping} placeholder="Type your reply..." className="flex-1 bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white outline-none" />
                  <button type="submit" className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 rounded-lg font-bold">Reply</button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500"><div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">💬</div><p>Select a chat to start replying</p></div>
            )}
          </div>

          <div className="bg-[#110505] border border-red-900/30 rounded-xl p-4 h-40 overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Recent Completed Sessions</h3>
            {sessions.map((sess) => <div key={sess._id} className="bg-black/50 p-2 rounded flex justify-between items-center text-xs mb-2"><div><p className="text-white font-bold">{sess.userId?.name || 'User'}</p><p className="text-gray-400">{sess.durationInMinutes} min</p></div><p className="text-green-500 font-bold">+₹{(sess.totalCost * 0.70).toFixed(0)}</p></div>)}
          </div>
        </div>
      </div>

      {/* INCOMING CALL POPUP */}
      {incomingCall && !inCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-[#110505] p-8 rounded-2xl border-2 border-green-500 text-center shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-pulse">
            <h2 className="text-2xl font-bold text-white mb-2">Incoming Call</h2><p className="text-[#FFD700] text-lg mb-8">{incomingCall.senderName} is calling you...</p>
            <div className="flex gap-4 justify-center">
              <button onClick={rejectIncomingCall} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl">❌</button>
              <button onClick={acceptIncomingCall} className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white animate-bounce text-2xl">📞</button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CALL MODAL */}
      {inCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <div className="text-center">
            <div className="w-32 h-32 bg-[#110505] border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.3)]"><span className="text-4xl text-green-500">🎙️</span></div>
            <h2 className="text-3xl text-white font-bold mb-2">On Call with {incomingCall?.senderName || activeUser?.name}</h2>
            <p className="text-gray-400 mb-8 flex items-center justify-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Voice connected... ({Math.floor(callSeconds / 60)}:{(callSeconds % 60).toString().padStart(2, '0')})</p>
            <button onClick={() => leaveTantrikCall(true)} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)]">
              <svg className="w-8 h-8 text-white transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.73 0 .97-.65.97-1.19v-3.44c0-.54-.45-.99-.99-.99z" /></svg>
            </button>
            <p className="text-sm text-gray-500 mt-4">Tap to end call</p>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/50 w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold text-[#FFD700] mb-6">Account Settings</h2>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-400">Name</label><input type="text" value={settingsData.name} onChange={e => setSettingsData({ ...settingsData, name: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                  <div><label className="text-xs text-gray-400">Phone</label><input type="text" value={settingsData.phone} onChange={e => setSettingsData({ ...settingsData, phone: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                  <div><label className="text-xs text-gray-400">Experience</label><input type="number" value={settingsData.experience} onChange={e => setSettingsData({ ...settingsData, experience: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                  <div><label className="text-xs text-gray-400">Price/Min</label><input type="number" value={settingsData.pricePerMinute} onChange={e => setSettingsData({ ...settingsData, pricePerMinute: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                </div>
                <div><label className="text-xs text-gray-400 mb-1 block">Profile Image</label><input type="file" accept="image/*" onChange={e => setSettingsData({ ...settingsData, imageFile: e.target.files[0] })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" /></div>
                <div className="border-t border-red-900/30 pt-4 mt-4">
                  <h3 className="text-sm font-bold text-[#FFD700] mb-3">Bank Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-400">Acc Holder</label><input type="text" value={settingsData.accountName} onChange={e => setSettingsData({ ...settingsData, accountName: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                    <div><label className="text-xs text-gray-400">Acc Number</label><input type="text" value={settingsData.accountNumber} onChange={e => setSettingsData({ ...settingsData, accountNumber: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                    <div><label className="text-xs text-gray-400">IFSC</label><input type="text" value={settingsData.ifscCode} onChange={e => setSettingsData({ ...settingsData, ifscCode: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" required /></div>
                    <div><label className="text-xs text-gray-400">UPI ID</label><input type="text" value={settingsData.upiId} onChange={e => setSettingsData({ ...settingsData, upiId: e.target.value })} className="w-full bg-black border border-red-900/50 rounded p-2 text-sm text-white" /></div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 bg-[#FFD700] text-black py-2 rounded-lg font-bold">Save Changes</button><button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 bg-gray-800 py-2 rounded-lg font-bold text-gray-300">Cancel</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAWAL MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#110505] p-8 rounded-2xl border border-red-900/50 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Withdraw Earnings</h2>
              <p className="text-sm text-gray-400 mb-6">Available: <span className="text-white font-bold">₹{Number(tantrik.walletBalance).toFixed(2)}</span></p>
              <form onSubmit={handleWithdrawRequest}>
                <input type="number" placeholder="Amount (Min ₹10)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-black border border-red-900/50 rounded-lg p-3 text-white mb-2" required />
                <div className="flex gap-3 mt-6"><button type="submit" className="flex-1 bg-green-600 py-3 rounded-lg font-bold text-white">Submit</button><button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-gray-800 py-3 rounded-lg font-bold text-gray-300">Cancel</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}