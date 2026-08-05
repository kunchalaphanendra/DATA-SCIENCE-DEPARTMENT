import { Placement } from '@/src/types';
import { defaultPlacementsData } from '@/src/data/placementsData';

const DELETED_KEY = 'vits_deleted_placement_ids';
const CUSTOM_KEY = 'vits_custom_placements';

export function getDeletedPlacementIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addDeletedPlacementId(idOrName: string) {
  try {
    const deleted = getDeletedPlacementIds();
    if (!deleted.includes(idOrName)) {
      deleted.push(idOrName);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error saving deletion', e);
  }
}

export function getCustomPlacements(): Placement[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPlacement(placement: Placement) {
  try {
    const custom = getCustomPlacements();
    const idx = custom.findIndex(p => p.id === placement.id || p.studentName === placement.studentName);
    if (idx >= 0) {
      custom[idx] = placement;
    } else {
      custom.unshift(placement);
    }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error saving custom placement', e);
  }
}

export function removeCustomPlacement(idOrName: string) {
  try {
    const custom = getCustomPlacements().filter(p => p.id !== idOrName && p.studentName !== idOrName);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error removing custom placement', e);
  }
}

export function loadMergedPlacements(supabaseRows: any[] = []): Placement[] {
  const map = new Map<string, Placement>();

  // 1. Load default data
  defaultPlacementsData.forEach(p => map.set(p.studentName, p));

  // 2. Merge custom localStorage edits/additions
  getCustomPlacements().forEach(p => map.set(p.studentName, p));

  // 3. Merge Supabase rows
  if (supabaseRows && supabaseRows.length > 0) {
    supabaseRows.forEach(r => {
      const studentName = r.student_name || r.studentName || '';
      const existing = map.get(studentName);
      if (existing) {
        map.set(studentName, {
          ...existing,
          id: r.id || existing.id,
          company: r.company || existing.company,
          package: r.package || existing.package,
          batchYear: r.batch_year || r.batchYear || existing.batchYear || '2024',
          photoUrl: r.photo_url || r.photoUrl || existing.photoUrl,
        });
      } else if (studentName || r.id) {
        const key = studentName || r.id;
        map.set(key, {
          id: r.id,
          studentName: studentName || r.id,
          company: r.company || 'Unknown',
          package: r.package || 'N/A',
          batchYear: r.batch_year || r.batchYear || '2024',
          photoUrl: r.photo_url || r.photoUrl || '',
        });
      }
    });
  }

  // 4. Filter out deleted items
  const deletedSet = new Set(getDeletedPlacementIds());
  const result: Placement[] = [];
  
  for (const [key, p] of map.entries()) {
    if (!deletedSet.has(key) && !deletedSet.has(p.id) && !deletedSet.has(p.studentName)) {
      result.push(p);
    }
  }

  return result;
}
