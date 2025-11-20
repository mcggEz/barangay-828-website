import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import type { Announcement, GalleryItem } from '../../lib/supabase';

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

type BasicInfo = {
  address: string;
  email: string;
  phone: string;
  hotline: string;
  facebook: string;
  officeHours: string;
  mapEmbed: string;
};

type ChatbotPrompt = {
  id: string;
  question: string;
  answer: string;
};

type CouncilMember = {
  id: string;
  name: string;
  position: string;
  contact: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState<{ title: string; description: string; category: string; date: string; images: string[] }>({
    title: '',
    description: '',
    category: 'Event',
    date: '',
    images: [],
  });
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementUploadFiles, setAnnouncementUploadFiles] = useState<File[]>([]);
  const [announcementFileInputKey, setAnnouncementFileInputKey] = useState(0);
  const [editingAnnouncementFiles, setEditingAnnouncementFiles] = useState<File[]>([]);
  const [editingAnnouncementFileInputKey, setEditingAnnouncementFileInputKey] = useState(0);

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', image: '', date: '', category: 'Events' });
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryUploadFile, setGalleryUploadFile] = useState<File | null>(null);
  const [editingGalleryFile, setEditingGalleryFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Basic info + chatbot state
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    address: '1310-C Burgos St., Paco, Manila',
    email: 'barangay828sk@gmail.com',
    phone: '(02) 8523 1234',
    hotline: '0917 000 8828',
    facebook: 'https://facebook.com/Brgy828SK',
    officeHours: 'Monday to Friday, 8:00 AM - 5:00 PM',
    mapEmbed: 'https://www.google.com/maps?q=1310-C+Burgos+St.,+Paco,+Manila&output=embed',
  });
  const [chatbotPrompts, setChatbotPrompts] = useState<ChatbotPrompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ question: '', answer: '' });
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [newMember, setNewMember] = useState({ name: '', position: '', contact: '' });

  // Auth is enforced by Next.js middleware using an HttpOnly cookie.
  // If the user is not authenticated they will be redirected before this page renders.

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedInfo = localStorage.getItem('brgy828_basicInfo');
      if (storedInfo) {
        setBasicInfo(JSON.parse(storedInfo) as BasicInfo);
      }
      const storedPrompts = localStorage.getItem('brgy828_chatbotPrompts');
      if (storedPrompts) {
        setChatbotPrompts(JSON.parse(storedPrompts) as ChatbotPrompt[]);
      } else {
        setChatbotPrompts([
          {
            id: 'default-1',
            question: 'How can I contact the SK Council?',
            answer: 'You can reach us via email at barangay828sk@gmail.com or call (02) 8523 1234.',
          },
          {
            id: 'default-2',
            question: 'Where is the Barangay Hall located?',
            answer: 'We are located at 1310-C Burgos St., Paco, Manila. Office hours are Monday to Friday, 8 AM to 5 PM.',
          },
        ]);
      }
      const storedMembers = localStorage.getItem('brgy828_councilMembers');
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers) as CouncilMember[]);
      } else {
        setMembers([
          { id: 'member-1', name: 'Juan Dela Cruz', position: 'SK Chairman', contact: '(02) 8523 1234' },
          { id: 'member-2', name: 'Maria Santos', position: 'SK Kagawad', contact: 'maria.santos@example.com' },
        ]);
      }
    } catch (error) {
      console.error('Error loading admin utilities:', error);
    }
  }, []);

  const handleSaveBasicInfo = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('brgy828_basicInfo', JSON.stringify(basicInfo));
    alert('Basic information saved!');
  };

  const handleAddPrompt = () => {
    if (!newPrompt.question.trim() || !newPrompt.answer.trim()) {
      alert('Please provide both a question and an answer.');
      return;
    }

    const updated = [
      ...chatbotPrompts,
      {
        id: `prompt-${Date.now()}`,
        question: newPrompt.question.trim(),
        answer: newPrompt.answer.trim(),
      },
    ];

    setChatbotPrompts(updated);
    setNewPrompt({ question: '', answer: '' });
    if (typeof window !== 'undefined') {
      localStorage.setItem('brgy828_chatbotPrompts', JSON.stringify(updated));
    }
  };

  const handleDeletePrompt = (id: string) => {
    const updated = chatbotPrompts.filter((prompt) => prompt.id !== id);
    setChatbotPrompts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('brgy828_chatbotPrompts', JSON.stringify(updated));
    }
  };

  const persistMembers = (data: CouncilMember[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('brgy828_councilMembers', JSON.stringify(data));
    }
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.position.trim()) {
      alert('Please provide a name and position.');
      return;
    }
    const updated = [
      ...members,
      {
        id: `member-${Date.now()}`,
        name: newMember.name.trim(),
        position: newMember.position.trim(),
        contact: newMember.contact.trim(),
      },
    ];
    setMembers(updated);
    persistMembers(updated);
    setNewMember({ name: '', position: '', contact: '' });
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter((member) => member.id !== id);
    setMembers(updated);
    persistMembers(updated);
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
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadFileViaServer = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const fileData = await fileToDataUrl(file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bucket,
        path: fileName,
        fileData,
        contentType: file.type || 'application/octet-stream',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'File upload failed');
    }

    return data.publicUrl as string;
  };

  const uploadGalleryImage = async (file: File) => {
    setUploadingImage(true);
    try {
      return await uploadFileViaServer(file, 'gallery-images', 'gallery');
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadAnnouncementImages = async (files: File[]) => {
    if (files.length === 0) return [];
    setUploadingImage(true);
    try {
      const uploads = files.map((file) => uploadFileViaServer(file, 'announcement-images', 'announcements'));
      return await Promise.all(uploads);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      router.push('/admin/login');
    }
  };

  // Announcement handlers
  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description || !newAnnouncement.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let imageUrls: string[] = [];

      if (announcementUploadFiles.length > 0) {
        imageUrls = await uploadAnnouncementImages(announcementUploadFiles);
      }

      const response = await fetch('/api/announcements/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAnnouncement, images: imageUrls }),
      });

      if (response.ok) {
        setNewAnnouncement({ title: '', description: '', category: 'Event', date: '', images: [] });
        setAnnouncementUploadFiles([]);
        setAnnouncementFileInputKey((prev) => prev + 1);
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
      let imageUrls = editingAnnouncement.images ?? [];

      if (editingAnnouncementFiles.length > 0) {
        const uploaded = await uploadAnnouncementImages(editingAnnouncementFiles);
        imageUrls = [...imageUrls, ...uploaded];
      }

      const response = await fetch('/api/announcements/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingAnnouncement, images: imageUrls }),
      });

      if (response.ok) {
        setEditingAnnouncement(null);
        setEditingAnnouncementFiles([]);
        setEditingAnnouncementFileInputKey((prev) => prev + 1);
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

  const handleAnnouncementFilesChange = (files: FileList | null) => {
    if (!files) {
      setAnnouncementUploadFiles([]);
      return;
    }
    setAnnouncementUploadFiles(Array.from(files));
  };

  const removeAnnouncementFile = (index: number) => {
    setAnnouncementUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditingAnnouncementFilesChange = (files: FileList | null) => {
    if (!files) {
      setEditingAnnouncementFiles([]);
      return;
    }
    setEditingAnnouncementFiles(Array.from(files));
  };

  const removeEditingAnnouncementFile = (index: number) => {
    setEditingAnnouncementFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAnnouncementImage = (imageUrl: string) => {
    if (!editingAnnouncement) return;
    setEditingAnnouncement({
      ...editingAnnouncement,
      images: (editingAnnouncement.images || []).filter((image) => image !== imageUrl),
    });
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
    if (!newGalleryItem.title || !newGalleryItem.date) {
      alert('Please fill in all required fields');
      return;
    }

    if (!galleryUploadFile) {
      alert('Please upload an image for this gallery item.');
      return;
    }

    try {
      const imageUrl = await uploadGalleryImage(galleryUploadFile);

      const response = await fetch('/api/gallery/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newGalleryItem, image: imageUrl }),
      });

      if (response.ok) {
        setNewGalleryItem({ title: '', image: '', date: '', category: 'Events' });
        setGalleryUploadFile(null);
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
      let imagePayload = editingGallery.image;

      if (editingGalleryFile) {
        imagePayload = await uploadGalleryImage(editingGalleryFile);
      }

      const response = await fetch('/api/gallery/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingGallery, image: imagePayload }),
      });

      if (response.ok) {
        setEditingGallery(null);
        setEditingGalleryFile(null);
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
            onClick={() => handleTabChange('basicInfo')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'basicInfo'
                ? 'bg-yellow-400 text-blue-900 font-semibold shadow-lg'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
              Basic Info
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
            <button
            onClick={() => handleTabChange('chatbot')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
              activeTab === 'chatbot'
                ? 'bg-yellow-400 text-blue-900 font-semibold shadow-lg'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h8m5 0a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12z" />
            </svg>
              Chatbot
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
              <div className="bg-white rounded-none shadow-xl overflow-hidden">
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
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Images (optional)</label>
                          <input
                            key={announcementFileInputKey}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAnnouncementFilesChange(e.target.files)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Select one or more photos. All selected files will be uploaded for this announcement.
                          </p>
                          {announcementUploadFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {announcementUploadFiles.map((file, index) => (
                                <div
                                  key={`${file.name}-${index}`}
                                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm shadow-sm"
                                >
                                  <span className="text-gray-700">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeAnnouncementFile(index)}
                                    className="text-red-500 hover:text-red-600"
                                    aria-label="Remove file"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
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

               
                    </div>
                  </div>
                )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-none shadow-xl overflow-hidden">
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setGalleryUploadFile(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                          />
                        <p className="text-xs text-gray-500 mt-1">Upload the photo you want to feature.</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCreateGalleryItem}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-60"
                      disabled={uploadingImage}
                      >
                      {uploadingImage ? 'Uploading...' : 'Add Gallery Item'}
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
                                <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                />
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

            {/* Basic Info Tab */}
            {activeTab === 'basicInfo' && (
              <div className="bg-white rounded-none shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white">Basic Information</h2>
                    <p className="text-blue-100">
                      Update contact information, official address, and map embed used across the site.
                    </p>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Official Address</label>
                      <input
                        type="text"
                        value={basicInfo.address}
                        onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1310-C Burgos St., Paco, Manila"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="barangay828sk@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(02) 8523 1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hotline</label>
                      <input
                        type="text"
                        value={basicInfo.hotline}
                        onChange={(e) => setBasicInfo({ ...basicInfo, hotline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0917 000 8828"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Page</label>
                      <input
                        type="text"
                        value={basicInfo.facebook}
                        onChange={(e) => setBasicInfo({ ...basicInfo, facebook: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://facebook.com/Brgy828SK"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
                      <input
                        type="text"
                        value={basicInfo.officeHours}
                        onChange={(e) => setBasicInfo({ ...basicInfo, officeHours: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Monday to Friday, 8 AM - 5 PM"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps Embed URL</label>
                    <textarea
                      value={basicInfo.mapEmbed}
                      onChange={(e) => setBasicInfo({ ...basicInfo, mapEmbed: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Paste the iframe URL used in the footer map.
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveBasicInfo}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Save Basic Information
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-8 space-y-6">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">SK Council Members</h3>
                      <p className="text-gray-600">
                        Manage the list of officials shown across the Transparency site.
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-none p-6 border border-blue-200 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                          <input
                            type="text"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                          <input
                            type="text"
                            value={newMember.position}
                            onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., SK Kagawad"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Contact (optional)</label>
                          <input
                            type="text"
                            value={newMember.contact}
                            onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email or phone"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddMember}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Add Member
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {members.map((member) => (
                        <div key={member.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                              <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                            </div>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Position</p>
                            <p className="text-gray-800 font-medium">{member.position}</p>
                          </div>
                          {member.contact && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Contact</p>
                              <p className="text-gray-700">{member.contact}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {members.length === 0 && (
                        <div className="text-center col-span-full text-gray-500 border border-dashed border-gray-300 rounded-xl p-8">
                          No members listed yet. Add the SK officials above.
                        </div>
                      )}
                    </div>
                  </div>
                    </div>
                  </div>
                )}

            {/* Chatbot Tab */}
                {activeTab === 'chatbot' && (
              <div className="bg-white rounded-none shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-white">Chatbot Responses</h2>
                    <p className="text-blue-100">
                      Configure the default Q&A pairs used by the chatbot widget on the site.
                    </p>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="bg-blue-50 rounded-none p-6 border border-blue-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
                        <input
                          type="text"
                          value={newPrompt.question}
                          onChange={(e) => setNewPrompt({ ...newPrompt, question: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., How do I request a barangay ID?"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Answer *</label>
                        <textarea
                          value={newPrompt.answer}
                          onChange={(e) => setNewPrompt({ ...newPrompt, answer: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Provide the steps or information the chatbot should respond with."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddPrompt}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Add Response
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {chatbotPrompts.map((prompt) => (
                      <div key={prompt.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Question</p>
                            <h4 className="font-semibold text-gray-900">{prompt.question}</h4>
                          </div>
                          <button
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Answer</p>
                          <p className="text-gray-700 leading-relaxed">{prompt.answer}</p>
                        </div>
                      </div>
                    ))}
                    {chatbotPrompts.length === 0 && (
                      <div className="text-center col-span-full text-gray-500 border border-dashed border-gray-300 rounded-xl p-8">
                        No responses yet. Add your first chatbot prompt above.
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-none p-4 text-sm text-blue-900">
                    Responses are saved locally so you can refine them. Connect this module to Supabase to
                    sync with the production chatbot when ready.
                  </div>
                </div>
              </div>
            )}

            {/* Grievance Tab */}
            {activeTab === 'grievance' && (
              <div className="bg-white rounded-none shadow-xl overflow-hidden">
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add More Images (optional)</label>
                <input
                  key={editingAnnouncementFileInputKey}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleEditingAnnouncementFilesChange(e.target.files)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  New files will be uploaded and appended to the existing gallery for this announcement.
                </p>
                {editingAnnouncementFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editingAnnouncementFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm shadow-sm"
                      >
                        <span className="text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEditingAnnouncementFile(index)}
                          className="text-red-500 hover:text-red-600"
                          aria-label="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {editingAnnouncement.images && editingAnnouncement.images.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Current Images</p>
                  <div className="flex flex-wrap gap-3">
                    {editingAnnouncement.images.map((url, idx) => (
                      <div key={idx} className="w-24 h-24 relative rounded overflow-hidden border shadow-sm group">
                        <Image src={url} alt={`Announcement image ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingAnnouncementImage(url)}
                          className="absolute top-1 right-1 bg-white/80 text-xs text-red-600 rounded-full px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload New Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditingGalleryFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image.</p>
              </div>
              {editingGallery.image && (
                <div className="mt-2 w-32 h-32 relative rounded overflow-hidden border">
                  <Image src={editingGallery.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const adminAuth = req.cookies?.adminAuth;

  if (adminAuth !== 'true') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
