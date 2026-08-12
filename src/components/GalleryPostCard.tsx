import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { GalleryImage } from '@/src/types';

interface GalleryPostCardProps {
  key?: string;
  album: string;
  images: GalleryImage[];
  onOpenLightbox: (imageIndex: number) => void;
}

export default function GalleryPostCard({ album, images, onOpenLightbox }: GalleryPostCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = images.length;
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group relative mb-6 flex flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-amber-300">
      {/* Main Image Container */}
      <div 
        className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => onOpenLightbox(currentIndex)}
      >
        <img
          key={currentImage.id || currentIndex}
          src={currentImage.imageUrl}
          alt={currentImage.caption || album}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="rounded-full bg-violet-900/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md border border-white/10">
            {album}
          </span>
        </div>

        {/* Multi-Photo Counter Pill (Instagram Style) */}
        {total > 1 && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md border border-white/10">
            <Images size={13} className="text-amber-400" />
            <span>{currentIndex + 1} / {total}</span>
          </div>
        )}

        {/* Carousel Navigation Overlay (Prev/Next Arrows) */}
        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/60 p-2 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-amber-500 hover:text-slate-950 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/60 p-2 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-amber-500 hover:text-slate-950 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Bottom Slide Indicators (Dots) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-6 bg-amber-400 shadow-md' 
                    : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-4 bg-white flex flex-col justify-between flex-grow">
        <h3 className="font-bold text-violet-950 text-base line-clamp-1 mb-1">
          {album}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {currentImage.caption || `${album} photo set (${currentIndex + 1} of ${total})`}
        </p>
      </div>
    </div>
  );
}
