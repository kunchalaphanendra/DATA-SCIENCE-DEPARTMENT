import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  LayoutDashboard, 
  Megaphone, 
  Calendar, 
  Users, 
  Trophy, 
  Image as ImageIcon, 
  Briefcase, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Notices', href: '/admin/notices', icon: Megaphone },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Faculty', href: '/admin/faculty', icon: Users },
  { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Placements', href: '/admin/placements', icon: Briefcase },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 bg-white shadow-md lg:block">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Management</h2>
          </div>
          <nav className="flex-grow space-y-1 px-3">
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  location.pathname === link.href 
                    ? "bg-[#1a237e] text-white" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={18} />
                  {link.name}
                </div>
                {location.pathname === link.href && <ChevronRight size={14} />}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
