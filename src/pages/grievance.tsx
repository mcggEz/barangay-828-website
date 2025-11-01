import { useState } from 'react';
import Layout from '../components/Layout';

interface GrievanceFormData {
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  category: string;
  subject: string;
  details: string;
  preferredContact: string;
}

export default function Grievance() {
  const [form, setForm] = useState<GrievanceFormData>({
    fullName: '',
    address: '',
    contactNumber: '',
    email: '',
    category: 'Complaint',
    subject: '',
    details: '',
    preferredContact: 'Phone',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Store locally for now; can be replaced with API call later
      const existing = JSON.parse(localStorage.getItem('brgy828_grievances') || '[]');
      const record = { id: Date.now(), ...form };
      localStorage.setItem('brgy828_grievances', JSON.stringify([record, ...existing]));
      setSuccessMessage('Your grievance has been submitted. We will get back to you soon.');
      setForm({
        fullName: '',
        address: '',
        contactNumber: '',
        email: '',
        category: 'Complaint',
        subject: '',
        details: '',
        preferredContact: 'Phone',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-2 sm:px-3 lg:px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Grievance Form</h1>
          <p className="text-center text-gray-600 mb-10">
            Use this form to submit complaints, suggestions, or requests to the Sangguniang Kabataan Council of Barangay 828.
          </p>

          {successMessage && (
            <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
              <input id="address" name="address" type="text" value={form.address} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
                <input id="contactNumber" name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                  <option>Complaint</option>
                  <option>Suggestion</option>
                  <option>Request</option>
                  <option>Inquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="preferredContact" className="block text-sm font-semibold text-gray-900 mb-2">Preferred Contact</label>
                <select id="preferredContact" name="preferredContact" value={form.preferredContact} onChange={handleChange} className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900">
                  <option>Phone</option>
                  <option>Email</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
              <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-semibold text-gray-900 mb-2">Details</label>
              <textarea id="details" name="details" rows={6} value={form.details} onChange={handleChange} required className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"></textarea>
            </div>

            <div className="pt-4 border-t">
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}


