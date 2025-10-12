export interface ContentData {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  announcements: Array<{
    title: string;
    date: string;
    description: string;
    category: string;
  }>;
}

const defaultContent: ContentData = {
  heroTitle: "Welcome to Barangay 828 SK Council Official Website",
  heroSubtitle: "Serving our community with dedication and excellence",
  aboutText: "Barangay 828 is committed to providing excellent public service and maintaining a safe, peaceful, and progressive community for all its residents.",
  announcements: [
    {
      title: "Community Clean-up Drive",
      date: "March 15, 2024",
      description: "Join us for our monthly community clean-up drive. Meet at the barangay hall at 7:00 AM.",
      category: "Event"
    },
    {
      title: "Free Medical Check-up",
      date: "March 20, 2024",
      description: "Free medical check-up for senior citizens and PWDs. Bring your barangay ID.",
      category: "Health"
    },
    {
      title: "Road Closure Notice",
      date: "March 10, 2024",
      description: "Main street will be closed for maintenance from March 12-14. Please use alternate routes.",
      category: "Notice"
    }
  ]
};

export const getContent = (): ContentData => {
  if (typeof window !== 'undefined') {
    const savedContent = localStorage.getItem('websiteContent');
    if (savedContent) {
      try {
        return JSON.parse(savedContent);
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }
  return defaultContent;
};

export const saveContent = (content: ContentData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('websiteContent', JSON.stringify(content));
  }
};
