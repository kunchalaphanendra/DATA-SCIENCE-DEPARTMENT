import { motion } from 'motion/react';
import { Target, Eye, Award, BookOpen, Sparkles, CheckCircle2, ShieldCheck, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-16 sm:py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 px-3.5 py-1 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-3 border border-[#F59E0B]/20">
            <Sparkles size={14} /> Department Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-[900] text-[#0F172A] tracking-tight">About the Department</h1>
          <p className="mt-2 text-base sm:text-lg font-medium text-slate-600 max-w-2xl mx-auto">
            Producing high-quality Data Science & Artificial Intelligence professionals.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#F59E0B] to-amber-300" />
        </div>

        {/* Overview */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
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
                '✨ Established in 2020',
                '📊 AI & Data Analytics Focus',
                '🔬 Advanced Research Labs',
                '🏆 95% Placement Record',
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

        {/* Vision & Mission */}
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[24px] bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#1E1B4B] p-8 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30">
                <Eye size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-[900] text-[#F59E0B] tracking-tight">Our Vision</h3>
              <p className="text-slate-300 font-medium text-base leading-relaxed">
                To be a center of excellence in Computer Science and Engineering (Data Science) by imparting quality education, fostering research, and nurturing ethical professionals to meet the global challenges of the data-driven world.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[24px] bg-white p-8 sm:p-10 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#0F172A]/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20">
                <Target size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-[900] text-[#0F172A] tracking-tight">Our Mission</h3>
              <ul className="space-y-3.5 text-slate-600 font-medium text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <span>To provide a strong foundation in computer science and data science through innovative teaching-learning processes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <span>To encourage research and development in the field of Data Science and AI.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#F59E0B]" />
                  <span>To bridge the gap between academia and industry through continuous collaboration and skill development.</span>
                </li>
              </ul>
            </div>
          </motion.div>
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

      </div>
    </div>
  );
}
