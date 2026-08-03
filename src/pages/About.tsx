import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, BookOpen, Sparkles, ShieldCheck, GraduationCap, FlaskConical } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { BoardMember } from '@/src/types';
import { defaultBoardMembers } from '@/src/data/boardOfStudiesData';
import LaboratoriesSection from '@/src/components/LaboratoriesSection';

const posData = [
  { code: 'PO1', title: 'Engineering Knowledge', description: 'Apply knowledge of Mathematics, Natural Science, Computing, Engineering Fundamentals and an Engineering Specialization to develop solutions for complex engineering problems.' },
  { code: 'PO2', title: 'Problem Analysis', description: 'Identify, formulate, review research literature and analyze complex engineering problems reaching substantiated conclusions with consideration for sustainable development.' },
  { code: 'PO3', title: 'Design/Development of Solutions', description: 'Design creative solutions for complex engineering problems and design/develop systems/components/processes to meet identified needs.' },
  { code: 'PO4', title: 'Conduct Investigations of Complex Problems', description: 'Conduct investigations using research-based knowledge including design of experiments, modelling, analysis and interpretation of data.' },
  { code: 'PO5', title: 'Engineering Tool Usage', description: 'Create, select and apply appropriate techniques, resources and modern engineering & IT tools.' },
  { code: 'PO6', title: 'The Engineer and The World', description: 'Analyze and evaluate societal and environmental aspects while solving complex engineering problems.' },
  { code: 'PO7', title: 'Ethics', description: 'Apply ethical principles and commit to professional ethics, human values, diversity and inclusion.' },
  { code: 'PO8', title: 'Individual and Collaborative Team Work', description: 'Function effectively as an individual and as a member or leader in diverse teams.' },
  { code: 'PO9', title: 'Communication', description: 'Communicate effectively within the engineering community and society at large.' },
  { code: 'PO10', title: 'Project Management and Finance', description: 'Apply engineering management principles and economic decision-making.' },
  { code: 'PO11', title: 'Life-Long Learning', description: 'Recognize the need for independent and life-long learning and adaptability to emerging technologies.' },
];

const psosData = [
  { code: 'PSO1', description: 'PSO-1: Design. Implement and test application software in the field of data science' },
  { code: 'PSO2', description: 'PSO-2: Understand the architecture and organization of computer systems to develop data science tools.' },
  { code: 'PSO3', description: 'PSO-3 : To use specialized softwares to carry out statistical data analysis' },
];

const peosData = [
  { code: 'PEO-1', description: 'Emerge as engineers, innovators, entrepreneurs with social awareness and ethical values.' },
  { code: 'PEO-2', description: 'Work in teams in multidisciplinary areas addressing the needs of society.' },
  { code: 'PEO3', description: 'Inculcate self learning and lifelong learning adapting cutting edge technologies.' },
];

