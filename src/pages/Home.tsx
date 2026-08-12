import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'motion/react';
import { ArrowRight, Users, GraduationCap, Building2, Calendar, Trophy, Megaphone, Briefcase, BookOpen, Beaker, ChevronDown, Sparkles, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Notice, Event, Achievement, Placement, Faculty } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';
import { defaultFacultyData } from '@/src/data/facultyData';
import { loadMergedPlacements } from '@/src/lib/placementsStorage';
import { loadMergedAchievements } from '@/src/lib/achievementsStorage';
import { loadMergedEvents } from '@/src/lib/eventsStorage';
import { cn } from '@/src/lib/utils';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>(() => loadMergedEvents([]).slice(0, 3));
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadMergedAchievements([]).slice(0, 3));
  const [placements, setPlacements] = useState<Placement[]>(() => {
    const all = loadMergedPlacements([]);
    return [...all].sort((a, b) => {
      const pkgA = parseFloat(a.package.toString().replace(/[^0-9.]/g, '')) || 0;
      const pkgB = parseFloat(b.package.toString().replace(/[^0-9.]/g, '')) || 0;
      return pkgB - pkgA;
    }).slice(0, 8);
  });
  const [faculty, setFaculty] = useState<Faculty[]>(defaultFacultyData.slice(0, 6));

  // Static Previews
  const topCourses = [
    { title: 'Machine Learning', desc: 'Building predictive models and intelligent systems.' },
    { title: 'Big Data Systems', desc: 'Distributed computing and storage for massive data.' },
    { title: 'Artificial Intelligence', desc: 'Neural networks, NLP, and computer vision.' },
  ];

  const topResearch = [
    { title: 'AI-based Crop Disease Detection', lead: 'Dr. A. Ramesh' },
    { title: 'Smart Traffic Management using IoT', lead: 'Mrs. K. Saritha' },
    { title: 'Sentiment Analysis for Regional Languages', lead: 'Mr. P. Suresh' },
  ];

  useEffect(() => {
    // Independent non-blocking queries
    supabase.from('notices').select('*').order('date', { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setNotices(data); });

    supabase.from('events').select('*').order('date', { ascending: false }).limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const remoteEvents: Event[] = data.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            date: r.date,
            venue: r.venue,
            category: r.category,
            status: r.status,
            imageUrl: r.image_url || r.imageUrl || '',
          }));
          setEvents(loadMergedEvents(remoteEvents).slice(0, 3));
        }
      });

    supabase.from('achievements').select('*').order('id', { ascending: false }).limit(3)
      .then(({ data }) => {
        setAchievements(loadMergedAchievements(data || []).slice(0, 3));
      });

    supabase.from('placements').select('*')
      .then(({ data }) => {
        const allPlacements = loadMergedPlacements(data || []);
        const sorted = [...allPlacements].sort((a, b) => {
          const pkgA = parseFloat(a.package.toString().replace(/[^0-9.]/g, '')) || 0;
          const pkgB = parseFloat(b.package.toString().replace(/[^0-9.]/g, '')) || 0;
          return pkgB - pkgA;
        });
        setPlacements(sorted.slice(0, 8));
      });

    supabase.from('faculty').select('*').order('order', { ascending: true }).limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFaculty(data.map(r => ({
            id: r.id,
            name: r.name,
            designation: r.designation,
            qualification: r.qualification,
            specialization: r.specialization,
            email: r.email,
            linkedin: r.linkedin || '',
            departmentRole: r.department_role || '',
            portfolioUrl: r.portfolio_url || '',
            experience: r.experience || '',
            publications: r.publications || [],
            awards: r.awards || [],
            photoUrl: r.photo_url || '',
            order: r.order || 0,
          })));
        }
      });
  }, []);

    // Setup Realtime Subscription for Notices
    const channel = supabase
      .channel('notices-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => {
        supabase.from('notices').select('*').order('date', { ascending: false }).limit(5)
          .then(({ data }) => {
            if (data) setNotices(data.map(r => ({
              id: r.id, title: r.title, content: r.content, date: r.date, priority: r.priority,
            })));
          });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-80px)] min-h-[560px] w-full overflow-hidden bg-sky-100">
        {/* Hidden SVG Filter for Real-time Hardware Image Sharpening */}
        <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
          <filter id="sharpen-filter">
            <feConvolveMatrix
              order="3,3"
              preserveAlpha="true"
              kernelMatrix="0 -0.15 0  -0.15 1.6 -0.15  0 -0.15 0"
            />
          </filter>
        </svg>

        {/* Background Campus Image - Enhanced Clarity, Vivid Sky, Hardware Sharpened */}
        <div className="absolute inset-0 z-0">
          <img
            src="/vignan-campus.jpg"
            alt="Vignan Institute of Technology and Science Campus"
            className="h-full w-full object-cover object-[center_72%]"
            style={{
              filter: 'url(#sharpen-filter) contrast(1.08) brightness(1.03) saturate(1.08)',
              WebkitFilter: 'url(#sharpen-filter) contrast(1.08) brightness(1.03) saturate(1.08)',
            }}
          />
          {/* Extremely soft top gradient to preserve natural sky clarity and bright colors */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 30%, transparent 65%)',
            }}
          />
        </div>

        {/* Hero Content - Placed high in top blue sky area */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-start px-4 pt-3 text-center sm:px-6 sm:pt-5 md:pt-6 lg:px-8">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-['Poppins',sans-serif] text-3xl font-[900] tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl lg:text-[52px] leading-tight"
            style={{
              textShadow: '0 1px 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.5)',
            }}
          >
            Computer Science & Engineering
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            className="mt-0.5 font-['Poppins',sans-serif] text-2xl font-[800] text-[#F59E0B] sm:text-3xl md:text-4xl lg:text-[38px]"
            style={{
              textShadow: '0 1px 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.5)',
            }}
          >
            (Data Science)
          </motion.div>

          {/* Description - Clean 2-line text without orphan single words */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="mx-auto mt-3 max-w-xl font-['Inter',sans-serif] text-sm font-[600] leading-relaxed text-[#1E293B] sm:text-base md:text-lg sm:max-w-2xl"
            style={{
              textShadow: '0 1px 6px rgba(255,255,255,0.9)',
            }}
          >
            Empowering the next generation of data scientists and AI engineers at Vignan Institute of Technology and Science.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mt-4 sm:mt-5"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-8 py-3 font-['Inter',sans-serif] text-base font-[700] text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#d98206] hover:shadow-xl active:translate-y-0 sm:text-lg"
            >
              Explore Department <ArrowRight size={20} className="stroke-[2.5]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Page 2 - Fits Notice Board, Stat Cards, and Latest Achievements on one screen fold */}
      <section className="relative z-20 bg-white pt-6 pb-4 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            
            {/* Left: Notice Board */}
            <div className="col-span-1 flex flex-col rounded-[22px] border border-[#0F172A]/[0.08] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <div className="mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-900 text-xs sm:text-sm">
                  <Megaphone size={16} className="text-[#F59E0B]" />
                  <span>Notice Board</span>
                </div>
                <Link to="/notices" className="text-xs font-bold text-[#F59E0B] hover:underline">
                  View All →
                </Link>
              </div>
              
              <div className="relative flex-1 overflow-hidden h-[190px]">
                {notices.length > 0 ? (
                  <div className="absolute inset-0 flex flex-col gap-2.5 animate-scroll-y group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
                    {[...notices, ...notices].map((notice, idx) => (
                      <div key={`${notice.id}-${idx}`} className="rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 transition-colors hover:bg-slate-100/80">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#F59E0B]">{notice.date}</span>
                          {notice.priority === 'High' && (
                            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">URGENT</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{notice.title}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs italic text-slate-500">
                    No active notices.
                  </div>
                )}
                {/* Fade overlays */}
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-4 bg-gradient-to-b from-white to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>

            {/* Right: Compact Stats Grid */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-3.5 sm:grid-cols-4 content-center">
              {[
                { label: 'Students', value: '240+', icon: Users },
                { label: 'Faculty', value: '18+', icon: GraduationCap },
                { label: 'Placed', value: '95%', icon: Trophy },
                { label: 'AI & Data Labs', value: '6+', icon: Beaker },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col items-center justify-center rounded-[22px] bg-gradient-to-b from-white to-[#FCFCFD] p-4 text-center border border-[#0F172A]/[0.08] shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 ease-out hover:-translate-y-[4px] hover:border-[#F59E0B] hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] cursor-pointer h-full"
                >
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/80 text-slate-700 transition-colors duration-300 group-hover:bg-[#FFF7ED] group-hover:text-[#F59E0B]">
                    <stat.icon size={20} />
                  </div>
                  <span className="font-['Inter',sans-serif] text-2xl font-[900] text-[#0F172A] tracking-tight">{stat.value}</span>
                  <span className="mt-0.5 font-['Inter',sans-serif] text-[10px] sm:text-[11px] font-bold text-[#334155] uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bright & Vibrant Achievements Carousel Preview */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 pt-4 pb-8 border-t border-amber-100/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 px-3 py-0.5 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1 border border-[#F59E0B]/20">
              <Trophy size={13} /> Student Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-[900] text-[#0F172A] tracking-tight">Latest Achievements</h2>
            <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-600">Celebrating the remarkable success of our bright minds.</p>
          </div>
          <Link 
            to="/achievements" 
            className="group inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] hover:bg-[#e08906] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#F59E0B]/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            View All <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative flex w-full overflow-hidden py-2">
          {/* Scroll Track - Ultra-smooth 60fps GPU Accelerated */}
          {achievements.length > 0 ? (
            <div className="flex animate-scroll-x hover:[animation-play-state:paused] w-max will-change-transform gap-5 px-4">
              {[...achievements, ...achievements].map((achievement, idx) => (
                <div key={`${achievement.id}-${idx}`} className="w-[270px] shrink-0">
                  <div className="group flex h-full flex-col items-center rounded-[20px] border border-[#0F172A]/[0.08] bg-white p-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:scale-[1.02] hover:border-[#F59E0B] hover:shadow-[0_14px_30px_rgba(245,158,11,0.15)] cursor-pointer">
                    <div className="mb-3 h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#F59E0B]/20 p-0.5 shadow-sm group-hover:ring-[#F59E0B] transition-all duration-300">
                      <img
                        src={achievement.photoUrl || `https://picsum.photos/seed/${achievement.id}/200/200`}
                        alt={achievement.studentName}
                        className="h-full w-full rounded-full object-cover"
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                    <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#FFF7ED] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B] border border-[#F59E0B]/20">
                      <Trophy size={11} />
                      {achievement.year}
                    </div>
                    <h3 className="text-base font-[900] text-[#0F172A] group-hover:text-[#F59E0B] transition-colors">{achievement.studentName}</h3>
                    <span className="mt-0.5 text-xs font-semibold text-slate-600 leading-snug line-clamp-2">{achievement.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full text-center text-slate-500 italic">No achievements found.</div>
          )}
          {/* Edge Fade Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-amber-50/80 via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-amber-50/80 via-white/80 to-transparent z-10" />
        </div>
      </section>

      {/* Page 3 - Recent Placements Preview (4 + 4 Grid, 8 Total Cards) */}
      <section className="bg-white py-12 border-t border-slate-100 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/10 px-3 py-0.5 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider mb-1.5 border border-[#F59E0B]/20">
                <Briefcase size={13} /> Career Opportunities
              </div>
              <h2 className="text-2xl sm:text-3xl font-[900] text-[#0F172A] tracking-tight">Recent Placements</h2>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-600">Our students placed at top global companies.</p>
            </div>
            <Link 
              to="/placements" 
              className="group inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] hover:bg-[#e08906] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#F59E0B]/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View All <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {placements.map((p) => (
              <Link 
                key={p.id} 
                to="/placements"
                className="group flex flex-col justify-between overflow-hidden rounded-[20px] bg-white border border-[#0F172A]/[0.08] shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#F59E0B] hover:shadow-[0_18px_36px_rgba(245,158,11,0.18)] cursor-pointer"
              >
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.photoUrl || `https://picsum.photos/seed/${p.id}/400/400`}
                    alt={p.studentName}
                    className="h-full w-full object-cover object-[center_15%] transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </div>
                <div className="p-4 bg-white flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase size={13} className="text-[#F59E0B]" />
                      {p.company}
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {p.package}
                    </span>
                  </div>
                  <h3 className="text-sm font-[900] text-[#0F172A] group-hover:text-[#F59E0B] transition-colors">{p.studentName}</h3>
                </div>
              </Link>
            ))}
            {placements.length === 0 && (
              <div className="col-span-4 py-12 text-center text-slate-500 italic">No placements found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Premium & Cool Upcoming Events Preview */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#1E1B4B] py-20 text-white border-t border-slate-800">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/15 px-3.5 py-1 text-xs font-bold text-[#F59E0B] uppercase tracking-wider mb-2 border border-[#F59E0B]/30">
                <Calendar size={14} /> Campus Highlights
              </div>
              <h2 className="text-3xl sm:text-4xl font-[900] text-white tracking-tight">Upcoming Events</h2>
              <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-400">Workshops, seminars, hackathons, and technical fests.</p>
            </div>
            <Link 
              to="/events" 
              className="group inline-flex items-center gap-2 rounded-full bg-[#F59E0B] hover:bg-[#e08906] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#F59E0B]/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View All <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {events.map((event) => (
              <Link 
                key={event.id} 
                to="/events"
                className="group flex flex-col justify-between overflow-hidden rounded-[24px] bg-slate-800/80 border border-slate-700/60 backdrop-blur-md shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#F59E0B]/80 hover:shadow-[0_20px_45px_rgba(245,158,11,0.22)] cursor-pointer"
              >
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-900">
                  <img
                    src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none" />
                </div>
                <div className="p-7 flex flex-col gap-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 px-3 py-1 text-xs font-bold text-[#F59E0B] w-max">
                    <Calendar size={13} />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-[900] text-white group-hover:text-[#F59E0B] transition-colors leading-snug">{event.title}</h3>
                  <p className="line-clamp-2 text-sm text-slate-300 font-normal leading-relaxed">{event.description}</p>
                </div>
              </Link>
            ))}
            {events.length === 0 && (
              <div className="col-span-3 py-12 text-center text-slate-400 italic">No events found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Two Column Section: Faculty & Courses/Research */}
      <section className="bg-gray-50/50 py-32 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-20 lg:grid-cols-2">
            
            {/* Faculty Preview */}
            <div className="flex flex-col">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-violet-900 tracking-tight">Featured Faculty</h2>
                  <p className="mt-2 text-base text-gray-500">Mentors guiding the future.</p>
                </div>
                <Link to="/faculty" className="group text-sm font-bold text-violet-900 hover:text-amber-600 transition-colors flex items-center gap-1.5 focus:outline-none">
                  Meet All <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="flex flex-col gap-5 flex-1">
                {faculty.map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                    whileHover={{ y: -6 }}
                    className="group relative flex items-center gap-5 rounded-3xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/80 transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(109,40,217,0.15)] cursor-pointer overflow-hidden"
                  >
                   <div className="absolute inset-0 bg-gradient-to-r from-violet-50/0 via-violet-50/0 to-violet-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                    
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full p-1 bg-gradient-to-tr from-amber-200 via-amber-100 to-violet-100 shadow-sm">
                      <div className="h-full w-full rounded-full overflow-hidden border-2 border-white">
                        <img src={f.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`} alt={f.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-violet-900 truncate group-hover:text-violet-700 transition-colors">{f.name}</h4>
                      <div className="mt-1 inline-flex items-center rounded-full bg-violet-50/80 px-2.5 py-0.5 text-xs font-semibold text-violet-700 truncate max-w-full">
                        {f.designation}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Courses & Research Previews */}
            <div className="flex flex-col gap-14">
              
              {/* Courses */}
              <div>
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-max relative">
                    <div className="absolute -inset-1 bg-blue-100 rounded-xl blur opacity-50"></div>
                    <div className="relative rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 text-blue-600 shadow-sm border border-blue-200/50"><BookOpen size={22} className="drop-shadow-sm"/></div>
                    <h2 className="text-2xl font-bold text-violet-900 tracking-tight">Core Subjects</h2>
                  </div>
                  <a href="https://vignanits.ac.in/academics/syllabus.php" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-[#F59E0B] transition-colors focus:outline-none flex items-center gap-1">View Syllabus →</a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {topCourses.map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                      whileHover={{ scale: 1.03 }}
                      className="group flex flex-col justify-start rounded-2xl border border-blue-100/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30 cursor-pointer h-full"
                    >
                      <div className="mb-3 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        <BookOpen size={14} />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors text-base leading-tight mb-2">{c.title}</h4>
                      <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors leading-relaxed line-clamp-2">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Research */}
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3 w-max relative">
                   <div className="absolute -inset-1 bg-amber-100 rounded-xl blur opacity-50"></div>
                    <div className="relative rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-2.5 text-amber-600 shadow-sm border border-amber-200/50"><Beaker size={22} className="drop-shadow-sm"/></div>
                    <h2 className="text-2xl font-bold text-violet-900 tracking-tight">Research Focus</h2>
                  </div>
                  <Link to="/research" className="group text-sm font-bold text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1.5 focus:outline-none">
                    Projects <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="flex flex-col gap-4">
                  {topResearch.map((r, i) => (
                    <motion.div
                      key={r.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                      className="group relative flex flex-col justify-center rounded-2xl border border-gray-100 bg-white p-5 pl-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-amber-50/10 cursor-pointer overflow-hidden"
                    >
                      {/* Accent Bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 transition-colors duration-300 group-hover:bg-amber-400" />
                      
                      {/* Hover slide effect background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-transparent -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0 pointer-events-none" />

                      <div className="relative z-10 w-full overflow-hidden">
                        <h4 className="font-bold text-gray-900 text-[15px] group-hover:text-violet-900 transition-colors truncate w-full">{r.title}</h4>
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></span>
                           Lead: <span className="text-amber-600 font-bold ml-0.5">{r.lead}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

