import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { GalleryImage } from '@/src/types';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setImages(data.map(r => ({
          id: r.id,
          imageUrl: r.image_url,
          album: r.album,
          caption: r.caption || '',
        })));
      });
  }, []);

  const albums = ['All', ...Array.from(new Set(images.map(img => img.album)))];
  const filteredImages = images.filter(img => filter === 'All' || img.album === filter);
  const displayedImages = filteredImages.slice(0, visibleCount);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-violet-900">Department Gallery</h1>
          <p className="mt-4 text-gray-600">Capturing moments of learning, innovation, and joy.</p>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => {
                setFilter(album);
                setVisibleCount(12); // Reset view count on filter
              }}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                filter === album
                  ? 'bg-violet-900 text-white shadow-md'
                  : 'bg-white text-violet-900 border border-gray-200 hover:border-violet-900'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {displayedImages.map((img, i) => (
            <div
              key={img.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
              onClick={() => setIndex(i)}
            >
              <img
                src={img.imageUrl}
                alt={img.caption || 'Gallery Image'}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{img.caption || img.album}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-4">
          {visibleCount < filteredImages.length && (
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

        {filteredImages.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic">
            No images found in this album.
          </div>
        )}

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={filteredImages.map(img => ({ src: img.imageUrl, title: img.caption }))}
        />
      </div>
    </div>
  );
}
