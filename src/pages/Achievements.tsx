import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Achievement } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';
import { Trophy, Calendar, Search } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(9); // Initial load count

  useEffect(() => {
    supabase.from('achievements').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAchievements(data.map(r => ({
            id: r.id,
            studentName: r.student_name,
            title: r.title,
            category: r.category,
            year: r.year,
            description: r.description,
            photoUrl: r.photo_url || '',
          })));
        } else {
          setAchievements(defaultAchievementsData);
        }
      });
  }, []);

  const categories = ['All', 'Academic', 'Sports', 'Technical', 'Cultural'];

  const filteredAchievements = achievements.filter(a => {
    const matchesFilter = filter === 'All' || a.category === filter;
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const displayedAchievements = filteredAchievements.slice(0, visibleCount);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Student Achievements</h1>
          <p className="mt-4 text-gray-600">Celebrating the milestones and successes of our students.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setFilter(c);
                  setVisibleCount(9); // Reset count when filter changes
                }}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  filter === c
                    ? 'bg-violet-900 text-white shadow-md'
                    : 'bg-white text-violet-900 border border-gray-200 hover:border-violet-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(9); // Reset count on search
              }}
              className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4 focus:border-violet-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedAchievements.map((a) => (
            <div key={a.id} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl border border-gray-50">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-50 opacity-50 transition-transform group-hover:scale-150" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500 shadow-sm">
                    <img
                      src={a.photoUrl || `https://picsum.photos/seed/${a.id}/200/200`}
                      alt={a.studentName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-violet-900">{a.studentName}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Batch: {a.year}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                  <Trophy size={12} />
                  <span>{a.category}</span>
                </div>

                <h4 className="mb-3 text-lg font-bold text-violet-900">{a.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{a.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {visibleCount < filteredAchievements.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="rounded-full border-2 border-violet-900 px-8 py-3 text-sm font-bold text-violet-900 transition-all hover:bg-violet-900 hover:text-white"
            >
              View More
            </button>
          )}
          {visibleCount > 9 && (
            <button
              onClick={() => setVisibleCount(9)}
              className="rounded-full border-2 border-gray-300 px-8 py-3 text-sm font-bold text-gray-600 transition-all hover:border-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              View Less
            </button>
          )}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No achievements found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
