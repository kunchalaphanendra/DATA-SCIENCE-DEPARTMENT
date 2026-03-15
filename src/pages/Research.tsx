import { Beaker, FileText, Users, Lightbulb } from 'lucide-react';

export default function Research() {
  const researchAreas = [
    'Machine Learning & Deep Learning',
    'Big Data Analytics',
    'Natural Language Processing',
    'Computer Vision',
    'Internet of Things (IoT)',
    'Cloud Computing & Security'
  ];

  const projects = [
    { title: 'AI-based Crop Disease Detection', lead: 'Dr. A. Ramesh', agency: 'DST', year: '2023-25' },
    { title: 'Smart Traffic Management using IoT', lead: 'Mrs. K. Saritha', agency: 'VITS Seed Grant', year: '2022-23' },
    { title: 'Sentiment Analysis for Regional Languages', lead: 'Mr. P. Suresh', agency: 'UGC', year: '2023-24' },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Research & Projects</h1>
          <p className="mt-4 text-gray-600">Driving innovation through cutting-edge research.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Research Areas */}
        <div className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-violet-900">
            <Beaker className="text-amber-500" />
            Key Research Areas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {researchAreas.map((area) => (
              <div key={area} className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-sm border border-gray-50 transition-all hover:border-amber-200">
                <Lightbulb className="text-amber-500" size={20} />
                <span className="font-bold text-gray-700">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ongoing Projects */}
        <div className="mb-20">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-violet-900">
            <FileText className="text-amber-500" />
            Ongoing Research Projects
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm font-bold text-violet-900">
                <tr>
                  <th className="px-6 py-4">Project Title</th>
                  <th className="px-6 py-4">Faculty Lead</th>
                  <th className="px-6 py-4">Funding Agency</th>
                  <th className="px-6 py-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                {projects.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                    <td className="px-6 py-4">{p.lead}</td>
                    <td className="px-6 py-4">{p.agency}</td>
                    <td className="px-6 py-4">{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Projects */}
        <div>
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-violet-900">
            <Users className="text-amber-500" />
            Student Final Year Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: 'Predictive Analysis of Stock Market using LSTM', team: 'Rahul, Sneha, Amit', guide: 'Dr. A. Ramesh' },
              { title: 'Real-time Face Mask Detection System', team: 'Priya, Kiran, John', guide: 'Mrs. K. Saritha' },
            ].map((sp, i) => (
              <div key={i} className="rounded-xl border-l-4 border-amber-500 bg-white p-6 shadow-sm">
                <h4 className="mb-2 text-lg font-bold text-violet-900">{sp.title}</h4>
                <div className="text-sm text-gray-500">
                  <p><span className="font-bold">Team:</span> {sp.team}</p>
                  <p><span className="font-bold">Guide:</span> {sp.guide}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
