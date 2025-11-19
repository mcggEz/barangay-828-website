import Navbar from './Navbar';
import ChatButton from './ChatButton';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-16 lg:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Contact Information */}
            <div className="animate-fade-in-up">
              <h4 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
                Contact Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-300 font-medium">Barangay 828, Zone 89</p>
                    <p className="text-gray-300">District V, City of Manila</p>
                    <p className="text-gray-300">Philippines</p>
                  </div>
                </div>
               
           
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-300">skbarangay828@gmail.com</p>
                    <p className="text-gray-400 text-sm">SKBarangay828</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Quick Links */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
                Connect With Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61553500932941"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.494v-9.294H9.847V11.01h2.972V8.414c0-2.943 1.796-4.547 4.42-4.547 1.257 0 2.337.093 2.651.135v3.073h-1.82c-1.428 0-1.704.679-1.704 1.676v2.26h3.408l-.444 3.696h-2.964V24h5.813C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                  </a>
                  <div>
                    <p className="text-gray-300 font-medium">Follow us on Facebook</p>
                    <p className="text-gray-400 text-sm">Stay connected</p>
                  </div>
                </div>
                <div className="pt-4">
                  <h5 className="text-md font-semibold mb-3 text-gray-200">Quick Links</h5>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">Home</Link>
                    </li>
                    <li>
                      <Link href="/announcements" className="text-gray-300 hover:text-yellow-400 transition-colors">Announcements</Link>
                    </li>
                    <li>
                      <Link href="/gallery" className="text-gray-300 hover:text-yellow-400 transition-colors">Gallery</Link>
                    </li>
                    <li>
                      <Link href="/projects" className="text-gray-300 hover:text-yellow-400 transition-colors">Projects</Link>
                    </li>
                    <li>
                      <Link href="/grievance" className="text-gray-300 hover:text-yellow-400 transition-colors">Grievance</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Our Location */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h4 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
                Our Location
              </h4>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-600">
                <iframe 
                  src="https://www.google.com/maps?q=1310-C+Burgos+St.,+Paco,+Manila&output=embed" 
                  width="100%" 
                  height="200" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p>&copy; {new Date().getFullYear()} Barangay 828 Sangguniang Kabataan Council, City of Manila. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 bg-yellow-400 p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 z-30 back-to-top-mobile ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      <ChatButton />
    </div>
  );
};

export default Layout; 