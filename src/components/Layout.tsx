import Navbar from './Navbar';
import ChatButton from './ChatButton';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col bg-[#053F85]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#022c5e] pt-32 pb-12 text-white overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          {/* First Row - CTA Section */}
          <div className="mb-12 pb-12 border-b border-white/10">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl md:text-5xl tracking-tight text-blue-100/80 font-bold">
                Let's build a better <br /> <span className="text-[#FFC107]">Community.</span>
              </h2>
            </div>
          </div>

          {/* Second Row - Contact, Socials, Quick Links, and Map */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-16">
            {/* Contact Section - 1/3 width */}
            <div className="lg:w-1/3 space-y-3">
              <h4 className="text-[#FFC107] uppercase tracking-widest text-sm text-blue-100/80">Contact</h4>
              <p className="text-lg text-blue-100/80 leading-relaxed">
                Address: Barangay 828, Zone 89<br />
                District V, City of Manila<br />
                Philippines
              </p>
              <p className="text-lg text-blue-100/80 leading-relaxed">
                Email: <a href="mailto:skbarangay828@gmail.com" className="text-blue-100/80 hover:text-white hover:underline">skbarangay828@gmail.com</a>
              </p>
           
            </div>
            
            {/* Socials & Quick Links - 1/3 width */}
            <div className="lg:w-1/3 space-y-3">
              <h4 className="text-[#FFC107] uppercase tracking-widest text-sm text-blue-100/80">Socials</h4>
              <div>
                <a
                  href="https://www.facebook.com/profile.php?id=61553500932941"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.494v-9.294H9.847V11.01h2.972V8.414c0-2.943 1.796-4.547 4.42-4.547 1.257 0 2.337.093 2.651.135v3.073h-1.82c-1.428 0-1.704.679-1.704 1.676v2.26h3.408l-.444 3.696h-2.964V24h5.813C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                </a>
              </div>
              <div className="pt-1">
                <h5 className="text-sm mb-2 text-blue-100/80 uppercase tracking-wider">Quick Links</h5>
                <ul className="space-y-1 text-lg text-blue-100/80">
                  <li>
                    <Link href="/" className="hover:text-white hover:pl-2 transition-all">Home</Link>
                  </li>
                  <li>
                    <Link href="/announcements" className="hover:text-white hover:pl-2 transition-all">Announcements</Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="hover:text-white hover:pl-2 transition-all">Gallery</Link>
                  </li>
               
                  <li>
                    <Link href="/grievance" className="hover:text-white hover:pl-2 transition-all">Grievance</Link>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Map Section - 1/3 width */}
            <div className="lg:w-1/3 space-y-3">
              <h4 className="text-[#FFC107] uppercase tracking-widest text-sm text-blue-100/80">Our Location</h4>
              <div className="rounded-lg overflow-hidden border-2 border-white/20">
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
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-lg text-blue-100/80">
            <p>© {new Date().getFullYear()} Barangay 828 SK Council.</p>
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