import React from 'react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#050000] text-gray-300 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-[#110505] p-8 md:p-12 rounded-2xl border border-red-900/30 shadow-2xl">
        <Link to="/" className="text-[#FFD700] hover:underline mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-[#FFD700] mb-8">Refund & Cancellation Policy</h1>
        
        <div className="space-y-6 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Wallet Recharges</h2>
            <p>All wallet recharges are final. We do not offer refunds for money added to the wallet, as it is used instantly for consultations and services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Failed Transactions</h2>
            <p>If your wallet was debited but the balance was not updated, the amount is usually auto-reversed by Razorpay within 3-5 business days. If not, please contact support with your Order ID.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Chat/Call Disputes</h2>
            <p>If a session disconnects due to a technical issue from the Tantrik's side, or if the Tantrik does not respond within 2 minutes, please report it to support within 24 hours. After verifying, we will refund the deducted amount to your wallet.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Pooja & Product Orders</h2>
            <p>Pooja bookings can be cancelled up to 24 hours before the scheduled time for a full refund. Physical products (Yantras, Rudraksha) can be returned within 7 days of delivery if damaged, subject to verification.</p>
          </section>
        </div>
      </div>
    </div>
  );
}