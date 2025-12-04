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
      <div className="bg-[#053F85] min-h-screen pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-[#053F85] text-white py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="space-y-6 max-w-4xl">
              <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">Contact Us</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Grievance &amp; Feedback Form
              </h1>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                Use this form to submit complaints, suggestions, or requests to the Sangguniang Kabataan Council of Barangay 828.
                Your honest feedback helps us improve programs and services for the youth in our community.
              </p>
              <p className="text-blue-200/80 text-sm md:text-base max-w-3xl">
                All submissions are treated with respect and confidentiality. For emergencies or urgent safety concerns,
                please contact your barangay hall directly or call local emergency hotlines instead of using this form.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <div className="max-w-3xl mx-auto">

          {successMessage && (
            <div className="mb-6 rounded-lg border border-green-400/30 bg-green-500/20 backdrop-blur-md p-4 text-green-100">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6 md:p-10 space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">Full Name</label>
              <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter your full name" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-white mb-2">Address</label>
              <input id="address" name="address" type="text" value={form.address} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter your address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-white mb-2">Contact Number</label>
                <input id="contactNumber" name="contactNumber" type="tel" value={form.contactNumber} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter contact number" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter your email" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-white mb-2">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white">
                  <option>Complaint</option>
                  <option>Suggestion</option>
                  <option>Request</option>
                  <option>Inquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="preferredContact" className="block text-sm font-semibold text-white mb-2">Preferred Contact</label>
                <select id="preferredContact" name="preferredContact" value={form.preferredContact} onChange={handleChange} className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white">
                  <option>Phone</option>
                  <option>Email</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">Subject</label>
              <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter subject" />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-semibold text-white mb-2">Details</label>
              <textarea id="details" name="details" rows={6} value={form.details} onChange={handleChange} required className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] text-white placeholder-blue-200/50" placeholder="Enter details of your grievance..."></textarea>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button type="submit" disabled={submitting} className="bg-[#FFC107] hover:bg-[#FFD54F] text-[#053F85] px-8 py-3 rounded-full font-semibold disabled:opacity-60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,193,7,0.3)]">
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}


