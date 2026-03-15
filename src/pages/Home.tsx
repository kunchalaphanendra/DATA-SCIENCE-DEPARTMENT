import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, GraduationCap, Building2, Calendar, Trophy, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Notice, Event, Achievement } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';
import { cn } from '@/src/lib/utils';

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

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
    supabase.from('achievements').select('*').order('created_at', { ascending: false }).limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAchievements(data.map(r => ({
            id: r.id, studentName: r.student_name, title: r.title,
            category: r.category, year: r.year, description: r.description, photoUrl: r.photo_url || '',
          })));
        } else {
          setAchievements(defaultAchievementsData.slice(0, 3));
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
    <div className="flex flex-col">
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

      {/* Notice Ticker */}
      <div className="bg-amber-500 py-2 text-violet-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex shrink-0 items-center gap-2 font-bold uppercase tracking-wider">
              <Megaphone size={18} />
              <span>Latest Notices:</span>
            </div>
            <div className="flex animate-marquee gap-8">
              {notices.length > 0 ? notices.map((notice) => (
                <span key={notice.id} className="font-medium">
                  {notice.priority === 'High' && <span className="mr-1 text-red-700 font-bold">[URGENT]</span>}
                  {notice.title} •
                </span>
              )) : (
                <span className="italic">No active notices at the moment.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Students', value: '480+', icon: Users },
              { label: 'Faculty', value: '24+', icon: GraduationCap },
              { label: 'Placed Students', value: '150+', icon: Trophy },
              { label: 'Years Est.', value: '4', icon: Building2 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center rounded-2xl bg-gray-50 p-6 text-center shadow-sm"
              >
                <stat.icon className="mb-4 text-violet-900" size={32} />
                <span className="text-3xl font-bold text-violet-900">{stat.value}</span>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-violet-900">Upcoming Events</h2>
              <p className="mt-2 text-gray-600">Stay updated with our latest workshops and seminars.</p>
            </div>
            <Link to="/events" className="flex items-center gap-1 font-bold text-violet-900 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.imageUrl || `https://picsum.photos/seed/${event.id}/600/400`}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-violet-900">{event.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500 italic">No events found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Achievements Preview */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-violet-900">Student Achievements</h2>
              <p className="mt-2 text-gray-600">Celebrating the excellence of our bright minds.</p>
            </div>
            <Link to="/achievements" className="flex items-center gap-1 font-bold text-violet-900 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center rounded-2xl border border-gray-100 p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-amber-100">
                  <img
                    src={achievement.photoUrl || `https://picsum.photos/seed/${achievement.id}/200/200`}
                    alt={achievement.studentName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-violet-900">{achievement.studentName}</h3>
                <span className="text-sm font-bold text-amber-600">{achievement.title}</span>
                <p className="mt-3 text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500 italic">No achievements posted yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
