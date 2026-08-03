import { BookOpen, Download, CheckCircle2, Sparkles, FileText, ArrowUpRight } from 'lucide-react';

import LaboratoriesSection from '@/src/components/LaboratoriesSection';

export default function Courses() {
  const curriculum = [
    { sem: 'Semester I', subjects: ['Matrices and Calculus', 'Engineering Chemistry', 'Programming for Problem Solving', 'Basic Electrical Engineering', 'Computer Aided Engineering Graphics', 'Elements of Computer Science & Engineering', 'Engineering Chemistry Laboratory', 'Programming for Problem Solving Laboratory', 'Basic Electrical Engineering Laboratory'] },
    { sem: 'Semester II', subjects: ['Ordinary Differential Equations and Vector Calculus', 'Applied Physics', 'Engineering Workshop', 'English for Skill Enhancement', 'Electronic Devices and Circuits', 'Python Programming Laboratory', 'Applied Physics Laboratory', 'English Language and Communication Skills Laboratory', 'IT Workshop'] },
    { sem: 'Semester III', subjects: ['Data Structures', 'Discrete Mathematics', 'Digital Logic Design', 'Object Oriented Programming using Java', 'Computer Organization and Architecture', 'Data Structures Lab', 'Java Programming Lab', 'Gender Sensitization Lab'] },
    { sem: 'Semester IV', subjects: ['Database Management Systems', 'Operating Systems', 'Software Engineering', 'Business Economics & Financial Analysis', 'Design and Analysis of Algorithms', 'Database Management Systems Lab', 'Operating Systems Lab', 'Algorithms Lab', 'Constitution of India'] },
    { sem: 'Semester V', subjects: ['Formal Languages & Automata Theory', 'Introduction to Data Science', 'Computer Networks', 'Professional Elective I', 'Professional Elective II', 'R Programming Lab', 'Computer Networks Lab', 'Advanced English Communication Skills Lab', 'ETL Kafka / Talend', 'Intellectual Property Rights'] },
    { sem: 'Semester VI', subjects: ['Automata Theory and Compiler Design', 'Machine Learning', 'Big Data Analytics', 'Professional Elective III', 'Open Elective I', 'Machine Learning Lab', 'Big Data Analytics Lab', 'Professional Elective III Lab', 'Industrial Oriented Mini Project / Internship / Skill Development', 'Environmental Science'] },
    { sem: 'Semester VII', subjects: ['Predictive Analytics', 'Web and Social Media Analytics', 'Professional Elective IV', 'Professional Elective V', 'Open Elective II', 'Predictive Analytics Lab', 'Web and Social Media Analytics Lab', 'Project Stage I'] },
    { sem: 'Semester VIII', subjects: ['Organizational Behavior', 'Professional Elective VI', 'Open Elective III', 'Project Stage II including Seminar'] },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-16 sm:py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 px-3.5 py-1 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3 border border-[#F59E0B]/20">
            <BookOpen size={14} /> Academic Curriculum
          </div>
          <h1 className="text-4xl sm:text-5xl font-[900] text-[#0F172A] tracking-tight">Courses & Curriculum</h1>
          <p className="mt-2 text-base sm:text-lg font-medium text-slate-600 max-w-2xl mx-auto">
            B.Tech in Computer Science and Engineering (Data Science)
          </p>
          <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#F59E0B] to-amber-300" />
        </div>

        {/* Program Overview */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-[900] text-[#0F172A] tracking-tight mb-3">Program Overview</h2>
              <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
                The B.Tech in CSE (Data Science) is a 4-year undergraduate program designed to provide students with a solid foundation in computer science while specializing in the rapidly growing field of data analytics and artificial intelligence.
              </p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              {[
                '4 Years Duration',
                '8 Semesters',
                'Industry Aligned',
                'Research Oriented',
                'Hands-on Projects',
                'Expert Faculty'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                  <CheckCircle2 size={18} className="text-[#F59E0B] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Direct Official Syllabus Link */}
            <div className="pt-2">
              <a 
                href="https://vignanits.ac.in/academics/syllabus.php"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#F59E0B] hover:bg-[#e08906] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#F59E0B]/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Download size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>Download Full Syllabus (PDF)</span>
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Core Focus Areas Box */}
          <div className="rounded-[28px] bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 p-7 sm:p-8 border border-amber-200/60 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
            <div className="mb-5 flex items-center gap-2 text-xs font-[900] text-[#F59E0B] uppercase tracking-wider">
              <FileText size={16} />
              <span>Core Focus Areas</span>
            </div>
            <div className="space-y-3.5">
              {[
                { title: 'Data Analytics', desc: 'Statistical methods and tools for analyzing large datasets.' },
                { title: 'Machine Learning', desc: 'Building predictive models and intelligent systems.' },
                { title: 'Big Data Systems', desc: 'Distributed computing and storage for massive data.' },
                { title: 'Artificial Intelligence', desc: 'Neural networks, NLP, and computer vision.' },
              ].map((focus) => (
                <div 
                  key={focus.title} 
                  className="group rounded-[20px] bg-white p-4.5 border border-[#0F172A]/[0.08] shadow-xs transition-all duration-300 hover:border-[#F59E0B] hover:shadow-md"
                >
                  <h4 className="font-[900] text-[#0F172A] group-hover:text-[#F59E0B] transition-colors text-base">{focus.title}</h4>
                  <p className="mt-1 text-xs font-semibold text-slate-500 leading-relaxed">{focus.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curriculum Grid */}
        <div className="mb-20">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-[900] text-[#0F172A] tracking-tight">Semester-wise Curriculum</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">Complete subject breakdown across 8 semesters.</p>
            </div>
            <a 
              href="https://vignanits.ac.in/academics/syllabus.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#F59E0B] hover:underline flex items-center gap-1"
            >
              Official Syllabus Portal <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {curriculum.map((item) => (
              <div 
                key={item.sem} 
                className="group rounded-[22px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F59E0B] hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex items-center gap-2 text-[#0F172A]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20">
                      <BookOpen size={16} />
                    </div>
                    <h3 className="font-[900] text-base group-hover:text-[#F59E0B] transition-colors">{item.sem}</h3>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    {item.subjects.map((sub) => (
                      <li key={sub} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                        <span className="leading-snug">{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laboratories Section */}
        <LaboratoriesSection />

      </div>
    </div>
  );
}
