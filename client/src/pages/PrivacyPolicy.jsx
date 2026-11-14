import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050000] text-gray-300 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-[#110505] p-8 md:p-12 rounded-2xl border border-red-900/30 shadow-2xl">
        <Link to="/" className="text-[#FFD700] hover:underline mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-[#FFD700] mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>When you register on TantraTalk, we collect your Name, Email Address, and Phone Number. When you use our astrology services, we may collect birth details (Date, Time, Place) to generate Kundlis.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is used to connect you with our Tantriks, process payments via Razorpay, and improve our services. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Data Security</h2>
            <p>We use industry-standard encryption (bcrypt) to protect your passwords. Payments are securely processed by Razorpay; we do not store your credit/debit card details on our servers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Your Rights (DPDP Act 2023)</h2>
            <p>Under the Digital Personal Data Protection Act, you have the right to access, correct, or request deletion of your personal data. You can delete your account from the profile settings or by contacting support.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Grievance Officer</h2>
            <p>If you have any concerns regarding your data privacy, you can contact our Grievance Officer at: <br/>
            <strong>Email:</strong> support@tantratalk.com <br/>
            <strong>Address:</strong> [Aapka Office Address Yahan Daalein]</p>
          </section>
        </div>
      </div>
    </div>
  );
}