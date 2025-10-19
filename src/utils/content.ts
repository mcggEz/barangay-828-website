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
  projects: Array<{
    title: string;
    description: string;
    status: string;
    image?: string;
  }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  chatbotPrompts: {
    welcomeMessage: string;
    defaultResponses: Array<{
      keyword: string;
      response: string;
    }>;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
    description: string;
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
  ],
  projects: [
    {
      title: "Youth Development Program",
      description: "Comprehensive program for youth skills development and leadership training.",
      status: "Ongoing"
    },
    {
      title: "Community Garden Initiative",
      description: "Establishing community gardens to promote sustainable living and food security.",
      status: "Planning"
    }
  ],
  contactInfo: {
    address: "Barangay 828, Metro Manila, Philippines",
    phone: "+63 2 1234 5678",
    email: "info@barangay828.gov.ph",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM"
  },
  chatbotPrompts: {
    welcomeMessage: "Magandang araw! Ako ang inyong Barangay Assistant. Paano ko kayo matutulungan ngayon?",
    defaultResponses: [
      {
        keyword: "hours",
        response: "Ang aming opisina ay bukas mula Lunes hanggang Biyernes, 8:00 AM hanggang 5:00 PM."
      },
      {
        keyword: "contact",
        response: "Maaari kayong makipag-ugnayan sa amin sa +63 2 1234 5678 o sa info@barangay828.gov.ph"
      },
      {
        keyword: "services",
        response: "Nagbibigay kami ng mga serbisyo tulad ng barangay clearance, business permit, at iba pang dokumento."
      }
    ]
  },
  documents: []
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
