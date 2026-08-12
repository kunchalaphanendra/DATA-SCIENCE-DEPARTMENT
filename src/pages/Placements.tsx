import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Placement, PlacementStats, CompanyLogo } from '@/src/types';
import { TrendingUp, Award, Building2, Briefcase, Search } from 'lucide-react';
import { loadMergedPlacements } from '@/src/lib/placementsStorage';

export default function Placements() {
  const [placements, setPlacements] = useState<Placement[]>(() => loadMergedPlacements([]));
  const [stats, setStats] = useState<PlacementStats[]>([]);
  const [logos, setLogos] = useState<CompanyLogo[]>([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(100);

  useEffect(() => {
    // Placements
    supabase.from('placements').select('*').order('created_at', { ascending: false })
      .then(
        ({ data }) => {
          setPlacements(loadMergedPlacements(data || []));
        },
        () => setPlacements(loadMergedPlacements([]))
      );

    // Stats (optional table - won't break if missing)
    supabase.from('placement_stats').select('*').order('year', { ascending: false })
      .then(({ data }) => {
        if (data) setStats(data.map(r => ({
          id: r.id, year: r.year, placed: r.placed,
          highest: r.highest, average: r.average, companies: r.companies,
        })));
      });

    // Company logos (optional table - won't break if missing)
    supabase.from('company_logos').select('*')
      .then(({ data }) => {
        if (data) setLogos(data.map(r => ({
          id: r.id, name: r.name, logoUrl: r.logo_url,
        })));
      });
  }, []);

  const years = ['All', ...Array.from(new Set(placements.map(p => p.batchYear)))].sort((a, b) => (b as string).localeCompare(a as string));
  
  // Sort by highest package parsing "X LPA"
  const sortedPlacements = [...placements].sort((a, b) => {
    const pkgA = parseFloat(a.package.toString().replace(/[^0-9.]/g, '')) || 0;
    const pkgB = parseFloat(b.package.toString().replace(/[^0-9.]/g, '')) || 0;
    return pkgB - pkgA;
  });

  const searchLower = searchTerm.trim().toLowerCase();
  const filteredPlacements = sortedPlacements.filter(p => {
    const matchesYear = selectedYear === 'All' || p.batchYear === selectedYear;
    const matchesSearch = !searchLower || 
      p.studentName.toLowerCase().includes(searchLower) || 
      p.company.toLowerCase().includes(searchLower) ||
      p.package.toLowerCase().includes(searchLower);
    return matchesYear && matchesSearch;
  });
  const displayedPlacements = filteredPlacements.slice(0, visibleCount);
  
  const latestStats = stats[0] || { year: '2024', placed: 85, highest: '12 LPA', average: '4.5 LPA', companies: 45 };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Placements ({filteredPlacements.length} Students)</h1>
          <p className="mt-4 text-gray-600">Connecting our talent with global opportunities.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Stats Grid */}
        <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Placement Percentage', value: `${latestStats.placed}%`, icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
            { label: 'Highest Package', value: latestStats.highest, icon: Award, color: 'bg-amber-50 text-amber-600' },
            { label: 'Average Package', value: latestStats.average, icon: Briefcase, color: 'bg-green-50 text-green-600' },
            { label: 'Recruiting Companies', value: latestStats.companies, icon: Building2, color: 'bg-purple-50 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-50">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="text-2xl font-bold text-violet-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-violet-900">Our Top Recruiters</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all hover:grayscale-0">
            {logos.length > 0 ? logos.map((logo) => (
              <img key={logo.id} src={logo.logoUrl} alt={logo.name} className="h-12 object-contain" />
            )) : (
              ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture'].map(name => (
                <div key={name} className="text-xl font-bold text-gray-400">{name}</div>
              ))
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-violet-900">Placed Students</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Roll No / Company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-gray-200 pl-9 pr-4 py-2 text-sm focus:border-violet-900 focus:outline-none"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setVisibleCount(100);
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-900"
            >
              {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Batches' : `Batch ${y}`}</option>)}
            </select>
          </div>
        </div>

        {/* Placed Students Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayedPlacements.map((p) => (
            <a 
              key={p.id} 
              href="https://vignanits.ac.in/placements/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-xl hover:border-amber-500 hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                <img
                  src={p.photoUrl || `https://picsum.photos/seed/${p.id}/400/400`}
                  alt={p.studentName}
                  className="h-full w-full object-cover object-[center_15%] transition-transform duration-500 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-violet-900 group-hover:text-amber-600 transition-colors">{p.studentName}</h3>
                <p className="text-sm font-bold text-amber-600">{p.company}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Package: <span className="font-bold text-gray-700">{p.package}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {visibleCount < filteredPlacements.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="rounded-full border-2 border-violet-900 px-8 py-3 text-sm font-bold text-violet-900 transition-all hover:bg-violet-900 hover:text-white"
            >
              View More
            </button>
          )}
          {visibleCount > 12 && (
            <button
              onClick={() => setVisibleCount(12)}
              className="rounded-full border-2 border-gray-300 px-8 py-3 text-sm font-bold text-gray-600 transition-all hover:border-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              View Less
            </button>
          )}
        </div>

        {filteredPlacements.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No placement data found for the selected batch.
          </div>
        )}
      </div>
    </div>
  );
}
