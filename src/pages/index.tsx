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
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 animate-bounce-gentle">
                <Image
                  src="/sk-logo.png"
                  alt="SK Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {content?.heroTitle || "Serving the Community of Barangay 828"}
          </h1>
          
          {content?.heroSubtitle && (
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {content.heroSubtitle}
            </p>
          )}
          
          {/* Newsletter CTA in Hero */}
          <div className="max-w-xl mx-auto mt-6">
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-yellow-400 text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-300"
            >
              Join our Newsletter
            </Link>
          </div>
        </div>
      </section>

      {/* Transparency Commitment Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Transparency Website of the SK of Barangay 828!</h2>
          <p className="text-gray-600 leading-relaxed">
            This website is our public window into the work of the Sangguniang Kabataan. Here you can easily
            view plans, programs, and activities; track updates and reports; and understand how public resources
            are used to serve our barangay. Our goal is to strengthen trust through openness, involve more young
            people in local governance, and make information simple, accurate, and accessible to everyone.
          </p>
          <p className="text-gray-500 leading-relaxed mt-4 italic">
            In line with the SK Reform Act (Republic Act No. 10742) and the Local Government Code of 1991,
            this site supports transparency, youth participation, and public access to information.
          </p>
        </div>
      </section>

      {/* Recent Announcements Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest Announcements</h2>
            <p className="text-gray-500">Stay updated with the latest news and events in our barangay.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content?.announcements || []).map((announcement, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{announcement.title}</p>
                    <p className="text-sm text-gray-500">{announcement.date}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{announcement.description}</p>
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {announcement.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 animate-fade-in-up">
            <Link href="/announcements" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
              View All Announcements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Officials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Sangguniang Kabataan Officials</h2>
            <p className="text-gray-500">Meet the dedicated youth leaders of our community.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 text-center">
            {/* SK Chairman */}
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Juan Dela Cruz</h3>
              <p className="text-sm text-blue-600 font-semibold">SK Chairman</p>
            </div>
            
            {/* SK Kagawad 1 */}
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-lg">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Maria Santos</h3>
              <p className="text-sm text-gray-500">SK Kagawad</p>
            </div>
            
            {/* SK Kagawad 2 */}
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-lg">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Pedro Reyes</h3>
              <p className="text-sm text-gray-500">SK Kagawad</p>
            </div>
            
            {/* SK Kagawad 3 */}
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-lg">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Ana Garcia</h3>
              <p className="text-sm text-gray-500">SK Kagawad</p>
            </div>
            
            {/* SK Secretary */}
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-lg">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Jose Mari Lim</h3>
              <p className="text-sm text-gray-500">SK Secretary</p>
            </div>
          </div>
        </div>
      </section>

      {/* SK Laws and Mandates removed per request */}

    </Layout>
  );
}
