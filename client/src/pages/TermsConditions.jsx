import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#050000] text-gray-300 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-[#110505] p-8 md:p-12 rounded-2xl border border-red-900/30 shadow-2xl">
        <Link to="/" className="text-[#FFD700] hover:underline mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-[#FFD700] mb-8">Terms & Conditions</h1>
        
        <div className="space-y-6 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By using TantraTalk, you agree to these terms. If you do not agree, please do not use the platform. You must be at least 18 years old to use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Nature of Services</h2>
            <p>TantraTalk is a consultation platform connecting users with independent astrologers/tantriks. We do not provide medical, legal, or psychological advice. All consultations are for guidance purposes only.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. No Guaranteed Results</h2>
            <p>Astrology and spiritual remedies are subjective. TantraTalk or its tantriks do not guarantee specific outcomes or results. We do not promise cures for diseases or guarantee winning legal cases.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. User Conduct</h2>
            <p>Abusive language, harassment, or inappropriate behavior towards Tantriks or our team will result in immediate account termination without refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Billing & Wallets</h2>
            <p>Users must recharge their wallet to consult. Billing is per minute as displayed on the Tantrik's profile. Time starts from the moment a session is accepted.</p>
          </section>
        </div>
      </div>
    </div>
  );
}