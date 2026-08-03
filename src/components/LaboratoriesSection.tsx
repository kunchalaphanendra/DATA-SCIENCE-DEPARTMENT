import { FlaskConical } from 'lucide-react';

export const laboratoriesList = [
  'Object Oriented Programming through Java Lab',
  'Node JS/React JS/Django',
  'ETL-Kafka/Talend',
  'Database Management Systems Lab',
  'Web and Social Media Analytics Lab',
  'Predictive Analytics Lab',
  'Operating Systems Lab',
  'Machine Learning Lab',
  'Scripting Languages Lab',
  'UI design-Flutter/ Machine Learning Lab',
];

export default function LaboratoriesSection() {
  return (
    <div className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-sm">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-[900] text-slate-900 tracking-tight">Laboratories</h2>
        <div className="mt-3 h-1 w-16 bg-[#9d174d] rounded-full" />
      </div>

      {/* Grid of Labs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {laboratoriesList.map((lab) => (
          <div
            key={lab}
            className="flex items-center gap-4 rounded-2xl bg-slate-50/70 border border-slate-100 p-4 sm:p-5 shadow-2xs hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all duration-200 group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#9d174d] group-hover:bg-[#9d174d] group-hover:text-white transition-colors duration-200">
              <FlaskConical size={20} className="stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-slate-900">
              {lab}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
