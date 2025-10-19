import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Minimal admin page without site navbar/footer
import { getContent, saveContent, ContentData } from '../../utils/content';

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

//

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
    <table className="min-w-full table-fixed text-sm">
      <thead className="bg-slate-50 text-black sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-left font-semibold">Subject</th>
          <th className="px-4 py-3 text-left font-semibold">Category</th>
          <th className="px-4 py-3 text-left font-semibold">Name</th>
          <th className="px-4 py-3 text-left font-semibold">Contact</th>
          <th className="px-4 py-3 text-left font-semibold">Preferred</th>
          <th className="px-4 py-3 text-left font-semibold">Details</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {items.map((g, idx) => (
          <tr key={(g.id ?? idx.toString()) + (g.submittedAt ?? '')} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
            <td className="px-4 py-3 align-top">{g.subject || '—'}</td>
            <td className="px-4 py-3 align-top">{g.category || '—'}</td>
            <td className="px-4 py-3 align-top">{g.fullName || '—'}</td>
            <td className="px-4 py-3 align-top">{[g.contact, g.email].filter(Boolean).join(' | ') || '—'}</td>
            <td className="px-4 py-3 align-top">{g.preferredContact || '—'}</td>
            <td className="px-4 py-3 align-top">
              <div className="max-w-xs whitespace-pre-wrap break-words text-sm text-black">{g.details || '—'}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentData>(getContent());
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleContentChange = (field: keyof ContentData, value: unknown) => {
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

  // addAnnouncement removed; table-only editing in place

  const removeAnnouncement = (index: number) => {
    const newAnnouncements = content.announcements.filter((_, i) => i !== index);
    handleContentChange('announcements', newAnnouncements);
  };

  // Save is performed elsewhere if needed; keep content reactive

  // Removed unused document handlers and upload state

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      status: 'Planning'
    };
    setContent(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (index: number) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addChatbotResponse = () => {
    const newResponse = {
      keyword: '',
      response: ''
    };
    setContent(prev => ({
      ...prev,
      chatbotPrompts: {
        ...prev.chatbotPrompts,
        defaultResponses: [...prev.chatbotPrompts.defaultResponses, newResponse]
      }
    }));
  };

  const removeChatbotResponse = (index: number) => {
    setContent(prev => ({
      ...prev,
      chatbotPrompts: {
        ...prev.chatbotPrompts,
        defaultResponses: prev.chatbotPrompts.defaultResponses.filter((_, i) => i !== index)
      }
    }));
  };

  const updateChatbotResponse = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      chatbotPrompts: {
        ...prev.chatbotPrompts,
        defaultResponses: prev.chatbotPrompts.defaultResponses.map((response, i) => 
          i === index ? { ...response, [field]: value } : response
        )
      }
    }));
  };

  const handleSaveContent = () => {
    saveContent(content);
    alert('Content saved successfully!');
  };

  // Removed chatbot handlers; chatbot editor not in sidebar

  // Removed contact info editor

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-black">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-slate-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 flex-shrink-0 bg-blue-900 text-white flex flex-col">
          <div className="flex items-center justify-center h-20 border-b border-blue-800 px-4">
            <img src="/sk-logo.png" alt="Barangay 828 Seal" className="h-10 w-10 rounded-full" />
            <span className="ml-3 text-xl font-bold">Admin Panel</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`sidebar-link flex w-full items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-blue-100 hover:bg-yellow-400 hover:text-blue-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`sidebar-link flex w-full items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'announcements' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-blue-100 hover:bg-yellow-400 hover:text-blue-900'}`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`sidebar-link flex w-full items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-blue-100 hover:bg-yellow-400 hover:text-blue-900'}`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('grievance')}
              className={`sidebar-link flex w-full items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'grievance' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-blue-100 hover:bg-yellow-400 hover:text-blue-900'}`}
            >
              Grievance
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`sidebar-link flex w-full items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'chatbot' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-blue-100 hover:bg-yellow-400 hover:text-blue-900'}`}
            >
              Chatbot Configs
            </button>
          </nav>
          <div className="px-4 py-4 border-t border-blue-800">
            <button onClick={handleLogout} className="flex w-full items-center px-4 py-2.5 rounded-lg text-blue-100 hover:bg-red-500 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar removed as requested */}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                {activeTab === 'home' && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-black mb-2">
                        Home
                      </h2>
                      <p className="text-black">Manage the hero title and subtitle displayed on the homepage.</p>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-lg font-semibold text-black mb-3">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={content.heroTitle}
                          onChange={(e) => handleContentChange('heroTitle', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Enter your hero title..."
                        />
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-lg font-semibold text-black mb-3">
                          Hero Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.heroSubtitle}
                          onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                          placeholder="Enter your hero subtitle..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-black">Gallery</h2>
                      <button
                        onClick={addProject}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                      >
                        Add Row
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-200">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-slate-50 text-black sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Title</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {content.projects.map((project, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                              <td className="px-4 py-3 align-top">
                                <input
                                  type="text"
                                  value={project.title}
                                  onChange={(e) => updateProject(index, 'title', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                <select
                                  value={project.status}
                                  onChange={(e) => updateProject(index, 'status', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                >
                                  <option value="Planning">Planning</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                  <option value="On Hold">On Hold</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 align-top">
                                <textarea
                                  value={project.description}
                                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                />
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <button onClick={() => removeProject(index)} className="text-red-600 hover:text-red-800 font-medium">Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'announcements' && (
                  <div>
                    <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-200">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-slate-50 text-black sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Title</th>
                            <th className="px-4 py-3 text-left font-semibold">Category</th>
                            <th className="px-4 py-3 text-left font-semibold">Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {content.announcements.map((announcement, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                              <td className="px-4 py-3 align-top">
                                <input
                                  type="text"
                                  value={announcement.title}
                                  onChange={(e) => handleAnnouncementChange(index, 'title', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                <select
                                  value={announcement.category}
                                  onChange={(e) => handleAnnouncementChange(index, 'category', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                >
                                  <option value="Event">Event</option>
                                  <option value="Health">Health</option>
                                  <option value="Notice">Notice</option>
                                  <option value="General">General</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 align-top">
                                <input
                                  type="text"
                                  value={announcement.date}
                                  onChange={(e) => handleAnnouncementChange(index, 'date', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                <textarea
                                  value={announcement.description}
                                  onChange={(e) => handleAnnouncementChange(index, 'description', e.target.value)}
                                  rows={2}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                />
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <button onClick={() => removeAnnouncement(index)} className="text-red-600 hover:text-red-800 font-medium">Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Secondary announcements form removed */}

                {activeTab === 'grievance' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Grievance Submissions</h2>
                    <div className="overflow-x-auto">
                      <GrievanceTable />
                    </div>
                  </div>
                )}

                {activeTab === 'chatbot' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-black">Chatbot Configuration</h2>
                      <button
                        onClick={addChatbotResponse}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                      >
                        Add Response
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-xl shadow ring-1 ring-slate-200">
                      <table className="min-w-full table-fixed text-sm">
                        <thead className="bg-slate-50 text-black sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Keyword</th>
                            <th className="px-4 py-3 text-left font-semibold">Response</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {content.chatbotPrompts.defaultResponses.map((response, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                              <td className="px-4 py-3 align-top">
                                <input
                                  type="text"
                                  value={response.keyword}
                                  onChange={(e) => updateChatbotResponse(index, 'keyword', e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                  placeholder="Enter keyword..."
                                />
                              </td>
                              <td className="px-4 py-3 align-top">
                                <textarea
                                  value={response.response}
                                  onChange={(e) => updateChatbotResponse(index, 'response', e.target.value)}
                                  rows={3}
                                  className="w-full px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                  placeholder="Enter bot response..."
                                />
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <button onClick={() => removeChatbotResponse(index)} className="text-red-600 hover:text-red-800 font-medium">Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-semibold"
                      >
                        Save Chatbot Configs
                      </button>
                    </div>
                  </div>
                )}

                {/* Chatbot editor removed in cleanup */}

                {/* Documents section removed in cleanup */}

          
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}
