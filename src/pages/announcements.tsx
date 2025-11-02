import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { getContent, ContentData } from '../utils/content';

export default function Announcements() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const data = getContent();
    setContent(data);
    setAnnouncements(data?.announcements || []);
  }, []);

  if (announcements.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Announcements</h1>
            <div className="text-center text-gray-600">No announcements available at the moment.</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Announcements</h1>

          {/* Announcements List */}
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                        {announcement.category}
                      </span>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {announcement.title}
                    </h2>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {announcement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
