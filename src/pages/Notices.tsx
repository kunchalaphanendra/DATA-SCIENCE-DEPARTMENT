import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Notice, Priority } from '@/src/types';
import { loadMergedNotices } from '@/src/lib/noticesStorage';
import { Megaphone, Search, Calendar, AlertCircle, Bell, X, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>(() => loadMergedNotices([]));
  const [filter, setFilter] = useState<'All' | 'High' | 'Normal'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const remote: Notice[] = data.map(r => ({
          id: r.id,
          title: r.title,
          content: r.content,
          date: r.date,
          priority: (r.priority as Priority) || 'Normal',
        }));
        setNotices(loadMergedNotices(remote));
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotices();

    const channel = supabase
      .channel('notices-public-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, fetchNotices)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesFilter = filter === 'All' || n.priority === filter;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleShare = (notice: Notice) => {
    if (navigator.share) {
      navigator.share({
        title: notice.title,
        text: notice.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${notice.title}\n\n${notice.content}`);
      toast.success('Notice copied to clipboard!');
    }
  };

  return (
    <div className="py-16 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 border border-amber-500/20">
            <Megaphone size={14} /> Official Department Circulars
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Notices & Announcements
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Stay updated with examination timetables, academic notices, event registrations, and urgent campus alerts.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
        </div>

        {/* Search & Filter Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by title or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Priority Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Notices', value: 'All' },
              { label: 'Urgent / High', value: 'High' },
              { label: 'Normal', value: 'Normal' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>

        {/* Notices Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 cursor-pointer"
            >
              <div>
                {/* Top Meta Bar */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <Calendar size={14} className="text-amber-500" />
                    <span>{notice.date}</span>
                  </div>

                  {notice.priority === 'High' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-0.5 text-xs font-black text-red-700 uppercase tracking-wider animate-pulse">
                      <AlertCircle size={12} /> Urgent
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Normal
                    </span>
                  )}
                </div>

                {/* Notice Title */}
                <h3 className="mb-3 text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
                  {notice.title}
                </h3>

                {/* Content Snippet */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {notice.content}
                </p>
              </div>

              {/* Card Footer Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Full Notice <ArrowRight size={14} />
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(notice);
                  }}
                  title="Share Notice"
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No notices found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search keywords or filter settings.</p>
          </div>
        )}

        {/* Detailed Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
              className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Top Metadata */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700">
                  <Calendar size={14} className="text-amber-500" />
                  {selectedNotice.date}
                </span>

                {selectedNotice.priority === 'High' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3.5 py-1 text-xs font-black text-red-700 uppercase tracking-wider">
                    <AlertCircle size={13} /> URGENT ANNOUNCEMENT
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    GENERAL NOTICE
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug mb-6 border-b border-slate-100 pb-4">
                {selectedNotice.title}
              </h2>

              {/* Full Content */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8 font-medium">
                {selectedNotice.content}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleShare(selectedNotice)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Share2 size={16} /> Share Circular
                </button>

                <button
                  onClick={() => setSelectedNotice(null)}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
