import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/src/lib/supabase';
import { GalleryImage } from '@/src/types';
import { loadMergedGallery } from '@/src/lib/galleryStorage';
import GalleryPostCard from '@/src/components/GalleryPostCard';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface AlbumGroup {
  album: string;
  images: GalleryImage[];
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>(() => loadMergedGallery([]));
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    supabase.from('gallery').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const remote: GalleryImage[] = data.map(r => ({
            id: r.id,
            imageUrl: r.image_url,
            album: r.album,
            caption: r.caption || '',
          }));
          setImages(loadMergedGallery(remote));
        }
      });
  }, []);

  // Group images by Album/Event Post
  const groupedAlbums: AlbumGroup[] = useMemo(() => {
    const map = new Map<string, GalleryImage[]>();
    images.forEach(img => {
      const albumKey = (img.album || 'General').trim();
      if (!map.has(albumKey)) {
        map.set(albumKey, []);
      }
      map.get(albumKey)!.push(img);
    });
    return Array.from(map.entries()).map(([album, imgs]) => ({
      album,
      images: imgs,
    }));
  }, [images]);

  const albumNames = ['All', ...groupedAlbums.map(g => g.album)];

  const filteredAlbums = useMemo(() => {
    return groupedAlbums.filter(g => filter === 'All' || g.album === filter);
  }, [groupedAlbums, filter]);

  const displayedAlbums = filteredAlbums.slice(0, visibleCount);

  // Flattened list of images for Lightbox navigation
  const allFilteredImages = useMemo(() => {
    return filteredAlbums.flatMap(g => g.images);
  }, [filteredAlbums]);

  const handleOpenLightbox = (targetImgId: string) => {
    const globalIdx = allFilteredImages.findIndex(img => img.id === targetImgId);
    if (globalIdx !== -1) {
      setLightboxIndex(globalIdx);
    } else {
      setLightboxIndex(0);
    }
  };

  return (
    <div className="py-16 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-violet-950 tracking-tight">Department Gallery</h1>
          <p className="mt-3 text-base text-gray-600 font-medium">
            Capturing moments of learning, innovation, and joy in grouped album posts.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-amber-500" />
        </div>

        {/* Filter Pills */}
        <div className="mb-12 flex flex-wrap justify-center gap-2.5">
          {albumNames.map((album) => (
            <button
              key={album}
              onClick={() => {
                setFilter(album);
                setVisibleCount(12);
              }}
              className={`rounded-full px-6 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                filter === album
                  ? 'bg-violet-900 text-white shadow-lg shadow-violet-900/20 scale-105'
                  : 'bg-white text-violet-950 border border-slate-200 hover:border-violet-900 hover:bg-slate-50'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* Instagram-Style Album Posts Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayedAlbums.map((group) => (
            <GalleryPostCard
              key={group.album}
              album={group.album}
              images={group.images}
              onOpenLightbox={(slideIndex) => {
                const targetImg = group.images[slideIndex] || group.images[0];
                if (targetImg) {
                  handleOpenLightbox(targetImg.id);
                }
              }}
            />
          ))}
        </div>

        {/* View More / View Less */}
        <div className="mt-12 flex justify-center gap-4">
          {visibleCount < filteredAlbums.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="rounded-full border-2 border-violet-900 px-8 py-3 text-sm font-bold text-violet-900 transition-all hover:bg-violet-900 hover:text-white shadow-md"
            >
              View More Albums
            </button>
          )}
          {visibleCount > 12 && (
            <button
              onClick={() => setVisibleCount(12)}
              className="rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              View Less
            </button>
          )}
        </div>

        {filteredAlbums.length === 0 && (
          <div className="py-20 text-center text-gray-500 italic text-base">
            No albums found in this category.
          </div>
        )}

        {/* Fullscreen Lightbox */}
        <Lightbox
          index={lightboxIndex}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={allFilteredImages.map(img => ({ src: img.imageUrl, title: `${img.album} - ${img.caption}` }))}
        />
      </div>
    </div>
  );
}
