import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function TantrikTest() {
  const { id } = useParams(); // URL se Tantrik ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Socket connect karein
    socketRef.current = io('http://localhost:5000');
    
    // Tantrik apne ID ke room mein join karega
    socketRef.current.emit('join_room', id); 

    // Message receive karein
    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socketRef.current.disconnect();
  }, [id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Testing ke liye: hum maan rahe hain ki pehla message User ne bheja hai
    const lastMsg = messages[messages.length - 1];
    const receiverId = lastMsg ? lastMsg.senderId : null;

    if (!receiverId) {
       alert("Pehle User ka message aane ka wait karein!");
       return;
    }

    const msgData = {
      senderId: id, // Tantrik ID
      senderName: 'Pandit Shivshankar (Tantrik)',
      receiverId: receiverId, // Jisne message bheja usko reply
      message: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    socketRef.current.emit('send_message', msgData);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-2xl mx-auto border border-gray-600 rounded-lg p-4 bg-black">
        <h1 className="text-2xl font-bold text-green-500 mb-4">Tantrik Console (Testing Mode)</h1>
        <p className="text-sm text-gray-400 mb-4">ID: {id}</p>

        <div className="h-96 overflow-y-auto mb-4 border border-gray-700 p-4 rounded bg-[#110505]">
          {messages.length === 0 && <p className="text-gray-500 text-center mt-10">Waiting for User's message...</p>}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 p-3 rounded-lg max-w-[80%] ${m.senderId === id ? 'bg-green-800 ml-auto text-right' : 'bg-gray-700'}`}>
              <p className="text-xs text-gray-300 mb-1">{m.senderName}</p>
              <p>{m.message}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            className="flex-1 p-3 rounded text-black" 
            placeholder="Reply as Tantrik..."
          />
          <button type="submit" className="bg-green-600 px-6 py-3 rounded font-bold hover:bg-green-500">Send</button>
        </form>
      </div>
    </div>
  );
}