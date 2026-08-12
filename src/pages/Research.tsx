import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { ResearchDocument } from '@/src/types';
import { defaultResearchDocuments } from '@/src/data/researchData';
import { Beaker, FileText, Users, Lightbulb, ExternalLink } from 'lucide-react';
import MOUsSection from '@/src/components/MOUsSection';

export default function Research() {
  const loadLocalDocs = () => {
    const stored = localStorage.getItem('vits_research_docs_v1');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultResearchDocuments;
  };

  const [documents, setDocuments] = useState<ResearchDocument[]>(loadLocalDocs);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data, error } = await supabase
          .from('research_documents')
          .select('*')
          .order('order', { ascending: true });

        if (!error && data && data.length > 0) {
          setDocuments(data.map(r => ({
            id: r.id,
            category: r.category,
            academicYear: r.academic_year,
            documentUrl: r.document_url || '#',
            order: r.order || 0,
          })));
        } else {
          setDocuments(loadLocalDocs());
        }
      } catch (err) {
        setDocuments(loadLocalDocs());
      }
    };
    fetchDocs();
  }, []);

  const publicationsDocs = documents.filter(d => d.category === 'publications');
  const seminarsDocs = documents.filter(d => d.category === 'seminars');

  const researchAreas = [
    'Machine Learning & Deep Learning',
    'Big Data Analytics',
    'Natural Language Processing',
    'Computer Vision',
    'Internet of Things (IoT)',
    'Cloud Computing & Security'
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-16 sm:py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-[900] text-violet-900 tracking-tight">Research & Publications</h1>
          <p className="mt-3 text-base sm:text-lg font-medium text-slate-600">
            Driving innovation through cutting-edge research, publications, and technical conferences.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-amber-500" />
        </div>

        {/* 1. Publications Section */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-xs">
          <div className="mb-8">
            <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Publications</h2>
            <div className="mt-3 h-1 w-16 bg-[#9d174d] rounded-full" />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#9d174d] text-white text-base font-bold">
                  <th className="py-4 px-6 w-24 border-r border-white/20">S.No</th>
                  <th className="py-4 px-6 border-r border-white/20">Academic Year</th>
                  <th className="py-4 px-6">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-base">
                {publicationsDocs.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 1 ? 'bg-slate-50/60 hover:bg-slate-100/70' : 'bg-white hover:bg-slate-50'}>
                    <td className="py-4 px-6 font-semibold text-slate-600 border-r border-slate-200/60">{idx + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-200/60">{doc.academicYear}</td>
                    <td className="py-4 px-6">
                      {doc.documentUrl && doc.documentUrl !== '#' ? (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#9d174d] hover:underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="font-bold text-[#9d174d] opacity-90 hover:underline cursor-pointer">
                          View Document
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {publicationsDocs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 italic">No publications recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Seminars / Workshops / Conferences Section */}
        <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-xs">
          <div className="mb-8">
            <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">Seminars / Workshops / Conferences</h2>
            <div className="mt-3 h-1 w-16 bg-[#9d174d] rounded-full" />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#9d174d] text-white text-base font-bold">
                  <th className="py-4 px-6 w-24 border-r border-white/20">S.No</th>
                  <th className="py-4 px-6 border-r border-white/20">Academic Year</th>
                  <th className="py-4 px-6">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-base">
                {seminarsDocs.map((doc, idx) => (
                  <tr key={doc.id} className={idx % 2 === 1 ? 'bg-slate-50/60 hover:bg-slate-100/70' : 'bg-white hover:bg-slate-50'}>
                    <td className="py-4 px-6 font-semibold text-slate-600 border-r border-slate-200/60">{idx + 1}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-200/60">{doc.academicYear}</td>
                    <td className="py-4 px-6">
                      {doc.documentUrl && doc.documentUrl !== '#' ? (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#9d174d] hover:underline"
                        >
                          View Document
                        </a>
                      ) : (
                        <span className="font-bold text-[#9d174d] opacity-90 hover:underline cursor-pointer">
                          View Document
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {seminarsDocs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 italic">No seminars or conferences recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. MOUs Section */}
        <MOUsSection />

        {/* Research Areas */}
        <div>
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-violet-900">
            <Beaker className="text-amber-500" />
            Key Research Areas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <div key={area} className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:border-amber-200">
                <Lightbulb className="text-amber-500" size={20} />
                <span className="font-bold text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
