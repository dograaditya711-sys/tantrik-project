import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { messaging } from './firebase'; // 🎯 Naya Import
import { getToken, onMessage } from 'firebase/messaging'; // 🎯 Naya Import
import api from './lib/api'; // 🎯 Naya Import

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import FindTantrik from './pages/FindTantrik';
import Wallet from './pages/Wallet';
import AdminPanel from './pages/AdminPanel';
import Chat from './pages/Chat';
import TantrikTest from './pages/TantrikTest';
import TantrikLogin from './pages/TantrikLogin';
import TantrikDashboard from './pages/TantrikDashboard';
import Shop from './pages/Shop';
import Poojas from './pages/Poojas';
import TantrikProfile from './pages/TantrikProfile';
import FreeKundli from './pages/FreeKundli';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import RefundPolicy from './pages/RefundPolicy';
import Horoscope from './pages/Horoscope';
import Calculators from './pages/Calculators';
import KundliMatching from './pages/KundliMatching';
import Compatibility from './pages/Compatibility';
import RashiCalculator from './pages/RashiCalculator';
import YantraTabiz from './pages/YantraTabiz';
import NameRashi from './pages/NameRashi';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  // 🎯 FCM Token Generation & Listener
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, { 
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY 
          });
          
          if (token && localStorage.getItem('token')) {
            await api.post('/api/users/save-fcm-token', { token });
            console.log("FCM Token saved");
          }
        }
      } catch (error) {
        console.log("FCM Error:", error);
      }
    };
    
    if (localStorage.getItem('token')) {
      setupFCM();
    }

    onMessage(messaging, (payload) => {
      // Notification foreground mein aane par
      console.log("Foreground Notification:", payload);
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#050000]">
        <Navbar />
        
        <Toaster 
          theme="dark" 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: { 
              background: '#110505', 
              border: '1px solid rgba(220, 38, 38, 0.3)', 
              color: 'white',
              fontFamily: 'inherit'
            }
          }}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/tantriks" element={<FindTantrik />} />
          <Route path="/tantrik/:id" element={<TantrikProfile />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/poojas" element={<Poojas />} />
          <Route path="/free-kundli" element={<FreeKundli />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/compatibility" element={<Compatibility />} />
          <Route path="/rashi-calculator" element={<RashiCalculator />} />
          <Route path="/yantra-tabiz" element={<YantraTabiz />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/tantrik-test/:id" element={<TantrikTest />} />
          <Route path="/horoscope" element={<Horoscope />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/kundli-matching" element={<KundliMatching />} />
          <Route path="/tantrik-login" element={<TantrikLogin />} />
          <Route path="/tantrik-dashboard" element={<TantrikDashboard />} />
          <Route path="/name-rashi" element={<NameRashi />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;