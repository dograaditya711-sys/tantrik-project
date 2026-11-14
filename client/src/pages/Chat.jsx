import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs'; 
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../lib/api';
import { API_URL } from '../config';

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tantrik, setTantrik] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isChatActive, setIsChatActive] = useState(false);

  const [isTantrikTyping, setIsTantrikTyping] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🎯 Call States
  const [inCall, setInCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const peerRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const myAudioStream = useRef(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', () => peerRef.current = newPeer);
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

  const startChatSession = async (userToken, userId, tantrikId) => {
    try {
      const { data } = await api.post('/api/users/session/start', { tantrikId, type: 'chat' });
      setSessionId(data.sessionId);
      setIsChatActive(true);

      try {
        const historyRes = await api.get(`/api/users/session/${data.sessionId}/messages`);
        if (Array.isArray(historyRes.data)) {
          const formattedHistory = historyRes.data.map(msg => ({
            senderId: msg.sender === 'user' ? userId : (msg.sender === 'system' ? 'system' : tantrikId),
            message: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formattedHistory);
        }
      } catch (historyError) { console.log("No history."); }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start session.");
      navigate('/dashboard');
    }
  };

  const endChatSession = async () => {
    if (!sessionId || !isChatActive) return;
    setIsChatActive(false);
    try {
      const { data } = await api.put(`/api/users/session/end/${sessionId}`, {});
      const updatedUser = { ...user, walletBalance: data.remainingBalance };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(`Chat Ended! Duration: ${data.duration} min. Deducted: ₹${data.totalDeducted}`);
      if (socketRef.current) socketRef.current.disconnect();
      if (inCall) leaveChannel(false); // Don't notify if chat is ending completely
      setShowRating(true);
    } catch (error) { navigate('/dashboard'); }
  };

  const submitReview = async () => {
    if (rating === 0) return toast.error("Please select a rating!");
    try {
      await api.post('/api/users/review', { tantrikId: tantrik._id, rating, comment, sessionId });
      navigate('/dashboard');
    } catch (error) { navigate('/dashboard'); }
  };

  const startVoiceCall = async () => {
    if (!peerRef.current) return toast.error("Calling system initializing...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      myAudioStream.current = stream;
      if (socketRef.current) {
        socketRef.current.emit('call_user', { senderName: user.name, receiverId: tantrik._id, peerId: peerRef.current.id });
      }
      toast.info("Ringing Tantrik...");
    } catch (micError) { toast.error("Microphone blocked!"); }
  };

  // 🎯 Update: Backend ko notify karein jab call cut ho
  const leaveChannel = (notifyBackend = true) => {
    if (myAudioStream.current) {
      myAudioStream.current.getTracks().forEach(track => track.stop());
      myAudioStream.current = null;
    }
    setInCall(false);
    if (notifyBackend && socketRef.current && tantrik) {
      socketRef.current.emit('end_call', { receiverId: tantrik._id });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (isConnected && user && tantrik) {
      socketRef.current.emit('typing', { receiverId: tantrik._id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socketRef.current.emit('stop_typing', { receiverId: tantrik._id }), 2000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '' || !isConnected || timeLeft <= 0) return;
    socketRef.current.emit('stop_typing', { receiverId: tantrik._id });
    socketRef.current.emit('send_message', { senderName: user.name, receiverId: tantrik._id, message: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setInput('');
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) { navigate('/login'); return; }
    setUser(userInfo);

    const fetchTantrikAndStart = async () => {
      try {
        const { data } = await api.get('/api/users/tantriks');
        const selected = data.find(t => t._id === id);
        if (selected) {
          setTantrik(selected);
          await startChatSession(userInfo.token, userInfo._id, selected._id);
        } else { navigate('/tantriks'); }
      } catch (error) { console.error(error); }
    };
    fetchTantrikAndStart();

    if (!socketRef.current) {
      socketRef.current = io(API_URL, { auth: { token: userInfo.token } });
      socketRef.current.on('connect', () => { setIsConnected(true); socketRef.current.emit('join_room'); });
      socketRef.current.on('disconnect', () => setIsConnected(false));
      socketRef.current.on('receive_message', (data) => setMessages((prev) => [...prev, data]));
      socketRef.current.on('user_typing', (data) => { if (data.senderId === id) setIsTantrikTyping(true); });
      socketRef.current.on('user_stopped_typing', (data) => { if (data.senderId === id) setIsTantrikTyping(false); });

      socketRef.current.on('call_accepted', (data) => {
        if (peerRef.current && myAudioStream.current) {
          setInCall(true);
          const call = peerRef.current.call(data.peerId, myAudioStream.current);
          call.on('stream', (remoteStream) => { if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream; });
        }
      });
      socketRef.current.on('call_rejected', () => { toast.error("Tantrik rejected your call."); leaveChannel(false); });
      
      // 🎯 Naya Listener: Jab Tantrik call cut kare
      socketRef.current.on('call_ended', () => { 
        toast.info("Call ended by Tantrik."); 
        leaveChannel(false); 
      });

      socketRef.current.on('session_ended', (data) => {
        toast.warning(`Session auto-ended. Deducted: ₹${data.totalDeducted}`);
        setIsChatActive(false);
        if (socketRef.current) socketRef.current.disconnect();
        setShowRating(true);
      });
      socketRef.current.on('error', (err) => toast.error(err?.message || "Socket error"));
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      leaveChannel(false);
    };
  }, [id, navigate]);

  useEffect(() => {
    let timerId;
    if (timeLeft > 0 && isChatActive) timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    else if (timeLeft === 0 && isChatActive) endChatSession();
    return () => clearTimeout(timerId);
  }, [timeLeft, isChatActive]);

  useEffect(() => {
    if (!sessionId || !tantrik?._id || !socketRef.current) return;
    const interval = setInterval(() => { if (socketRef.current?.connected) socketRef.current.emit('heartbeat', { receiverId: tantrik._id }); }, 30000);
    return () => clearInterval(interval);
  }, [sessionId, tantrik?._id]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (!user || !tantrik) return <div className="text-white text-center mt-20 text-xl font-bold animate-pulse">Connecting...</div>;

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center py-10 px-4 relative z-40">
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-[#110505] border border-red-900/30 rounded-2xl overflow-hidden flex flex-col h-[80vh] shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        <div className="bg-black/80 p-4 border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-[#FFD700] overflow-hidden bg-gray-800"><img src={tantrik.profileImage || `https://i.pravatar.cc/150?img=15`} alt="Tantrik" className="w-full h-full object-cover" /></div>
            <div>
              <h3 className="text-[#FFD700] font-bold text-lg">{tantrik.name}</h3>
              {isTantrikTyping ? <p className="text-xs text-[#FFD700] font-bold animate-pulse">Typing...</p> : <p className={`text-xs font-bold flex items-center gap-1 ${isConnected ? 'text-green-500' : 'text-red-500'}`}><span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>{isConnected ? 'Online' : 'Connecting...'}</p>}
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-sm text-gray-400">Rate: <span className="text-white font-bold">₹{tantrik.pricePerMinute}/min</span></p>
            <div className={`mt-1 border rounded px-3 py-1 text-sm font-mono font-bold ${timeLeft < 60 ? 'bg-red-900 border-red-500 text-red-200 animate-pulse' : 'bg-black/50 border-[#FFD700]/50 text-[#FFD700]'}`}>⏳ {formatTime(timeLeft)}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={startVoiceCall} disabled={!isChatActive || inCall} className="text-xs text-green-500 hover:text-white border border-green-900/50 px-3 py-1 rounded-full disabled:opacity-50">📞 Call</button>
              <button onClick={endChatSession} disabled={!isChatActive} className="text-xs text-red-500 hover:text-white border border-red-900/50 px-3 py-1 rounded-full disabled:opacity-50">End Chat</button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-black/40 space-y-4 custom-scrollbar">
          {messages.length === 0 && <div className="text-center text-gray-500 mt-10 bg-[#110505]/50 p-6 rounded-xl border border-red-900/20"><p className="text-lg">🙏 Chat started with {tantrik.name}.</p></div>}
          {messages.map((msg, index) => {
            if (msg.senderId === 'system') {
              return (
                <div key={index} className="flex justify-center my-2">
                  <div className="bg-gray-800/80 text-gray-300 text-xs px-4 py-1.5 rounded-full border border-gray-700">{msg.message} - {msg.time}</div>
                </div>
              );
            }
            return (
              <div key={index} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-3 rounded-xl text-sm shadow-md ${msg.senderId === user._id ? 'bg-gradient-to-r from-red-800 to-red-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'}`}>
                  <p>{msg.message}</p><span className="text-[10px] text-gray-300 mt-1 block text-right opacity-70">{msg.time}</span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-black/80 border-t border-red-900/30 flex gap-3">
          <input type="text" value={input} onChange={handleInputChange} placeholder={timeLeft <= 0 ? "Time up!" : "Type message..."} disabled={timeLeft <= 0} className="flex-1 bg-[#1a0a0a] border border-red-900/50 rounded-lg px-4 py-3 text-white focus:outline-none disabled:opacity-50" />
          <button type="submit" disabled={!isConnected || timeLeft <= 0} className={`px-6 rounded-lg font-bold transition-all ${isConnected && timeLeft > 0 ? 'bg-gradient-to-r from-red-800 to-red-600 text-white hover:scale-105' : 'bg-gray-700 text-gray-400'}`}>Send</button>
        </form>
      </motion.div>

      {/* RATING MODAL */}
      {showRating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#110505] border border-red-900/50 p-8 rounded-2xl w-full max-w-md text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">Rate your Experience</h2>
            <div className="flex justify-center gap-2 mb-6">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setRating(star)} className={`text-4xl ${rating >= star ? 'text-[#FFD700]' : 'text-gray-600'}`}>★</button>))}</div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your feedback..." className="w-full bg-black border border-red-900/50 rounded-lg px-4 py-3 text-white mb-6 h-24 resize-none" />
            <button onClick={submitReview} className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white font-bold py-3 rounded-lg">Submit Feedback</button>
          </motion.div>
        </div>
      )}

      {/* CALL MODAL */}
      {inCall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[100]">
          <div className="text-center">
            <div className="w-32 h-32 bg-[#110505] border-4 border-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.3)]"><img src={tantrik.profileImage || 'https://i.pravatar.cc/150'} alt="Tantrik" className="w-full h-full object-cover rounded-full" /></div>
            <h2 className="text-3xl text-white font-bold mb-2">On Call with {tantrik.name}</h2>
            <p className="text-gray-400 mb-8 flex items-center justify-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Voice connected... ({formatTime(callSeconds)})</p>
            <button onClick={() => leaveChannel(true)} className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)]">
              <svg className="w-8 h-8 text-white transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.73 0 .97-.65.97-1.19v-3.44c0-.54-.45-.99-.99-.99z" /></svg>
            </button>
            <p className="text-sm text-gray-500 mt-4">Tap to end call</p>
          </div>
        </div>
      )}
    </div>
  );
}