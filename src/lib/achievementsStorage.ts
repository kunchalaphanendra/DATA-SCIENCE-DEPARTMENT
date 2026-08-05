import { Achievement } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';

const DELETED_KEY = 'vits_deleted_achievement_ids_v3';
const CUSTOM_KEY = 'vits_custom_achievements_v3';

// One-time cleanup of stale legacy keys from earlier testing
try {
  if (typeof window !== 'undefined' && localStorage) {
    localStorage.removeItem('vits_deleted_achievement_ids');
    localStorage.removeItem('vits_custom_achievements');
    localStorage.removeItem('vits_deleted_achievement_ids_v2');
    localStorage.removeItem('vits_custom_achievements_v2');
  }
} catch {}

export function getDeletedAchievementIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeletedAchievementId(idOrTitle: string) {
  try {
    if (!idOrTitle) return;
    const deleted = getDeletedAchievementIds();
    const cleanStr = String(idOrTitle).trim();
    if (cleanStr && !deleted.includes(cleanStr)) {
      deleted.push(cleanStr);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error saving achievement deletion', e);
  }
}

export function getCustomAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomAchievement(item: Achievement) {
  try {
    const custom = getCustomAchievements();
    const idx = custom.findIndex(a => a.id === item.id || a.title === item.title);
    if (idx >= 0) {
      custom[idx] = item;
    } else {
      custom.unshift(item);
    }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error saving custom achievement', e);
  }
}

export function removeCustomAchievement(idOrTitle: string) {
  try {
    if (!idOrTitle) return;
    const targetStr = String(idOrTitle).toLowerCase().trim();
    const custom = getCustomAchievements().filter(a => 
      String(a.id).toLowerCase().trim() !== targetStr && 
      String(a.title).toLowerCase().trim() !== targetStr
    );
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error removing custom achievement', e);
  }
}

export function resetAchievementStorage() {
  try {
    localStorage.removeItem(DELETED_KEY);
    localStorage.removeItem(CUSTOM_KEY);
    localStorage.removeItem('vits_deleted_achievement_ids');
    localStorage.removeItem('vits_custom_achievements');
    localStorage.removeItem('vits_deleted_achievement_ids_v2');
    localStorage.removeItem('vits_custom_achievements_v2');
  } catch (e) {
    console.error('Error resetting achievement storage', e);
  }
}

export function loadMergedAchievements(supabaseRows: any[] = []): Achievement[] {
  const map = new Map<string, Achievement>();

  // 1. Load default data
  defaultAchievementsData.forEach(a => map.set(a.id, a));

  // 2. Merge custom localStorage edits/additions
  getCustomAchievements().forEach(a => map.set(a.id, a));

  // 3. Merge Supabase rows
  if (supabaseRows && supabaseRows.length > 0) {
    supabaseRows.forEach(r => {
      const id = r.id || `a-${Date.now()}`;
      const existing = map.get(id);
      if (existing) {
        map.set(id, {
          ...existing,
          studentName: r.student_name || r.studentName || existing.studentName,
          title: r.title || existing.title,
          category: r.category || existing.category,
          year: r.year || existing.year,
          description: r.description || existing.description,
          photoUrl: r.photo_url || r.photoUrl || existing.photoUrl,
        });
      } else {
        map.set(id, {
          id: id,
          studentName: r.student_name || r.studentName || 'Student',
          title: r.title || 'Achievement',
          category: r.category || 'Academic',
          year: r.year || '2024',
          description: r.description || '',
          photoUrl: r.photo_url || r.photoUrl || '',
        });
      }
    });
  }

  // 4. Filter out deleted items with case-insensitive matching
  const deletedArray = getDeletedAchievementIds();
  const deletedSet = new Set(deletedArray.map(d => String(d).toLowerCase().trim()));

  const result: Achievement[] = [];
  
  for (const [key, a] of map.entries()) {
    const keyLower = String(key).toLowerCase().trim();
    const idLower = String(a.id).toLowerCase().trim();
    const titleLower = String(a.title).toLowerCase().trim();

    if (!deletedSet.has(keyLower) && !deletedSet.has(idLower) && !deletedSet.has(titleLower)) {
      result.push(a);
    }
  }

  // 5. Strict deduplication pass by achievement title
  const uniqueAchievements: Achievement[] = [];
  const seenTitles = new Set<string>();

  for (const item of result) {
    const normTitle = item.title.trim().toLowerCase();
    if (!seenTitles.has(normTitle)) {
      seenTitles.add(normTitle);
      uniqueAchievements.push(item);
    }
  }

  return uniqueAchievements;
}
