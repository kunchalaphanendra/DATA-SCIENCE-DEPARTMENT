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
    if (!idOrName) return;
    const deleted = getDeletedPlacementIds();
    const cleanStr = String(idOrName).trim();
    if (cleanStr && !deleted.includes(cleanStr)) {
      deleted.push(cleanStr);
      localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
    }
  } catch (e) {
    console.error('Error saving placement deletion', e);
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
    if (!idOrName) return;
    const targetStr = String(idOrName).toLowerCase().trim();
    const custom = getCustomPlacements().filter(p => 
      String(p.id).toLowerCase().trim() !== targetStr && 
      String(p.studentName).toLowerCase().trim() !== targetStr
    );
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error removing custom placement', e);
  }
}

export function resetPlacementStorage() {
  try {
    localStorage.removeItem(DELETED_KEY);
    localStorage.removeItem(CUSTOM_KEY);
  } catch (e) {
    console.error('Error resetting placement storage', e);
  }
}

export function loadMergedPlacements(supabaseRows: any[] = []): Placement[] {
  const map = new Map<string, Placement>();

  // 1. Load default data
  defaultPlacementsData.forEach(p => map.set(p.studentName, p));

  // 2. Merge custom localStorage edits/additions
  getCustomPlacements().forEach(p => {
    if (p.studentName) {
      map.set(p.studentName, p);
    }
  });

  // 3. Merge Supabase rows
  if (supabaseRows && supabaseRows.length > 0) {
    supabaseRows.forEach(r => {
      const studentName = r.student_name || r.studentName || '';
      if (!studentName) return;
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
      } else {
        map.set(studentName, {
          id: r.id || `p-${studentName}`,
          studentName: studentName,
          company: r.company || 'Unknown',
          package: r.package || 'N/A',
          batchYear: r.batch_year || r.batchYear || '2024',
          photoUrl: r.photo_url || r.photoUrl || '',
        });
      }
    });
  }

  // 4. Filter out deleted items cleanly with case-insensitive checking
  const deletedArray = getDeletedPlacementIds();
  const deletedSet = new Set(deletedArray.map(d => String(d).toLowerCase().trim()));

  const result: Placement[] = [];
  
  for (const [key, p] of map.entries()) {
    const keyLower = String(key).toLowerCase().trim();
    const idLower = String(p.id).toLowerCase().trim();
    const nameLower = String(p.studentName).toLowerCase().trim();

    if (!deletedSet.has(keyLower) && !deletedSet.has(idLower) && !deletedSet.has(nameLower)) {
      result.push(p);
    }
  }

  return result;
}
