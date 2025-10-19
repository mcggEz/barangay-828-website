import { useState } from 'react';
import Layout from '../components/Layout';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const key = 'brgy828_newsletter_subs';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({ email, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(existing));
      setStatus('Subscribed successfully. Salamat!');
      setEmail('');
    } catch {
      setStatus('Saved locally.');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">Join Our Newsletter</h1>
          <p className="text-center text-gray-600 mb-10">Get updates from the Barangay 828 SK Council about announcements, events, and programs.</p>
          {status && <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">{status}</div>}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold">Subscribe</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}


