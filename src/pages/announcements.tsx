import Layout from '../components/Layout';

export default function Announcements() {
  const announcements = [
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
    },
    {
      title: "Vaccination Schedule",
      date: "March 5, 2024",
      description: "COVID-19 vaccination schedule for the month of March. Please check the schedule at the barangay hall.",
      category: "Health"
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Announcements</h1>

          {/* Announcements List */}
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">{announcement.title}</h2>
                    <p className="text-gray-900">{announcement.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {announcement.category}
                  </span>
                </div>
                <div className="text-sm text-gray-900">
                  Posted on: {announcement.date}
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter removed per request */}

        </div>
      </div>
    </Layout>
  );
} 
     