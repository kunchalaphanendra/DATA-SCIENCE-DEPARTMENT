import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Faculty', href: '/faculty' },
  { name: 'Courses', href: '/courses' },
  { name: 'Events', href: '/events' },
  { name: 'Notices', href: '/notices' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Placements', href: '/placements' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Research', href: '/research' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-3 z-50 mx-auto w-[92%] max-w-[1280px]">
      <nav 
        className="relative h-[64px] w-full rounded-full bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-xl shadow-slate-900/5 text-slate-800 transition-all duration-300 flex items-center px-4 sm:px-6 justify-between"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-amber-500/10 ring-2 ring-amber-500/30 p-0.5 transition-transform group-hover:scale-105">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Vignan_logo.png" 
                alt="VITS Logo" 
                className="h-full w-full object-contain" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-black tracking-tight text-slate-900 leading-tight">VITS</span>
              <span className="text-[11px] font-bold leading-tight text-amber-500">CSE (Data Science)</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200",
                  location.pathname === link.href 
                    ? "bg-amber-50 text-amber-500 font-bold shadow-sm" 
                    : "text-slate-700 hover:text-amber-500 hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              className="ml-2 flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 px-5 py-2 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-amber-500/25"
            >
              <Shield size={16} />
              Admin
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to={user ? "/admin/dashboard" : "/admin/login"}
            className="flex items-center gap-1 rounded-full bg-[#F59E0B] hover:bg-[#e08906] px-4 py-2 text-sm font-bold text-white transition-all shadow-sm"
          >
            <Shield size={15} />
            Admin
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 top-[80px] w-full overflow-hidden rounded-3xl border border-white/70 bg-white/95 backdrop-blur-2xl shadow-2xl p-4 lg:hidden z-50">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                    location.pathname === link.href 
                      ? "bg-[#F59E0B]/10 text-[#F59E0B] font-bold" 
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={user ? "/admin/dashboard" : "/admin/login"}
                onClick={() => setIsOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F59E0B] hover:bg-[#e08906] px-4 py-3 text-base font-bold text-white transition-colors shadow-md shadow-[#F59E0B]/20"
              >
                <Shield size={18} />
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
