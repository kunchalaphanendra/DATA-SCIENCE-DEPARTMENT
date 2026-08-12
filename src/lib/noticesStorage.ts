import { Notice, Priority } from '@/src/types';
import { defaultNoticesData } from '@/src/data/noticesData';

const NOTICES_CACHE_KEY = 'vits_notices_cache_v1';

export function saveNoticesCache(notices: Notice[]) {
  try {
    if (notices && Array.isArray(notices) && notices.length > 0) {
      localStorage.setItem(NOTICES_CACHE_KEY, JSON.stringify(notices));
    }
  } catch {}
}

export function loadMergedNotices(remoteNotices?: Notice[]): Notice[] {
  if (remoteNotices && Array.isArray(remoteNotices) && remoteNotices.length > 0) {
    saveNoticesCache(remoteNotices);
    return remoteNotices;
  }

  try {
    const cached = localStorage.getItem(NOTICES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  return defaultNoticesData;
}
