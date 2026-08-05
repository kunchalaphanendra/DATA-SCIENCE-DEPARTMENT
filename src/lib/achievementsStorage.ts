import { Achievement } from '@/src/types';
import { defaultAchievementsData } from '@/src/data/achievementsData';

const DELETED_KEY = 'vits_deleted_achievement_ids';
const CUSTOM_KEY = 'vits_custom_achievements';

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
    if (!deleted.includes(idOrTitle)) {
      deleted.push(idOrTitle);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error saving deletion', e);
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
    const custom = getCustomAchievements().filter(a => a.id !== idOrTitle && a.title !== idOrTitle);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error removing custom achievement', e);
  }
}

export function resetAchievementStorage() {
  try {
    localStorage.removeItem(DELETED_KEY);
    localStorage.removeItem(CUSTOM_KEY);
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

  // 4. Filter out deleted items
  const deletedSet = new Set(getDeletedAchievementIds());
  const result: Achievement[] = [];
  
  for (const [key, a] of map.entries()) {
    if (!deletedSet.has(key) && !deletedSet.has(a.id) && !deletedSet.has(a.title)) {
      result.push(a);
    }
  }

  // Self-healing fallback: if deletedSet wiped out ALL records, reset storage to restore default records
  if (result.length === 0 && defaultAchievementsData.length > 0) {
    resetAchievementStorage();
    return defaultAchievementsData;
  }

  return result;
}
