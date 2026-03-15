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
    <nav className="sticky top-0 z-50 w-full bg-violet-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-violet-300">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Vignan_logo.png" 
                  alt="VITS Logo" 
                  className="h-full w-full object-contain" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-bold leading-tight">VITS</span>
                <span className="text-[10px] font-medium leading-tight text-amber-500">CSE (Data Science)</span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-violet-800",
                    location.pathname === link.href ? "text-amber-500" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={user ? "/admin/dashboard" : "/admin/login"}
                className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-violet-900 transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
              >
                <Shield size={16} />
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              className="flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-violet-900 transition-all hover:bg-amber-600 hover:scale-105 active:scale-95"
            >
              <Shield size={16} />
              Admin
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 top-16 w-full border-t border-white/10 bg-violet-900 shadow-xl lg:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  location.pathname === link.href ? "bg-violet-800 text-amber-500" : "text-white hover:bg-violet-800"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={user ? "/admin/dashboard" : "/admin/login"}
              onClick={() => setIsOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 hover:bg-amber-600 px-3 py-2 text-base font-bold text-violet-900 transition-colors active:scale-95"
            >
              <Shield size={18} />
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
