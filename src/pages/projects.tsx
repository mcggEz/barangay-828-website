import Layout from '../components/Layout';
import Image from 'next/image';

export default function Projects() {
  const projects = [
    {
      title: "Youth Leadership Training",
      description: "A comprehensive training program for young leaders in the community, focusing on leadership skills, community service, and civic engagement.",
      image: "/sk-logo.png",
      status: "Ongoing",
      date: "January 2024 - Present",
      category: "Education",
      budget: "₱30,000.00",
      beneficiaries: "50 youth leaders",
      impact: "Enhanced leadership skills and community engagement"
    },
    {
      title: "Community Garden Initiative",
      description: "Establishing and maintaining community gardens to promote sustainable living and provide fresh produce for residents.",
      image: "/sk-logo.png",
      status: "Completed",
      date: "December 2023",
      category: "Environment",
      budget: "₱25,000.00",
      beneficiaries: "200 residents",
      impact: "Improved community cleanliness and environmental awareness"
    },
    {
      title: "Digital Literacy Program",
      description: "Free computer and internet training sessions for youth and senior citizens to bridge the digital divide.",
      image: "/sk-logo.png",
      status: "Ongoing",
      date: "February 2024 - Present",
      category: "Technology",
      budget: "₱40,000.00",
      beneficiaries: "100 youth and seniors",
      impact: "Enhanced digital skills and internet literacy"
    },
    {
      title: "Sports Development Program",
      description: "Regular sports activities and tournaments to promote physical fitness and community bonding among youth.",
      image: "/sk-logo.png",
      status: "Ongoing",
      date: "January 2024 - Present",
      category: "Sports",
      budget: "₱25,000.00",
      beneficiaries: "150 youth",
      impact: "Improved physical fitness and community bonding"
    },
    {
      title: "Arts and Culture Festival",
      description: "Annual celebration of local arts and culture, featuring performances, workshops, and exhibitions.",
      image: "/sk-logo.png",
      status: "Upcoming",
      date: "April 2024",
      category: "Culture",
      budget: "₱35,000.00",
      beneficiaries: "300 community members",
      impact: "Cultural preservation and community celebration"
    },
    {
      title: "Environmental Awareness Campaign",
      description: "Educational programs and activities focused on waste management, recycling, and environmental conservation.",
      image: "/sk-logo.png",
      status: "Ongoing",
      date: "March 2024 - Present",
      category: "Environment",
      budget: "₱20,000.00",
      beneficiaries: "250 residents",
      impact: "Increased environmental awareness and sustainable practices"
    }
  ];

  // Transparency details removed per request

  // Financial reports removed per request

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Gallery & Transparency</h1>

          {/* Gallery Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Community Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                        project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-4">{project.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-lg font-bold text-blue-600">{project.budget}</p>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Beneficiaries:</span> {project.beneficiaries}</p>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Impact:</span> {project.impact}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                      <span className="text-sm text-gray-900">{project.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Removed SK Laws, Mandates, and Financial Reports per request */}

          {/* Removed CTA section per request */}
        </div>
      </div>
    </Layout>
  );
} 