import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Event } from '@/src/types';
import { loadMergedEvents } from '@/src/lib/eventsStorage';
import { Calendar, MapPin, Tag, X } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState<Event[]>(() => loadMergedEvents([]));
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const remoteEvents: Event[] = data.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            date: r.date,
            venue: r.venue,
            category: r.category,
            status: r.status,
            imageUrl: r.image_url || '',
          }));
          setEvents(loadMergedEvents(remoteEvents));
        }
      });
  }, []);

  const filteredEvents = events.filter(e => filter === 'All' || e.status === filter);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Events & News</h1>
          <p className="mt-4 text-gray-600">Discover what's happening in our department.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Filters */}
        <div className="mb-12 flex justify-center">
          <div className="flex gap-2 rounded-full bg-gray-100 p-1">
            {['All', 'Upcoming', 'Past'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-8 py-2 text-sm font-bold transition-all ${
                  filter === f
                    ? 'bg-violet-900 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const imgSrc = event.imageUrl || `https://picsum.photos/seed/${event.id}/800/600`;
            return (
              <div 
                key={event.id} 
                onClick={() => setSelectedImage(imgSrc)}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 ease-out hover:shadow-2xl hover:border-amber-400 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-100">
                  <img
                    src={imgSrc}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  />
                  <div className={`absolute left-4 top-4 z-10 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg ${
                    event.status === 'Upcoming' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {event.status}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </div>
                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-amber-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-amber-500" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag size={14} className="text-amber-500" />
                      <span>{event.category}</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-violet-900 group-hover:text-amber-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No events found in this category.
          </div>
        )}

        {/* Lightbox Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-2xl">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-slate-800/80 p-2 text-white hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
              <img 
                src={selectedImage} 
                alt="Event Detail" 
                className="max-h-[85vh] w-full object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
