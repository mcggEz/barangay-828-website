import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Announcement } from '../lib/supabase';
import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, Users, Info, Calendar } from 'lucide-react';

const categoryStyles: Record<string, string> = {
  Health: 'bg-green-100 text-green-800 border border-green-200',
  Event: 'bg-purple-100 text-purple-800 border border-purple-200',
  Notice: 'bg-amber-100 text-amber-800 border border-amber-200',
  General: 'bg-blue-100 text-blue-800 border border-blue-200',
};

interface HomePageProps {
  announcements: Announcement[];
}

// Smooth Reveal Animation Component
const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 blur-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function Home({ announcements }: HomePageProps) {
  return (
    <Layout>
      <div className="antialiased selection:bg-[#FFC107] selection:text-[#053F85] min-h-screen bg-[#053F85] flex flex-col">
        <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#053F85] min-h-screen">
          {/* Dynamic Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-[#022c5e] rounded-full blur-[120px] animate-float opacity-60"></div>
            <div className="absolute top-[20%] left-[-10%] w-[60vw] h-[60vw] bg-[#FFC107]/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full z-10 flex flex-col items-center lg:items-start justify-center gap-8">
            <div className="flex flex-col space-y-8 w-full lg:max-w-3xl">
              <Reveal>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight text-balance mb-4">
                  Barangay 828 <br />
                  <span className="text-[#FFC107]">SK Council</span> <br />
                  Official Website
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed font-light text-balance">
                  Your trusted source for SK updates, youth empowerment, and transparency for a better Barangay 828.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link
                    href="/announcements"
                    className="h-14 px-8 bg-white text-[#053F85] font-medium rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 hover:gap-4 shadow-xl shadow-black/10 group"
                  >
                    Latest Announcements
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                
                </div>
              </Reveal>
            </div>
          </div>

          {/* Infinite Marquee */}
          {announcements.length > 0 && (
            <div className="absolute bottom-0 w-full bg-[#022c5e] border-t border-white/10 py-4 overflow-hidden flex items-center">
              <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-medium text-blue-200/60 uppercase tracking-widest">
                {announcements.slice(0, 3).map((ann) => (
                  <React.Fragment key={ann.id}>
                    <span>📢 {ann.title}</span>
                    <span className="text-[#FFC107]">★</span>
                  </React.Fragment>
                ))}
                {announcements.slice(0, 3).map((ann) => (
                  <React.Fragment key={`dup-${ann.id}`}>
                    <span>📢 {ann.title}</span>
                    <span className="text-[#FFC107]">★</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Transparency Section */}
        <section id="transparency" className="pt-20 pb-24 md:pt-32 md:pb-32 bg-[#053F85] relative">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="mb-20 max-w-2xl">
              <Reveal>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  Transparency
                </h2>
              </Reveal>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Main Large Card */}
              <Reveal className="flex-1">
                <div className="bento-card bg-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col relative overflow-hidden group border border-white/10">
                  <div className="relative z-10">
                    <div className="text-lg text-blue-100/80 leading-relaxed space-y-5">
                      <p>
                        This website is our public window into the work of the Sangguniang Kabataan. Here you can easily view plans, programs, and activities; track updates and reports; and understand how public resources are used to serve our barangay. Our goal is to strengthen trust through openness, involve more young people in local governance, and make information simple, accurate, and accessible to everyone.
                      </p>
                      <p>
                        In line with the SK Reform Act (Republic Act No. 10742) and the Local Government Code of 1991, this site supports transparency, youth participation, and public access to information.
                      </p>
                    </div>
                  </div>
                  <div className="absolute right-[-50px] bottom-[-50px] w-80 h-80 bg-[#022c5e] rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 blur-3xl"></div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        <section id="announcements" className="pt-20 pb-24 md:pt-32 md:pb-32 bg-[#053F85] border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <Reveal>
                <h2 className="text-4xl font-bold text-white tracking-tight">Latest <br />Updates</h2>
              </Reveal>
              <Reveal delay={100}>
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-2 font-semibold text-[#FFC107] hover:gap-4 transition-all"
                >
                  View Archive <ArrowRight size={18} />
                </Link>
              </Reveal>
            </div>

            {announcements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {announcements.slice(0, 6).map((announcement, idx) => {
                  const categoryClass =
                    categoryStyles[announcement.category as keyof typeof categoryStyles] ||
                    'bg-blue-100 text-blue-800 border border-blue-200';

                  const formattedDate = new Date(announcement.date).toLocaleDateString('en-PH', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <Reveal key={announcement.id} delay={idx * 80}>
                      <Link
                        href="/announcements"
                        className="group flex flex-col h-full p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-[#FFC107]/60 transition-all cursor-pointer hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-100/80">
                            <Calendar size={14} className="text-[#FFC107]" />
                            {formattedDate}
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-opacity-90 ${categoryClass}`}
                          >
                            {announcement.category || 'General'}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#FFC107] transition-colors line-clamp-2">
                          {announcement.title}
                        </h3>

                        <p className="mt-3 text-sm text-blue-100/80 line-clamp-3">
                          {announcement.description || 'Click to read the full details of this announcement.'}
                        </p>

                        <div className="mt-5 flex items-center justify-between text-xs text-blue-200/70">
                          <span className="inline-flex items-center gap-1">
                            <Info size={14} className="text-blue-200/80" />
                            Tap to view complete announcement
                          </span>
                          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#FFC107] group-hover:text-[#053F85] transition-all">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              <Reveal delay={150}>
                <div className="text-center text-blue-200/70 py-10 px-6 bg-[#022c5e]/60 border border-dashed border-blue-400/40 rounded-3xl max-w-2xl mx-auto">
                 
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    No announcements yet
                  </h3>
                  <p className="text-sm md:text-base text-blue-100/80 mb-4">
                    We’re preparing updates for upcoming programs, activities, and important barangay reminders.
                    Please check back soon or follow our Facebook page for real-time updates.
                  </p>
                  <a
                    href="https://www.facebook.com/profile.php?id=61553500932941"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#053F85] text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Visit SK 828 on Facebook
                    <ArrowRight size={16} />
                  </a>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* Officials Section */}
        <section id="officials" className="pt-20 pb-24 md:pt-32 md:pb-32 bg-[#053F85]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="mb-20">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-[#FFC107]"></div>
                  <span className="text-[#FFC107] font-bold tracking-widest uppercase text-xs">Members</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                  Meet the <br /> Council.
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Juan Dela Cruz', role: 'Chairperson' },
                { name: 'Maria Santos', role: 'Kagawad' },
                { name: 'Pedro Reyes', role: 'Kagawad' },
                { name: 'Ana Garcia', role: 'Kagawad' },
                { name: 'Jose Mari Lim', role: 'Secretary' },
              ].map((official, idx) => (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="group flex flex-col items-start gap-4 p-4 hover:bg-white/5 hover:rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-black/20 border border-transparent hover:border-white/5">
                    <div className="w-full aspect-[4/5] bg-[#022c5e] rounded-2xl overflow-hidden relative border border-white/5">
                      <div className="absolute inset-0 bg-[#053F85]/20 group-hover:bg-transparent transition-colors"></div>
                      <div className="w-full h-full flex items-center justify-center text-blue-300">
                        <Users size={64} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight group-hover:text-[#FFC107] transition-colors">
                        {official.name}
                      </h4>
                      <p className="text-sm text-blue-200/60 mt-1 font-medium">{official.role}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      </div>
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
