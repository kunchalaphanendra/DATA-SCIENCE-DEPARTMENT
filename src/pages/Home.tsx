import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'motion/react';
import { ArrowRight, Users, GraduationCap, Building2, Calendar, Trophy, Megaphone, Briefcase, BookOpen, Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Notice, Event, Achievement, Placement, Faculty } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';
import { defaultFacultyData } from '@/src/data/facultyData';
import { cn } from '@/src/lib/utils';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

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
    // Load notices
    supabase.from('notices').select('*').order('date', { ascending: false }).limit(5)
      .then(({ data }) => {
        if (data) setNotices(data.map(r => ({
          id: r.id, title: r.title, content: r.content, date: r.date, priority: r.priority,
        })));
      });

    // Load events
    supabase.from('events').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => {
        if (data) setEvents(data.map(r => ({
          id: r.id, title: r.title, description: r.description, date: r.date,
          venue: r.venue, category: r.category, status: r.status, imageUrl: r.image_url || '',
        })));
      });

    // Load achievements
    supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAchievements(data.map(r => ({
            id: r.id, studentName: r.student_name, title: r.title,
            category: r.category, year: r.year, description: r.description, photoUrl: r.photo_url || '',
          })));
        } else {
          setAchievements(defaultAchievementsData.slice(0, 6));
        }
      });
      
    // Load placements
    supabase.from('placements').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPlacements(data.map(r => ({
            id: r.id, studentName: r.student_name, company: r.company,
            package: r.package, batchYear: r.batch_year, photoUrl: r.photo_url || '',
          })));
        }
      });

    // Load faculty
    supabase.from('faculty').select('*').order('order', { ascending: true }).limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setFaculty(data.map(r => ({
            id: r.id, name: r.name, designation: r.designation,
            qualification: r.qualification, specialization: r.specialization,
            email: r.email, linkedin: r.linkedin || '', departmentRole: r.department_role || '',
            portfolioUrl: r.portfolio_url || '', experience: r.experience || '',
            publications: r.publications || [], awards: r.awards || [], photoUrl: r.photo_url || '',
            order: r.order || 0,
          })));
        } else {
          setFaculty(defaultFacultyData.slice(0, 3));
        }
      });

    // Real-time for notices (so ticker updates live)
    const channel = supabase.channel('home-notices')
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
      <section className="relative flex h-[calc(100vh-104px)] items-center justify-center overflow-hidden bg-violet-900">
        <div className="absolute inset-0">
          <img
            src="https://vignanits.ac.in/wp-content/uploads/2020/07/IMG-20200713-WA0016.jpg"
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/50 to-black/80" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Computer Science & Engineering
            <span className="block text-amber-500">(Data Science)</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-medium text-white drop-shadow sm:text-xl"
          >
            Empowering the next generation of data scientists and AI engineers at Vignan Institute of Technology and Science.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 text-lg font-bold text-violet-900 shadow-lg transition-all hover:bg-amber-600 hover:shadow-xl"
            >
              Explore Department <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Notice Board Preview (Vertical Scroll) & Quick Stats */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            
            {/* Left: Notice Board */}
            <div className="col-span-1 flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-violet-900">
                  <Megaphone size={20} className="text-amber-500" />
                  <span>Notice Board</span>
                </div>
                <Link to="/notices" className="text-sm font-bold text-violet-900 hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="relative flex-1 overflow-hidden h-[300px]">
                {notices.length > 0 ? (
                  <div className="absolute inset-0 flex flex-col gap-4 animate-scroll-y group-hover:[animation-play-state:paused] hover:[animation-play-state:paused]">
                    {[...notices, ...notices].map((notice, idx) => (
                      <div key={`${notice.id}-${idx}`} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600">{notice.date}</span>
                          {notice.priority === 'High' && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">URGENT</span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 line-clamp-2">{notice.title}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm italic text-gray-500">
                    No active notices.
                  </div>
                )}
                {/* Fade overlays */}
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-white to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-6 sm:grid-cols-4 content-center">
              {[
                { label: 'Students', value: '480+', icon: Users },
                { label: 'Faculty', value: '24+', icon: GraduationCap },
                { label: 'Placed', value: '150+', icon: Trophy },
                { label: 'Years Est.', value: '4', icon: Building2 },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center justify-center rounded-3xl bg-violet-50/50 p-6 text-center transition-shadow shadow-sm hover:shadow-md border border-violet-100/50"
                >
                  <div className="mb-4 rounded-full bg-white p-3 shadow-sm">
                    <stat.icon className="text-violet-900" size={28} />
                  </div>
                  <span className="text-3xl font-extrabold text-violet-900">{stat.value}</span>
                  <span className="mt-1 text-sm font-bold text-gray-500">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Carousel Preview */}
      <section className="bg-gray-50 py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-violet-900">Latest Achievements</h2>
            <p className="mt-2 text-gray-600">Celebrating the excellence of our bright minds.</p>
          </div>
          <Link to="/achievements" className="flex items-center gap-2 rounded-full border-2 border-violet-900 px-5 py-2 text-sm font-bold text-violet-900 hover:bg-violet-900 hover:text-white transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative flex w-full overflow-hidden">
          {/* Scroll Track */}
          {achievements.length > 0 ? (
            <div className="flex animate-scroll-x hover:[animation-play-state:paused] w-max">
              {[...achievements, ...achievements].map((achievement, idx) => (
                <div key={`${achievement.id}-${idx}`} className="w-[300px] shrink-0 px-4">
                  <div className="flex h-full flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-lg shadow-gray-200/40 transition-transform hover:-translate-y-2">
                    <div className="mb-5 h-24 w-24 overflow-hidden rounded-full border-4 border-amber-100 shadow-inner">
                      <img
                        src={achievement.photoUrl || `https://picsum.photos/seed/${achievement.id}/200/200`}
                        alt={achievement.studentName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      <Trophy size={12} />
                      {achievement.year}
                    </div>
                    <h3 className="text-lg font-extrabold text-violet-900">{achievement.studentName}</h3>
                    <span className="mt-1 text-sm font-bold text-gray-500 line-clamp-1">{achievement.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="w-full text-center text-gray-500 italic">No achievements found.</div>
          )}
          {/* Fade overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent" />
        </div>
      </section>

      {/* Placements Preview */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-violet-900">Recent Placements</h2>
              <p className="mt-2 text-gray-600">Our students at top companies.</p>
            </div>
            <Link to="/placements" className="flex items-center gap-2 rounded-full border-2 border-violet-900 px-5 py-2 text-sm font-bold text-violet-900 hover:bg-violet-900 hover:text-white transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {placements.map((p) => (
              <div key={p.id} className="group overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/40 border border-gray-100 transition-all hover:-translate-y-2">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={p.photoUrl || `https://picsum.photos/seed/${p.id}/400/400`}
                    alt={p.studentName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="relative p-6 bg-white -mt-6 rounded-t-3xl border-t border-gray-50">
                  <div className="absolute right-6 top-6 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    {p.package}
                  </div>
                  <h3 className="text-xl font-extrabold text-violet-900">{p.studentName}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-500">
                    <Briefcase size={16} className="text-amber-500" />
                    {p.company}
                  </div>
                </div>
              </div>
            ))}
            {placements.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500 italic">No placements found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="bg-violet-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
              <p className="mt-2 text-violet-200">Workshops, seminars, and hackathons.</p>
            </div>
            <Link to="/events" className="flex items-center gap-2 rounded-full border-2 border-white px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-violet-900 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="group overflow-hidden rounded-3xl bg-violet-800 shadow-xl transition-all hover:bg-violet-700 border border-violet-700">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{event.title}</h3>
                  <p className="line-clamp-2 text-sm text-violet-200">{event.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-3 py-12 text-center text-violet-300 italic">No events found.</div>
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
                  <Link to="/courses" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">View Syllabus</Link>
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

