import { BookOpen, Download, CheckCircle2 } from 'lucide-react';

export default function Courses() {
  const curriculum = [
    { sem: 'Semester I', subjects: ['Matrices and Calculus', 'Engineering Chemistry', 'Programming for Problem Solving', 'Basic Electrical Engineering', 'Computer Aided Engineering Graphics', 'Elements of Computer Science & Engineering', 'Engineering Chemistry Laboratory', 'Programming for Problem Solving Laboratory', 'Basic Electrical Engineering Laboratory'] },
    { sem: 'Semester II', subjects: ['Ordinary Differential Equations and Vector Calculus', 'Applied Physics', 'Engineering Workshop', 'English for Skill Enhancement', 'Electronic Devices and Circuits', 'Python Programming Laboratory', 'Applied Physics Laboratory', 'English Language and Communication Skills Laboratory', 'IT Workshop'] },
    { sem: 'Semester III', subjects: ['Matrices and Calculus', 'Engineering Chemistry', 'Programming for Problem Solving', 'Basic Electrical Engineering', 'Computer Aided Engineering Graphics', 'Elements of Computer Science & Engineering', 'Engineering Chemistry Laboratory', 'Programming for Problem Solving Laboratory', 'Basic Electrical Engineering Laboratory'] },
    { sem: 'Semester IV', subjects: ['Ordinary Differential Equations and Vector Calculus', 'Applied Physics', 'Engineering Workshop', 'English for Skill Enhancement', 'Electronic Devices and Circuits', 'Python Programming Laboratory', 'Applied Physics Laboratory', 'English Language and Communication Skills Laboratory', 'IT Workshop', 'Environmental Science'] },
    { sem: 'Semester V', subjects: ['Algorithms Design and Analysis', 'Introduction to Data Science', 'Computer Networks', 'Professional Elective I', 'Professional Elective II', 'R Programming Lab', 'Computer Networks Lab', 'Advanced English Communication Skills Lab', 'ETL Kafka / Talend', 'Intellectual Property Rights'] },
    { sem: 'Semester VI', subjects: ['Automata Theory and Compiler Design', 'Machine Learning', 'Big Data Analytics', 'Professional Elective III', 'Open Elective I', 'Machine Learning Lab', 'Big Data Analytics Lab', 'Professional Elective III Lab', 'Industrial Oriented Mini Project / Internship / Skill Development', 'Environmental Science'] },
    { sem: 'Semester VII', subjects: ['Predictive Analytics', 'Web and Social Media Analytics', 'Professional Elective IV', 'Professional Elective V', 'Open Elective II', 'Predictive Analytics Lab', 'Web and Social Media Analytics Lab', 'Project Stage I'] },
    { sem: 'Semester VIII', subjects: ['Organizational Behavior', 'Professional Elective VI', 'Open Elective III', 'Project Stage II including Seminar'] },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Courses & Curriculum</h1>
          <p className="mt-4 text-gray-600">B.Tech in Computer Science and Engineering (Data Science)</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Program Overview */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-violet-900">Program Overview</h2>
            <p className="mb-6 text-gray-600 leading-relaxed">
              The B.Tech in CSE (Data Science) is a 4-year undergraduate program designed to provide students with a solid foundation in computer science while specializing in the rapidly growing field of data analytics and artificial intelligence.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                '4 Years Duration',
                '8 Semesters',
                'Industry Aligned',
                'Research Oriented',
                'Hands-on Projects',
                'Expert Faculty'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle2 size={18} className="text-amber-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <a 
              href="https://vignanits.ac.in/syllabus-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-violet-900 px-6 py-3 font-bold text-white transition-all hover:bg-violet-800"
            >
              <Download size={20} />
              Download Full Syllabus (PDF)
            </a>
          </div>
          <div className="rounded-2xl bg-amber-50 p-8 shadow-inner">
            <h3 className="mb-6 text-xl font-bold text-violet-900">Core Focus Areas</h3>
            <div className="space-y-4">
              {[
                { title: 'Data Analytics', desc: 'Statistical methods and tools for analyzing large datasets.' },
                { title: 'Machine Learning', desc: 'Building predictive models and intelligent systems.' },
                { title: 'Big Data Systems', desc: 'Distributed computing and storage for massive data.' },
                { title: 'Artificial Intelligence', desc: 'Neural networks, NLP, and computer vision.' },
              ].map((focus) => (
                <div key={focus.title} className="rounded-xl bg-white p-4 shadow-sm">
                  <h4 className="font-bold text-violet-900">{focus.title}</h4>
                  <p className="text-sm text-gray-600">{focus.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curriculum Table */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-violet-900">Semester-wise Curriculum</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {curriculum.map((item) => (
              <div key={item.sem} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex items-center gap-2 text-violet-900">
                  <BookOpen size={20} className="text-amber-500" />
                  <h3 className="font-bold">{item.sem}</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {item.subjects.map((sub) => (
                    <li key={sub} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
