import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUpRight, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 border-t border-slate-200/80 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Dept Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/20">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="text-lg font-[900] text-[#0F172A] tracking-tight">CSE (Data Science)</h3>
                <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">Vignan Institute of Tech & Science</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              Empowering future data scientists with world-class education, cutting-edge AI labs, and industry-aligned research excellence.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200/80 text-slate-600 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFF7ED] hover:text-[#F59E0B] hover:border-[#F59E0B]/50 hover:shadow-md"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-[900] text-[#0F172A] uppercase tracking-widest border-l-3 border-[#F59E0B] pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
              {[
                { name: 'About Department', path: '/about' },
                { name: 'Faculty Profiles', path: '/faculty' },
                { name: 'Curriculum & Courses', path: '/courses' },
                { name: 'Placements & Statistics', path: '/placements' },
                { name: 'Department Gallery', path: '/gallery' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-[#F59E0B]"
                  >
                    <span className="text-[#F59E0B] transition-transform duration-200 group-hover:translate-x-1">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xs font-[900] text-[#0F172A] uppercase tracking-widest border-l-3 border-[#F59E0B] pl-2.5">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-600">
              <li>
                <a 
                  href="https://maps.google.com/?q=Vignan+Institute+of+Technology+and+Science+Deshmukhi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2.5 transition-colors hover:text-[#F59E0B]"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20 transition-colors group-hover:bg-[#F59E0B] group-hover:text-white">
                    <MapPin size={14} />
                  </div>
                  <span className="leading-snug">Deshmukhi(V), Yadadri Bhuvanagiri(Dist), Telangana - 508284</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919876543210" 
                  className="group flex items-center gap-2.5 transition-colors hover:text-[#F59E0B]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20 transition-colors group-hover:bg-[#F59E0B] group-hover:text-white">
                    <Phone size={14} />
                  </div>
                  <span>+91 9876543210</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hod.cseds@vignanits.ac.in" 
                  className="group flex items-center gap-2.5 transition-colors hover:text-[#F59E0B]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#F59E0B] border border-[#F59E0B]/20 transition-colors group-hover:bg-[#F59E0B] group-hover:text-white">
                    <Mail size={14} />
                  </div>
                  <span className="truncate">hod.cseds@vignanits.ac.in</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Location Map Preview */}
          <div>
            <h3 className="mb-4 text-xs font-[900] text-[#0F172A] uppercase tracking-widest border-l-3 border-[#F59E0B] pl-2.5">
              Campus Location
            </h3>
            <a 
              href="https://maps.google.com/?q=Vignan+Institute+of+Technology+and+Science+Deshmukhi"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:border-[#F59E0B] hover:shadow-md"
            >
              <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                <img 
                  src="/vignan-campus.jpg" 
                  alt="VITS Campus Map Location" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-xs font-bold text-white">
                  <MapPin size={14} className="text-[#F59E0B]" />
                  <span>VITS Campus Map</span>
                  <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </a>
          </div>

        </div>

        {/* Bottom Copyright Divider */}
        <div className="mt-12 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <p>© {new Date().getFullYear()} Vignan Institute of Technology & Science. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-600">
            Designed for <span className="font-bold text-[#0F172A]">CSE (Data Science) Department</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
