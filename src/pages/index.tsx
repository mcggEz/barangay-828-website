import Layout from '../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getContent, ContentData } from '../utils/content';

export default function Home() {
  const [content, setContent] = useState<ContentData | null>(null);

  useEffect(() => {
    setContent(getContent());
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white min-h-[calc(100vh-4rem)] flex items-end overflow-hidden shadow-lg">
        {/* Background Shapes */}
        <div className="absolute -top-16 left-1/3 w-96 h-40 bg-blue-700 rounded-full opacity-30 blur-3xl rotate-12"></div>
        <div className="absolute -bottom-12 right-16 w-72 h-32 bg-violet-600 rounded-full opacity-25 blur-3xl -rotate-6"></div>
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-0 text-left pb-8 sm:pb-12 md:pb-16 lg:pb-20 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.95] tracking-tight">
            <span className="block">Welcome to</span>
            <span className="block mt-1 sm:mt-2">Barangay 828 SK Council</span>
          </h1>
        </div>
      </section>

      {/* Transparency Commitment Intro */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 shadow-sm p-10 md:p-12 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">Welcome to the Transparency Portal</h2>
            <p className="text-blue-900/80 leading-relaxed text-base md:text-lg">
              This website is our public window into the work of the Sangguniang Kabataan. View plans, programs, and
              activities; track updates and reports; and understand how public resources are used to serve our barangay.
              Our goal is to strengthen trust through openness, involve more young people in local governance, and make
              information simple, accurate, and accessible to everyone.
            </p>
            <p className="text-blue-900/70 leading-relaxed italic">
              In line with the SK Reform Act (Republic Act No. 10742) and the Local Government Code of 1991, this site
              supports transparency, youth participation, and public access to information.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-6 lg:my-10" />
      </div>

      {/* Recent Announcements Section */}
      <section id="announcements" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3 tracking-tight">Latest Announcements</h2>
            <p className="text-lg text-blue-700 font-medium">Stay updated on news and upcoming events in our barangay.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {(content?.announcements || []).map((announcement, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-yellow-300 p-3 rounded-full shadow-md">
                    <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 text-lg">{announcement.title}</p>
                    <p className="text-xs text-blue-700 font-medium">{announcement.date}</p>
                  </div>
                </div>
                <p className="text-blue-900 mb-5 line-clamp-3 min-h-[60px]">{announcement.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="px-3 py-1 bg-yellow-200 text-blue-900 rounded-full font-semibold">
                    {announcement.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 animate-fade-in-up">
            <Link href="/announcements" className="inline-flex items-center px-7 py-3 rounded-full bg-blue-900 text-yellow-300 font-semibold text-lg shadow-lg hover:bg-blue-800 transition-colors">
              View All Announcements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Officials Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-3 tracking-tight">Sangguniang Kabataan Officials</h2>
            <p className="text-blue-800/80">Meet the dedicated youth leaders of our community.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 text-center">
            {/* SK Chairman */}
            <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-7 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-inner">
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Juan Dela Cruz</h3>
              <p className="text-sm text-blue-700 font-semibold">SK Chairman</p>
            </div>

            {/* SK Kagawad 1 */}
            <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-7 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Maria Santos</h3>
              <p className="text-sm text-blue-700">SK Kagawad</p>
            </div>

            {/* SK Kagawad 2 */}
            <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-7 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Pedro Reyes</h3>
              <p className="text-sm text-blue-700">SK Kagawad</p>
            </div>

            {/* SK Kagawad 3 */}
            <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-7 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Ana Garcia</h3>
              <p className="text-sm text-blue-700">SK Kagawad</p>
            </div>

            {/* SK Secretary */}
            <div className="group rounded-2xl bg-white border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-7 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5 mx-auto">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Jose Mari Lim</h3>
              <p className="text-sm text-blue-700">SK Secretary</p>
            </div>
          </div>
        </div>
      </section>

      {/* SK Laws and Mandates removed per request */}

    </Layout>
  );
}
