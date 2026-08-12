import { Event } from '@/src/types';
import { defaultEventsData } from '@/src/data/eventsData';

const CUSTOM_EVENTS_KEY = 'vits_custom_events_v1';
const DELETED_EVENTS_KEY = 'vits_deleted_events_v1';

export function getDeletedEventIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getCustomEvents(): Event[] {
  try {
    const raw = localStorage.getItem(CUSTOM_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEventsCache(remoteEvents: Event[]) {
  try {
    if (remoteEvents && Array.isArray(remoteEvents) && remoteEvents.length > 0) {
      localStorage.setItem('vits_events_cache_v1', JSON.stringify(remoteEvents));
    }
  } catch {}
}

export function loadMergedEvents(remoteEvents?: Event[]): Event[] {
  const deleted = getDeletedEventIds();

  // If remote data provided and valid
  if (remoteEvents && Array.isArray(remoteEvents) && remoteEvents.length > 0) {
    saveEventsCache(remoteEvents);
    const custom = getCustomEvents();
    const map = new Map<string, Event>();
    remoteEvents.forEach(e => map.set(e.id, e));
    custom.forEach(e => map.set(e.id, e));
    return Array.from(map.values()).filter(e => !deleted.includes(e.id));
  }

  // Fallback to cache or default data
  try {
    const cached = localStorage.getItem('vits_events_cache_v1');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(e => !deleted.includes(e.id));
      }
    }
  } catch {}

  const custom = getCustomEvents();
  const map = new Map<string, Event>();
  defaultEventsData.forEach(e => map.set(e.id, e));
  custom.forEach(e => map.set(e.id, e));
  return Array.from(map.values()).filter(e => !deleted.includes(e.id));
}
