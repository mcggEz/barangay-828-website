import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getContent, saveContent, ContentData } from '../../utils/content';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentData>(getContent());
  const [activeTab, setActiveTab] = useState('hero');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    Array.from(files).forEach((file) => {
      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toLocaleDateString(),
        description: ''
      };
      
      setContent(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));
    });
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (id: string) => {
    setContent(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const updateDocumentDescription = (id: string, description: string) => {
    setContent(prev => ({
      ...prev,
      documents: prev.documents.map(doc => 
        doc.id === id ? { ...doc, description } : doc
      )
    }));
  };

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

  const updateContactInfo = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
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
        <div className="bg-white shadow-lg border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 font-semibold transition-colors"
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
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'hero' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Hero Section
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'about' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  About Section
                </button>
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'projects' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'contact' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Contact Info
                </button>
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'chatbot' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Chatbot Prompts
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors ${
                    activeTab === 'documents' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  Documents
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'hero' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Hero Section</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Hero Title
                        </label>
                        <input
                          type="text"
                          value={content.heroTitle}
                          onChange={(e) => handleContentChange('heroTitle', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Hero Subtitle
                        </label>
                        <input
                          type="text"
                          value={content.heroSubtitle}
                          onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">About Section</h2>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        About Text
                      </label>
                      <textarea
                        value={content.aboutText}
                        onChange={(e) => handleContentChange('aboutText', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'announcements' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                      <button
                        onClick={addAnnouncement}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
                      >
                        Add Announcement
                      </button>
                    </div>
                    <div className="space-y-6">
                      {content.announcements.map((announcement, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Announcement {index + 1}</h3>
                            <button
                              onClick={() => removeAnnouncement(index)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={announcement.title}
                                onChange={(e) => handleAnnouncementChange(index, 'title', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Category
                              </label>
                              <select
                                value={announcement.category}
                                onChange={(e) => handleAnnouncementChange(index, 'category', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                              >
                                <option value="Event">Event</option>
                                <option value="Health">Health</option>
                                <option value="Notice">Notice</option>
                                <option value="General">General</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Date
                              </label>
                              <input
                                type="text"
                                value={announcement.date}
                                onChange={(e) => handleAnnouncementChange(index, 'date', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Description
                              </label>
                              <textarea
                                value={announcement.description}
                                onChange={(e) => handleAnnouncementChange(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Projects</h2>
                      <button
                        onClick={addProject}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Add Project
                      </button>
                    </div>
                    <div className="space-y-6">
                      {content.projects.map((project, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                            <button
                              onClick={() => removeProject(index)}
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
                                value={project.title}
                                onChange={(e) => updateProject(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                              </label>
                              <select
                                value={project.status}
                                onChange={(e) => updateProject(index, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Planning">Planning</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
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

                {activeTab === 'contact' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={content.contactInfo.address}
                          onChange={(e) => updateContactInfo('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={content.contactInfo.phone}
                          onChange={(e) => updateContactInfo('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={content.contactInfo.email}
                          onChange={(e) => updateContactInfo('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Office Hours
                        </label>
                        <input
                          type="text"
                          value={content.contactInfo.hours}
                          onChange={(e) => updateContactInfo('hours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'chatbot' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Chatbot Configuration</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Welcome Message
                        </label>
                        <textarea
                          value={content.chatbotPrompts.welcomeMessage}
                          onChange={(e) => handleContentChange('chatbotPrompts', {
                            ...content.chatbotPrompts,
                            welcomeMessage: e.target.value
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Default Responses</h3>
                          <button
                            onClick={addChatbotResponse}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Add Response
                          </button>
                        </div>
                        <div className="space-y-4">
                          {content.chatbotPrompts.defaultResponses.map((response, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">Response {index + 1}</h4>
                                <button
                                  onClick={() => removeChatbotResponse(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Keyword
                                  </label>
                                  <input
                                    type="text"
                                    value={response.keyword}
                                    onChange={(e) => updateChatbotResponse(index, 'keyword', e.target.value)}
                                    placeholder="e.g., hours, contact, services"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Response
                                  </label>
                                  <textarea
                                    value={response.response}
                                    onChange={(e) => updateChatbotResponse(index, 'response', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Document Management</h2>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {uploading ? 'Uploading...' : 'Upload Documents'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {content.documents.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No documents uploaded yet.</p>
                          <p className="text-sm">Click "Upload Documents" to add files.</p>
                        </div>
                      ) : (
                        content.documents.map((document) => (
                          <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{document.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {document.type} • {(document.size / 1024).toFixed(1)} KB • {document.uploadDate}
                                </p>
                                <div className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    value={document.description}
                                    onChange={(e) => updateDocumentDescription(document.id, e.target.value)}
                                    placeholder="Add a description for this document..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => removeDocument(document.id)}
                                className="ml-4 text-red-600 hover:text-red-800 p-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t-2 border-gray-300">
                  <button
                    onClick={handleSaveContent}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    💾 Save Changes
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
