import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Announcement, GalleryItem } from '../../lib/supabase';

type GrievanceRecord = {
  id?: string;
  fullName: string;
  address: string;
  contact: string;
  email: string;
  category: string;
  subject: string;
  details: string;
  preferredContact: string;
  submittedAt?: string;
};

function GrievanceTable() {
  const [items, setItems] = useState<GrievanceRecord[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('brgy828_grievances');
      setItems(raw ? (JSON.parse(raw) as GrievanceRecord[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="text-black bg-gray-50 border border-gray-200 rounded-lg p-6">
        No grievance submissions yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-200">
      <table className="min-w-full table-fixed text-sm">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Subject</th>
            <th className="px-4 py-3 text-left font-semibold">Category</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Contact</th>
            <th className="px-4 py-3 text-left font-semibold">Preferred</th>
            <th className="px-4 py-3 text-left font-semibold">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {items.map((g, idx) => (
            <tr key={(g.id ?? idx.toString()) + (g.submittedAt ?? '')} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 align-top font-medium">{g.subject || '—'}</td>
              <td className="px-4 py-3 align-top">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {g.category || '—'}
                </span>
              </td>
              <td className="px-4 py-3 align-top">{g.fullName || '—'}</td>
              <td className="px-4 py-3 align-top text-sm">{[g.contact, g.email].filter(Boolean).join(' | ') || '—'}</td>
              <td className="px-4 py-3 align-top">{g.preferredContact || '—'}</td>
              <td className="px-4 py-3 align-top">
                <div className="max-w-xs whitespace-pre-wrap break-words text-sm text-gray-700">{g.details || '—'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '', category: 'Event', date: '' });
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', image: '', date: '', category: 'Events' });
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setAnnouncementsLoading(true);
    try {
      const response = await fetch('/api/announcements/admin');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Fetch gallery items
  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const response = await fetch('/api/gallery/admin');
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'announcements') {
        fetchAnnouncements();
      } else if (activeTab === 'gallery') {
        fetchGallery();
      }
    }
  }, [isAuthenticated, activeTab]);

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // Announcement handlers
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/announcements/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      });

      if (response.ok) {
        setNewAnnouncement({ title: '', description: '', category: 'Event', date: '' });
        setShowAnnouncementForm(false);
        fetchAnnouncements();
        alert('Announcement created successfully!');
      } else {
        alert('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Error creating announcement');
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;

    try {
      const response = await fetch('/api/announcements/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAnnouncement),
      });

      if (response.ok) {
        setEditingAnnouncement(null);
        fetchAnnouncements();
        alert('Announcement updated successfully!');
      } else {
        alert('Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Error updating announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/announcements/admin?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAnnouncements();
        alert('Announcement deleted successfully!');
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement');
    }
  };

  // Gallery handlers
  const handleCreateGalleryItem = async () => {
    if (!newGalleryItem.title || !newGalleryItem.image || !newGalleryItem.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/gallery/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGalleryItem),
      });

      if (response.ok) {
        setNewGalleryItem({ title: '', image: '', date: '', category: 'Events' });
        setShowGalleryForm(false);
        fetchGallery();
        alert('Gallery item created successfully!');
      } else {
        alert('Failed to create gallery item');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
      alert('Error creating gallery item');
    }
  };

  const handleUpdateGalleryItem = async () => {
    if (!editingGallery) return;

    try {
      const response = await fetch('/api/gallery/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGallery),
      });

      if (response.ok) {
        setEditingGallery(null);
        fetchGallery();
        alert('Gallery item updated successfully!');
      } else {
        alert('Failed to update gallery item');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert('Error updating gallery item');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`/api/gallery/admin?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchGallery();
        alert('Gallery item deleted successfully!');
      } else {
        alert('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Error deleting gallery item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50 relative">
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
          </div>
          <span className="px-3 py-2 text-sm font-medium text-blue-600 capitalize">
            {activeTab}
          </span>
        </div>
      </header>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl transform transition-transform duration-300 z-30 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b border-blue-700 px-4">
          <Image src="/sk-logo.png" alt="Barangay 828 Seal" width={40} height={40} className="rounded-full" />
          <span className="ml-3 text-xl font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleTabChange('announcements')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'announcements'
                ? 'bg-yellow-400 text-blue-900 font-semibold shadow-lg'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Announcements
          </button>
          <button
            onClick={() => handleTabChange('gallery')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'gallery'
                ? 'bg-yellow-400 text-blue-900 font-semibold shadow-lg'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gallery
          </button>
          <button
            onClick={() => handleTabChange('grievance')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'grievance'
                ? 'bg-yellow-400 text-blue-900 font-semibold shadow-lg'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Grievance
          </button>
        </nav>
        <div className="px-4 py-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-red-600 hover:text-white transition-all"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden pt-0 lg:pt-0">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-0 px-0">
          <div className="w-full">
            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="bg-white rounded-none shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-8 py-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Announcements Management</h2>
                      <p className="text-blue-100">Manage community announcements and updates</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={fetchAnnouncements}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                      <button
                        onClick={() => setShowAnnouncementForm(prev => !prev)}
                        className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        {showAnnouncementForm ? 'Close Form' : 'New Announcement'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Announcements List */}
                  {announcementsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading announcements...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-none shadow ring-1 ring-slate-200">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Title</th>
                            <th className="px-4 py-3 text-left font-semibold">Category</th>
                            <th className="px-4 py-3 text-left font-semibold">Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {announcements.map((announcement) => (
                            <tr key={announcement.id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-4 py-3 align-top font-medium">{announcement.title}</td>
                              <td className="px-4 py-3 align-top">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                  {announcement.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 align-top text-gray-600">{announcement.date}</td>
                              <td className="px-4 py-3 align-top text-gray-700 max-w-md">{announcement.description}</td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingAnnouncement({ ...announcement })}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {announcements.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No announcements found. Create your first announcement above.
                        </div>
                      )}
                    </div>
                  )}

                  {showAnnouncementForm && (
                    <div className="bg-blue-50 rounded-none p-6 border border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Create New Announcement</h3>
                        <button
                          onClick={() => setShowAnnouncementForm(false)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Hide form
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                          <input
                            type="text"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter announcement title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                          <select
                            value={newAnnouncement.category}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Event">Event</option>
                            <option value="Health">Health</option>
                            <option value="Notice">Notice</option>
                            <option value="General">General</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                          <input
                            type="text"
                            value={newAnnouncement.date}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., March 15, 2024"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                          <textarea
                            value={newAnnouncement.description}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter announcement description"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCreateAnnouncement}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                      >
                        Create Announcement
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-none shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-8 py-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Gallery Management</h2>
                      <p className="text-blue-100">Manage community gallery images and events</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={fetchGallery}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                      </button>
                      <button
                        onClick={() => setShowGalleryForm(prev => !prev)}
                        className="px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        {showGalleryForm ? 'Close Form' : 'New Gallery Item'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {showGalleryForm && (
                    <div className="bg-blue-50 rounded-none p-6 border border-blue-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Add New Gallery Item</h3>
                        <button
                          onClick={() => setShowGalleryForm(false)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Hide form
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                          <input
                            type="text"
                            value={newGalleryItem.title}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter gallery item title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                          <select
                            value={newGalleryItem.category}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Events">Events</option>
                            <option value="Education">Education</option>
                            <option value="Environment">Environment</option>
                            <option value="Technology">Technology</option>
                            <option value="Sports">Sports</option>
                            <option value="Culture">Culture</option>
                            <option value="Community">Community</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                          <input
                            type="text"
                            value={newGalleryItem.date}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., January 2024"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                          <input
                            type="text"
                            value={newGalleryItem.image}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="/sk-logo.png or full URL"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCreateGalleryItem}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                      >
                        Add Gallery Item
                      </button>
                    </div>
                  )}

                  {/* Gallery Items List */}
                  {galleryLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading gallery items...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-none shadow ring-1 ring-slate-200">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Title</th>
                            <th className="px-4 py-3 text-left font-semibold">Category</th>
                            <th className="px-4 py-3 text-left font-semibold">Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Image</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {galleryItems.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                              <td className="px-4 py-3 align-top font-medium">{item.title}</td>
                              <td className="px-4 py-3 align-top">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 py-3.align-top text-gray-600">{item.date}</td>
                              <td className="px-4 py-3 align-top">
                                <div className="w-16 h-16.relative rounded overflow-hidden">
                                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingGallery({ ...item })}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGalleryItem(item.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {galleryItems.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          No gallery items found. Add your first gallery item above.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grievance Tab */}
            {activeTab === 'grievance' && (
              <div className="bg-white rounded-none shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Grievance Submissions</h2>
                  <p className="text-blue-100">View and manage community grievance submissions</p>
                </div>
                <div className="p-8">
                  <GrievanceTable />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Announcement Modal */}
      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Announcement</h3>
              <button
                onClick={() => setEditingAnnouncement(null)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={editingAnnouncement.category}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Event">Event</option>
                  <option value="Health">Health</option>
                  <option value="Notice">Notice</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="text"
                  value={editingAnnouncement.date}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingAnnouncement.description}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingAnnouncement(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAnnouncement}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gallery Modal */}
      {editingGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Edit Gallery Item</h3>
              <button
                onClick={() => setEditingGallery(null)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingGallery.title}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={editingGallery.category}
                  onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Events">Events</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Culture">Culture</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="text"
                  value={editingGallery.date}
                  onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL *</label>
                <input
                  type="text"
                  value={editingGallery.image}
                  onChange={(e) => setEditingGallery({ ...editingGallery, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editingGallery.image && (
                  <div className="mt-2 w-32 h-32 relative rounded overflow-hidden border">
                    <Image src={editingGallery.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditingGallery(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGalleryItem}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
