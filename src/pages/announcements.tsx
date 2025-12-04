import Layout from '../components/Layout';
import Image from 'next/image';
import { Announcement } from '../lib/supabase';
import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

interface AnnouncementsPageProps {
  announcements: Announcement[];
}

export default function Announcements({ announcements }: AnnouncementsPageProps) {

  if (announcements.length === 0) {
    return (
      <Layout>
        <div className="bg-[#053F85] min-h-screen pt-20 md:pt-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
            {/* Hero */}
            <section className="text-white mb-10">
              <div className="space-y-6 max-w-4xl">
                <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">
                  Community Updates
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Announcements 
                </h1>
                <p className="text-blue-100/80 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                  This page gathers official statements, program schedules, and important reminders
                  from the SK Council of Barangay 828.
                </p>
              </div>
            </section>

            {/* Empty state */}
            <div className="max-w-2xl mx-auto">
              <div className="text-center text-blue-100/80 py-10 px-6 bg-[#022c5e]/60 border border-dashed border-blue-400/40 rounded-3xl">
                
                <h2 className="text-2xl font-semibold text-white mb-2">
                  No announcements yet
                </h2>
                <p className="text-sm md:text-base text-blue-100/80 mb-4">
                  We’re preparing new updates about youth programs, activities, and barangay advisories.
                  Please check back soon or follow our official Facebook page for real-time announcements.
                </p>
          
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const latestAnnouncement = announcements[0];

  return (
    <Layout>
      <div className="bg-[#053F85] min-h-screen pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-[#053F85] text-white py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="space-y-6 max-w-4xl">
              <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">
                Community Updates
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Announcements 
              </h1>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                Stay informed with the latest programs, projects, and public advisories from Barangay 828.
                This page is updated as soon as the council publishes a new announcement.
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
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <div className="space-y-12">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white/5 backdrop-blur-md rounded-3xl shadow-lg border border-white/10 p-6 md:p-10 hover:bg-white/10 hover:shadow-xl transition-all group"
              >
                {announcement.images && announcement.images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={announcement.images[0]}
                        alt={announcement.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    {announcement.images.length > 1 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {announcement.images.slice(1, 4).map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 bg-gray-900/40"
                          >
                            <Image
                              src={url}
                              alt={`${announcement.title} image ${idx + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {announcement.images.length > 4 && (
                          <span className="text-xs text-blue-100/80 self-center">
                            +{announcement.images.length - 4} more photos
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div className="flex items-center flex-wrap gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        announcement.category === 'Health' 
                          ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                          : announcement.category === 'Event'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                          : announcement.category === 'Notice'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          : 'bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]/30'
                      }`}
                    >
                        {announcement.category}
                      </span>
                    <span className="text-blue-100/80 flex items-center gap-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {announcement.date}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{announcement.title}</h2>
                <p className="text-lg text-blue-100/80 leading-relaxed">{announcement.description}</p>
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
