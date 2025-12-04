import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

export default function SkPaPrint() {
  return (
    <Layout>
      <div className="bg-[#053F85] min-h-screen pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-[#053F85] text-white py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="space-y-6 max-w-4xl">
              <p className="text-blue-200 uppercase tracking-[0.3em] text-sm font-semibold">
                SK Service
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                SK Pa-print
              </h1>
              <p className="text-blue-100/80 text-lg md:text-xl max-w-3xl leading-relaxed font-light">
                Need to print modules, school requirements, or youth-related documents? The SK Council of Barangay 828
                offers simple, free or low-cost printing support for residents, subject to guidelines and availability.
              </p>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">How it works</h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-100/80">
                <li>Prepare your files in PDF or image format.</li>
                <li>Visit the barangay hall or message the official SK Facebook page.</li>
                <li>Coordinate with an SK officer for schedule and availability.</li>
                <li>Bring your valid ID or school ID when claiming your prints.</li>
              </ol>
            </div>

            <div className="space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Request details</h2>
              <ul className="space-y-2 text-blue-100/80">
                <li>• Priority is given to students and youth-related activities.</li>
                <li>• Large or bulk printing may be scheduled on specific days.</li>
                <li>• Please avoid sensitive or non-community-friendly content.</li>
                <li>• Guidelines may change depending on resources and demand.</li>
              </ul>

              <a
                href="https://www.facebook.com/profile.php?id=61553500932941"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-[#FFC107] text-[#053F85] font-semibold text-sm hover:bg-[#FFD54F] transition-all hover:shadow-[0_0_20px_rgba(255,193,7,0.3)]"
              >
                Message SK 828 on Facebook
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}


