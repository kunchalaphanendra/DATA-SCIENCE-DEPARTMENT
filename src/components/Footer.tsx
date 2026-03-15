import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] pt-12 pb-6 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Dept Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-amber-400">CSE (Data Science)</h3>
            <p className="mb-4 text-sm text-gray-300">
              Vignan Institute of Technology and Science (VITS) is committed to providing quality education in the field of Data Science.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-amber-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white">About Department</Link></li>
              <li><Link to="/faculty" className="hover:text-white">Faculty Profiles</Link></li>
              <li><Link to="/courses" className="hover:text-white">Curriculum</Link></li>
              <li><Link to="/placements" className="hover:text-white">Placements</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-amber-400">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-amber-400" />
                <span>Deshmukhi(V), Yadadri Bhuvanagiri(Dist), Telangana - 508284</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-amber-400" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-amber-400" />
                <span>hod.cseds@vignanits.ac.in</span>
              </li>
            </ul>
          </div>

          {/* Map Preview */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-amber-400">Location</h3>
            <div className="h-32 w-full overflow-hidden rounded-lg bg-gray-700">
              <img 
                src="https://picsum.photos/seed/vitsmap/400/200" 
                alt="Map Placeholder" 
                className="h-full w-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Vignan Institute of Technology and Science. All rights reserved.</p>
          <p className="mt-1">Designed for CSE (Data Science) Department</p>
        </div>
      </div>
    </footer>
  );
}
