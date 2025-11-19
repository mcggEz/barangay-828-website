import Layout from '../components/Layout';
import { Announcement } from '../lib/supabase';
import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

const categoryStyles: Record<string, string> = {
  Health: 'bg-green-100 text-green-800 border border-green-200',
  Event: 'bg-purple-100 text-purple-800 border border-purple-200',
  Notice: 'bg-amber-100 text-amber-800 border border-amber-200',
  General: 'bg-blue-100 text-blue-800 border border-blue-200',
};

interface AnnouncementsPageProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsPageProps) {

  if (announcements.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Announcements</h1>
            <div className="text-center text-gray-600">No announcements available at the moment.</div>
          </div>
        </div>
      </Layout>
    );
  }

  const latestAnnouncement = announcements[0];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 max-w-4xl">
              <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">Community Updates</p>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight">
                Announcements &amp; Important Notices
              </h1>
              <p className="text-blue-100 text-lg max-w-3xl">
                Stay informed with the latest programs, notices, and public advisories from Barangay 828.
                This page is updated in real-time as soon as the council publishes a new announcement.
              </p>
              <div className="flex items-center gap-3 text-sm text-blue-100">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Latest update: <span className="font-semibold">{latestAnnouncement?.date || '—'}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-12">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center flex-wrap gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryStyles[announcement.category] || 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {announcement.category}
                      </span>
                    <span className="text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {announcement.date}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900.mb-4">{announcement.title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {announcement.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<AnnouncementsPageProps> = async () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing.');
    return { props: { announcements: [] } };
  }

  const supabaseServer = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabaseServer
    .from('announcements')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Supabase server error:', error.message);
  }

  return {
    props: {
      announcements: data || [],
    },
  };
};
