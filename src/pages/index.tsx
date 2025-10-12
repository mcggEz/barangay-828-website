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
      <div className="relative bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <Image
                  src="/sk-logo.png"
                  alt="SK Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className="text-2xl md:text-6xl font-bold mb-6">
              {content?.heroTitle || "Welcome to Barangay 828 SK Council Official Website"}
            </h1>
            {content?.heroSubtitle && (
              <p className="text-xl md:text-2xl mb-6 text-blue-100">
                {content.heroSubtitle}
              </p>
            )}
          
            <Link href="/projects" className="bg-white text-blue-900 px-8 py-3 rounded-md font-semibold hover:bg-blue-100 transition duration-300">
              Our Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Announcements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Recent Announcements</h2>
          <Link href="/announcements" className="text-blue-600 hover:text-blue-800 font-semibold">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(content?.announcements || []).map((announcement, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {announcement.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{announcement.description}</p>
              <div className="text-sm text-gray-500">
                Posted on: {announcement.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Preview Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">About Our Barangay</h2>
            <p className="mt-4 text-lg text-gray-600">
              Learn more about our community and its rich history
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-6">
                {content?.aboutText || "Barangay 828 is committed to providing excellent public service and maintaining a safe, peaceful, and progressive community for all its residents."}
              </p>
              <Link href="/about" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Learn More
              </Link>
            </div>
            <div className="relative h-64 md:h-96">
              <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/sk-logo.png"
                  alt="Barangay 828"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
