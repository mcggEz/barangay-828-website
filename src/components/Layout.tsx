import Navbar from './Navbar';
import ChatButton from './ChatButton';
import { ReactNode, useState, useEffect } from 'react';

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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 lg:py-20">
          <div className="grid md:grid-cols-2 gap-10">
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
                    <p className="text-gray-300 font-medium">Barangay 828, Zone 90</p>
                    <p className="text-gray-300">District V, City of Manila</p>
                    <p className="text-gray-300">Philippines</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-gray-300">(02) 8123-4567</p>
                    <p className="text-gray-400 text-sm">Main Office</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-300">contact@barangay828.gov.ph</p>
                    <p className="text-gray-400 text-sm">General Inquiries</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-300">sk.barangay828@gmail.com</p>
                    <p className="text-gray-400 text-sm">Sangguniang Kabataan</p>
                  </div>
                </div>
                {/* Facebook Link */}
                <div className="flex items-center space-x-3 pt-2">
                  <a
                    href="https://www.facebook.com/profile.php?id=61553500932941"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.494v-9.294H9.847V11.01h2.972V8.414c0-2.943 1.796-4.547 4.42-4.547 1.257 0 2.337.093 2.651.135v3.073h-1.82c-1.428 0-1.704.679-1.704 1.676v2.26h3.408l-.444 3.696h-2.964V24h5.813C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                  </a>
                  <div>
                    <p className="text-gray-300">Follow us on Facebook</p>
                    <p className="text-gray-400 text-sm">Stay connected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Location */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4 border-l-4 border-yellow-400 pl-3">
                Our Location
              </h4>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-600">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.60533089608!2d120.97142807353908!3d14.59062331560943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca631ed72277%3A0x8b1b25aa06a24afd!2sManila%20City%20Hall!5e0!3m2!1sen!2sph!4v1668582736124!5m2!1sen!2sph" 
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