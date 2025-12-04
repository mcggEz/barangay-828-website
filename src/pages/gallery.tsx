import Layout from '../components/Layout';
import Image from 'next/image';
import { GalleryItem } from '../lib/supabase';
import { GetServerSideProps } from 'next';
import { createClient } from '@supabase/supabase-js';

interface GalleryPageProps {
  galleryItems?: GalleryItem[];
}

export default function Gallery({ galleryItems = [] }: GalleryPageProps) {
  return (
    <Layout>
      <div className="bg-[#053F85] min-h-screen pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-[#053F85] text-white py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="space-y-6 max-w-4xl">
              <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">
                Community Moments
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Gallery of Events &amp; Activities
              </h1>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                Look back at the programs, projects, and activities of Barangay 828.
                This gallery showcases our community&apos;s milestones and memories.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <h2 className="sr-only">Gallery items</h2>

          {galleryItems.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center text-blue-100/80 py-10 px-6 bg-[#022c5e]/60 border border-dashed border-blue-400/40 rounded-3xl">
              <p className="text-2xl font-semibold text-white mb-2">No photos yet</p>
              <p className="text-sm md:text-base text-blue-100/80">
                Once events and activities are documented, this page will showcase photos from Barangay 828&apos;s
                youth programs, projects, and community gatherings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg overflow-hidden hover:bg-white/10 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-blue-100">{item.date}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-[#FFC107]/20 text-[#FFC107] rounded-full text-sm font-medium border border-[#FFC107]/30">
                        {item.category}
                      </span>
                      <span className="text-sm text-blue-100/80">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mt-3">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<GalleryPageProps> = async () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing.');
    return { props: { galleryItems: [] } };
  }

  const supabaseServer = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabaseServer
    .from('gallery')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Supabase server error:', error.message);
  }

  return {
    props: {
      galleryItems: data || [],
    },
  };
};

