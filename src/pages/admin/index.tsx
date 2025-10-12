import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getContent, saveContent, ContentData } from '../../utils/content';


export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentData>(getContent());
  const [activeTab, setActiveTab] = useState('hero');
  const router = useRouter();

  useEffect(() => {
    // Check authentication from cookies
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const adminAuth = cookies.find(cookie => cookie.trim().startsWith('adminAuth='));
      
      if (adminAuth && adminAuth.split('=')[1] === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  const handleContentChange = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnnouncementChange = (index: number, field: string, value: string) => {
    const newAnnouncements = [...content.announcements];
    newAnnouncements[index] = {
      ...newAnnouncements[index],
      [field]: value
    };
    handleContentChange('announcements', newAnnouncements);
  };

  const addAnnouncement = () => {
    const newAnnouncement = {
      title: '',
      date: new Date().toLocaleDateString(),
      description: '',
      category: 'General'
    };
    handleContentChange('announcements', [...content.announcements, newAnnouncement]);
  };

  const removeAnnouncement = (index: number) => {
    const newAnnouncements = content.announcements.filter((_, i) => i !== index);
    handleContentChange('announcements', newAnnouncements);
  };

  const handleSaveContent = () => {
    saveContent(content);
    alert('Content saved successfully!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'hero' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Hero Section
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'about' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  About Section
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === 'announcements' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Announcements
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'hero' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={content.heroTitle}
                          onChange={(e) => handleContentChange('heroTitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.heroSubtitle}
                          onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">About Section</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Text
                      </label>
                      <textarea
                        value={content.aboutText}
                        onChange={(e) => handleContentChange('aboutText', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'announcements' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Announcements</h2>
                      <button
                        onClick={addAnnouncement}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add Announcement
                      </button>
                    </div>
                    <div className="space-y-6">
                      {content.announcements.map((announcement, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">Announcement {index + 1}</h3>
                            <button
                              onClick={() => removeAnnouncement(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={announcement.title}
                                onChange={(e) => handleAnnouncementChange(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                              </label>
                              <select
                                value={announcement.category}
                                onChange={(e) => handleAnnouncementChange(index, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Event">Event</option>
                                <option value="Health">Health</option>
                                <option value="Notice">Notice</option>
                                <option value="General">General</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={announcement.date}
                                onChange={(e) => handleAnnouncementChange(index, 'date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={announcement.description}
                                onChange={(e) => handleAnnouncementChange(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveContent}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
