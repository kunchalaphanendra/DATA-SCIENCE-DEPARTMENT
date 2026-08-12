import { GalleryImage } from '@/src/types';
import { defaultGalleryData } from '@/src/data/galleryData';

const GALLERY_CACHE_KEY = 'vits_gallery_cache_v1';

export function saveGalleryCache(images: GalleryImage[]) {
  try {
    if (images && Array.isArray(images) && images.length > 0) {
      localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(images));
    }
  } catch {}
}

export function loadMergedGallery(remoteImages?: GalleryImage[]): GalleryImage[] {
  if (remoteImages && Array.isArray(remoteImages) && remoteImages.length > 0) {
    saveGalleryCache(remoteImages);
    return remoteImages;
  }

  try {
    const cached = localStorage.getItem(GALLERY_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return defaultGalleryData;
}
