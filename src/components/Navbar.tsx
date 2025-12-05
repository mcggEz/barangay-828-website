import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Navbar Component
 * 
 * A reusable navigation bar component with modern design.
 * Features:
 * - Fixed size and styling
 * - Responsive mobile menu
 * - Glass morphism effects
 * 
 * Usage:
 * ```tsx
 * import Navbar from '@/components/Navbar';
 * 
 * <Navbar />
 * ```
 */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Grievance', href: '/grievance' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#053F85]/95 backdrop-blur-md border-b border-white/5 py-4 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10">
            <Image
              src="/sk-logo.png"
              alt="Barangay 828 Logo"
              fill
              className="object-contain group-hover:rotate-12 transition-transform duration-500"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg text-white leading-none">Barangay 828 SK</span>
            <span className="text-blue-200 text-[10px] font-bold tracking-[0.2em] uppercase">Official Website</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 mr-4 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link
            href="/sk-paprint"
            className="px-6 py-3 bg-[#FFC107] hover:bg-[#FFD54F] text-[#053F85] text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] active:scale-95 flex items-center gap-2"
          >
            SK Pa-print! <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#022c5e] md:hidden z-40 border-t border-white/10 shadow-lg shadow-black/40 mobile-menu-enter">
          <div className="flex flex-col px-6 pt-6 pb-6 gap-6">
            <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
                  className="text-lg font-semibold text-white hover:text-[#FFC107] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
            </div>

            <Link
              href="/sk-paprint"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#FFC107] hover:bg-[#FFD54F] text-[#053F85] text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] active:scale-95 gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SK Pa-print! <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 