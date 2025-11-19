import Layout from '../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Announcement } from '../lib/supabase';
import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

const categoryStyles: Record<string, string> = {
  Health: 'bg-green-100 text-green-800 border border-green-200',
  Event: 'bg-purple-100 text-purple-800 border border-purple-200',
  Notice: 'bg-amber-100 text-amber-800 border border-amber-200',
  General: 'bg-blue-100 text-blue-800 border border-blue-200',
};

interface HomePageProps {
  announcements: Announcement[];
}

export default function Home({ announcements }: HomePageProps) {
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const nextAnnouncement = () => {
    if (announcements.length > 0) {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }
  };

  const prevAnnouncement = () => {
    if (announcements.length > 0) {
      setAnnouncementIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
    }
  };

  useEffect(() => {
    if (announcements.length > 0) {
      const interval = setInterval(() => {
        setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  return (
    <Layout>
      {/* Hero Section - Blue Background */}
      <section 
        className="relative text-white overflow-hidden min-h-[calc(100vh-4rem)] flex items-center"
        style={{
          backgroundColor: '#0D47A1',
          backgroundImage: 'linear-gradient(to bottom right, rgba(13, 71, 161, 0.95), rgba(5, 43, 102, 1))',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6">
              Welcome to Barangay 828 SK Council Official Website
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Your trusted source for SK updates, youth empowerment, and transparency for a better, brighter Barangay 828.
            </p>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 lg:p-12 border border-gray-200 shadow-sm">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Welcome to the Transparency Website of the SK of Barangay 828!
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This website is our public window into the work of the Sangguniang Kabataan. Here you can easily view plans, programs, and activities; track updates and reports; and understand how public resources are used to serve our barangay. Our goal is to strengthen trust through openness, involve more young people in local governance, and make information simple, accurate, and accessible to everyone.
            </p>
            <p className="text-gray-600 italic leading-relaxed">
              In line with the SK Reform Act (Republic Act No. 10742) and the Local Government Code of 1991, this site supports transparency, youth participation, and public access to information.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Announcements Carousel */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Latest Announcements</h2>
              <p className="text-gray-600">Stay updated on news and upcoming events in our barangay</p>
            </div>
            <Link 
              href="/announcements" 
              className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              View all
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {announcements.length > 0 ? (
            <div className="relative">
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
                
             
              </div>
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                <div className="absolute -top-16 -right-10 w-56 h-56 bg-white/20 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-12 w-48 h-48 bg-indigo-400/30 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

                <div
                  className="relative flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${announcementIndex * 100}%)` }}
                >
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="min-w-full px-4 md:px-8"
                    >
                      <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 text-white/90">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${categoryStyles[announcement.category] || 'bg-white/10 text-white border border-white/20'}`}>
                              {announcement.category}
                            </span>
                            <span className="text-sm flex items-center gap-2">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {announcement.date}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                          {announcement.title}
                        </h3>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                          {announcement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {announcements.length > 1 && (
                  <>
                    <button
                      onClick={prevAnnouncement}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white rounded-full p-4 shadow-2xl hover:bg-white/30 transition-colors z-10 border border-white/30"
                      aria-label="Previous announcement"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextAnnouncement}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur text-white rounded-full p-4 shadow-2xl hover:bg-white/30 transition-colors z-10 border border-white/30"
                      aria-label="Next announcement"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <div className="flex justify-center items-center gap-2 mt-8">
                      {announcements.map((announcement, index) => (
                        <button
                          key={announcement.id}
                          onClick={() => setAnnouncementIndex(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === announcementIndex
                              ? 'bg-white w-12'
                              : 'bg-white/40 hover:bg-white/70 w-3'
                          }`}
                          aria-label={`Go to announcement ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 py-12 bg-gray-50 rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">No announcements available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for updates!</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link 
              href="/announcements" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              View all announcements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Officials Section */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Sangguniang Kabataan Officials</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Meet the dedicated youth leaders of our community</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
            {[
              { name: 'Juan Dela Cruz', position: 'SK Chairman', highlight: true },
              { name: 'Maria Santos', position: 'SK Kagawad', highlight: false },
              { name: 'Pedro Reyes', position: 'SK Kagawad', highlight: false },
              { name: 'Ana Garcia', position: 'SK Kagawad', highlight: false },
              { name: 'Jose Mari Lim', position: 'SK Secretary', highlight: false },
            ].map((official, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-xl border-2 p-6 hover:shadow-xl transition-all duration-300 text-center ${
                  official.highlight 
                    ? 'border-yellow-400 shadow-lg bg-gradient-to-br from-blue-50 to-white' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-24 h-24 md:w-28 md:h-28 mx-auto mb-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  official.highlight 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-4 border-yellow-400 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-gray-300'
                }`}>
                  <svg className={`w-12 h-12 md:w-14 md:h-14 ${official.highlight ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className={`font-bold mb-2 text-base md:text-lg ${
                  official.highlight ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {official.name}
                </h3>
                <p className={`text-sm md:text-base font-medium ${
                  official.highlight ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {official.position}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
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
    .order('date', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Supabase server error:', error.message);
  }

  return {
    props: {
      announcements: data || [],
    },
  };
};
