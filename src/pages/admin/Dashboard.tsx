import { useState, useEffect } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { supabase } from '@/src/lib/supabase';
import { Megaphone, Calendar, Users, Trophy, Image as ImageIcon, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    notices: 0,
    events: 0,
    faculty: 0,
    achievements: 0,
    gallery: 0,
    placements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tables = ['notices', 'events', 'faculty', 'achievements', 'gallery', 'placements'] as const;
        const counts = await Promise.all(
          tables.map(async (table) => {
            const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
            return count ?? 0;
          })
        );
        setStats({
          notices: counts[0],
          events: counts[1],
          faculty: counts[2],
          achievements: counts[3],
          gallery: counts[4],
          placements: counts[5],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Notices', value: stats.notices, icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/notices' },
    { name: 'Events', value: stats.events, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/events' },
    { name: 'Faculty', value: stats.faculty, icon: Users, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/faculty' },
    { name: 'Achievements', value: stats.achievements, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/achievements' },
    { name: 'Gallery', value: stats.gallery, icon: ImageIcon, color: 'text-pink-600', bg: 'bg-pink-50', href: '/admin/gallery' },
    { name: 'Placements', value: stats.placements, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/placements' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-violet-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening in the department.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="group rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.name}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? '...' : card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-violet-900 opacity-0 transition-opacity group-hover:opacity-100">
              Manage {card.name} →
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 className="mb-6 text-lg font-bold text-violet-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link to="/admin/notices" className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-sm font-bold text-gray-600 hover:border-violet-900 hover:text-violet-900">
              + Add New Notice
            </Link>
            <Link to="/admin/events" className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-sm font-bold text-gray-600 hover:border-violet-900 hover:text-violet-900">
              + Add New Event
            </Link>
            <Link to="/admin/faculty" className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-sm font-bold text-gray-600 hover:border-violet-900 hover:text-violet-900">
              + Add Faculty Member
            </Link>
            <Link to="/admin/gallery" className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-4 text-sm font-bold text-gray-600 hover:border-violet-900 hover:text-violet-900">
              + Upload Gallery Images
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-violet-900 p-8 text-white shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-amber-400">Admin Tip</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            All changes made in this panel are stored in Supabase and reflected on the public website. Images are permanently hosted — they will never disappear after page refresh.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-400">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            System Status: Online & Secure
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