export default function About() {
  const [activeTab, setActiveTab] = useState<'about' | 'vision' | 'pos' | 'psos' | 'peos' | 'bos' | 'labs'>('about');
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

  useEffect(() => {
    const loadBOSData = () => {
      const stored = localStorage.getItem('vits_bos_members_v3');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length >= defaultBoardMembers.length) {
            return parsed;
          }
        } catch (e) {}
      }
      return defaultBoardMembers;
    };

    const fetchBOS = async () => {
      try {
        const { data, error } = await supabase.from('board_of_studies').select('*').order('order', { ascending: true });
        if (!error && data && data.length > 0) {
          setBoardMembers(data.map(r => ({
            id: r.id,
            facultyId: r.faculty_id || '',
            name: r.name,
            designation: r.designation,
            organization: r.organization || 'Vignan Institute of Technology & Science',
            role: r.role || 'Member',
            email: r.email || '',
            photoUrl: r.photo_url || '',
            order: r.order || 0,
          })));
        } else {
          setBoardMembers(loadBOSData());
        }
      } catch (err) {
        setBoardMembers(loadBOSData());
      }
    };
    fetchBOS();
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-16 sm:py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 px-3.5 py-1 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3 border border-[#F59E0B]/20">
            <Sparkles size={14} /> Department Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-[900] text-[#0F172A] tracking-tight">About the Department</h1>
          <p className="mt-2 text-base sm:text-lg font-medium text-slate-600 max-w-2xl mx-auto">
            Producing high-quality Data Science & Artificial Intelligence professionals.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#F59E0B] to-amber-300" />
        </div>

        {/* Tab Navigation */}
        <div className="mb-10 flex flex-wrap items-center justify-start sm:justify-center gap-2.5">
          {[
            { id: 'about', label: 'About' },
            { id: 'vision', label: 'Vision & Mission' },
            { id: 'pos', label: 'POs' },
            { id: 'psos', label: 'PSOs' },
            { id: 'peos', label: 'PEOs' },
            { id: 'bos', label: 'Board of Studies' },
            { id: 'labs', label: 'Laboratories' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-xs ${
                activeTab === tab.id
                  ? 'bg-[#a21caf] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Overview */}
            <div className="mb-16 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl sm:text-3xl font-[900] text-[#0F172A] tracking-tight">History & Overview</h2>
                <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
                  The Department of Computer Science and Engineering (Data Science) at Vignan Institute of Technology and Science was established in <span className="font-extrabold text-[#0F172A]">2020</span> with a vision to produce high-quality professionals in the emerging field of Data Science and Artificial Intelligence.
                </p>
                <p className="text-sm sm:text-base font-normal text-slate-600 leading-relaxed">
                  Our department offers a comprehensive B.Tech program that combines core computer science principles with advanced data analytics, machine learning, and statistical modeling. We focus on hands-on learning through modern labs, industry collaborations, and research-oriented projects.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {[
                    'Established in 2020',
                    'AI & Data Analytics Focus',
                    'Advanced Research Labs',
                    '95% Placement Record',
                  ].map((pill) => (
                    <span 
                      key={pill} 
                      className="rounded-full bg-[#FFF7ED] border border-[#F59E0B]/25 px-4 py-1.5 text-xs font-bold text-[#F59E0B] shadow-xs"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Campus Image Card */}
              <div className="group relative overflow-hidden rounded-[28px] border border-[#0F172A]/[0.08] shadow-[0_20px_50px_rgba(15,23,42,0.1)] bg-white cursor-pointer">
                <div className="relative h-[360px] sm:h-[400px] w-full overflow-hidden">
                  <img 
                    src="/vignan-campus.jpg" 
                    alt="VITS Campus Building" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
                </div>

                {/* Floating Glass Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 rounded-[20px] bg-white/90 backdrop-blur-md p-4 border border-white/80 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/20">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-[900] text-[#0F172A]">Vignan Institute of Tech & Science</h4>
                      <p className="text-xs font-bold text-[#F59E0B]">CSE (Data Science) Campus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Highlights Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'JNTUH Affiliated', icon: ShieldCheck, desc: 'Recognized & affiliated with JNTU Hyderabad' },
                { title: 'NBA Accredited', icon: Award, desc: 'Highest standards of quality assurance in education' },
                { title: 'Modern AI & Data Labs', icon: BookOpen, desc: 'State-of-the-art high-performance computing labs' },
                { title: 'Industry-Ready Curriculum', icon: Target, desc: 'Curriculum continuously aligned with tech industry demands' },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="group rounded-[24px] bg-gradient-to-b from-white to-[#FCFCFD] p-7 text-center border border-[#0F172A]/[0.08] shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F59E0B] hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)] cursor-pointer"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20 mx-auto transition-colors duration-300 group-hover:bg-[#F59E0B] group-hover:text-white">
                    <item.icon size={26} />
                  </div>
                  <h4 className="mb-1.5 text-lg font-[900] text-[#0F172A] group-hover:text-[#F59E0B] transition-colors">{item.title}</h4>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'vision' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="grid gap-8 md:grid-cols-2">
            {/* Vision */}
            <div className="rounded-[24px] bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#1E1B4B] p-8 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30">
                  <Eye size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-[900] text-[#F59E0B] tracking-tight">Our Vision</h3>
                <p className="text-slate-300 font-medium text-base leading-relaxed">
                  To be a center of excellence in Computer Science and Engineering (Data Science) by imparting quality education, fostering research, and nurturing ethical professionals to meet the global challenges of the data-driven world.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="rounded-[24px] bg-white p-8 sm:p-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#0F172A]/[0.08] flex flex-col justify-between">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20">
                  <Target size={24} />
                </div>
                <h3 className="mb-3 text-2xl font-[900] text-[#0F172A] tracking-tight">Our Mission</h3>
                <ul className="space-y-3.5 text-slate-600 font-medium text-sm sm:text-base">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
                    <span>To provide a strong foundation in computer science and data science through innovative teaching-learning processes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
                    <span>To encourage research and development in the field of Data Science and AI.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
                    <span>To bridge the gap between academia and industry through continuous collaboration and skill development.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-sm">
            <h2 className="text-2xl font-[900] text-slate-900 mb-6">Program Outcomes (POs)</h2>
            <div className="space-y-4">
              {posData.map((po) => (
                <div key={po.code} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-200 transition-all">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#a21caf]" />
                  <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-slate-900">{po.code}: </span>
                    <span className="font-extrabold text-slate-900">{po.title}: </span>
                    {po.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'psos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-sm">
            <h2 className="text-2xl font-[900] text-slate-900 mb-6">Program Specific Outcomes (PSOs)</h2>
            <div className="space-y-4">
              {psosData.map((pso) => (
                <div key={pso.code} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-200 transition-all">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#a21caf]" />
                  <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-slate-900">{pso.code}: </span>
                    {pso.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'peos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-sm">
            <h2 className="text-2xl font-[900] text-slate-900 mb-6">Program Educational Objectives (PEOs)</h2>
            <div className="space-y-4">
              {peosData.map((peo) => (
                <div key={peo.code} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-200 transition-all">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#a21caf]" />
                  <p className="text-sm sm:text-base font-normal text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-slate-900">{peo.code}: </span>
                    {peo.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'bos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/70 shadow-sm">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-[900] text-slate-900 flex items-center gap-2">
                  <GraduationCap className="text-[#a21caf]" size={28} />
                  Board of Studies Members
                </h2>
                <p className="text-sm text-slate-600 mt-1">Distinguished faculty & industry experts advising department curriculum & academic excellence.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boardMembers.map((m) => (
                <div key={m.id} className="flex items-center p-5 rounded-[20px] shadow-sm border border-slate-100 bg-white hover:shadow-md transition-all">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-4 border-violet-100 shadow-sm">
                      <img
                        src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block rounded-full bg-violet-100 text-violet-800 text-[11px] font-bold px-2.5 py-0.5 mb-1">
                      {m.role}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 truncate">{m.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 truncate">{m.designation}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{m.organization}</p>
                    {m.email && <p className="text-xs text-slate-400 truncate mt-0.5">{m.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'labs' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <LaboratoriesSection />
          </motion.div>
        )}

      </div>
    </div>
  );
}
