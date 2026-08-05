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
    const cleanName = placement.studentName.trim().toUpperCase();
    const idx = custom.findIndex(p => p.id === placement.id || p.studentName.trim().toUpperCase() === cleanName);
    if (idx >= 0) {
      custom[idx] = { ...placement, studentName: cleanName };
    } else {
      custom.unshift({ ...placement, studentName: cleanName });
    }
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error saving custom placement', e);
  }
}

export function removeCustomPlacement(idOrName: string) {
  try {
    if (!idOrName) return;
    const targetStr = String(idOrName).toUpperCase().trim();
    const custom = getCustomPlacements().filter(p => 
      String(p.id).toUpperCase().trim() !== targetStr && 
      String(p.studentName).toUpperCase().trim() !== targetStr
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

  // 1. Load default data (Keyed by normalized student roll number)
  defaultPlacementsData.forEach(p => {
    const normKey = p.studentName.trim().toUpperCase();
    map.set(normKey, { ...p, studentName: normKey });
  });

  // 2. Merge custom localStorage edits/additions
  getCustomPlacements().forEach(p => {
    const normKey = (p.studentName || p.id || '').trim().toUpperCase();
    if (normKey) {
      const existing = map.get(normKey);
      map.set(normKey, {
        ...existing,
        ...p,
        studentName: (p.studentName || normKey).trim().toUpperCase(),
      });
    }
  });

  // 3. Merge Supabase rows
  if (supabaseRows && supabaseRows.length > 0) {
    supabaseRows.forEach(r => {
      const normKey = (r.student_name || r.studentName || r.id || '').toString().trim().toUpperCase();
      if (!normKey) return;
      const existing = map.get(normKey);
      if (existing) {
        map.set(normKey, {
          ...existing,
          id: r.id || existing.id,
          company: r.company || existing.company,
          package: r.package || existing.package,
          batchYear: r.batch_year || r.batchYear || existing.batchYear || '2024',
          photoUrl: r.photo_url || r.photoUrl || existing.photoUrl,
        });
      } else {
        map.set(normKey, {
          id: r.id || `p-${normKey}`,
          studentName: normKey,
          company: r.company || 'Unknown',
          package: r.package || 'N/A',
          batchYear: r.batch_year || r.batchYear || '2024',
          photoUrl: r.photo_url || r.photoUrl || '',
        });
      }
    });
  }

  // 4. Filter out deleted items cleanly
  const deletedArray = getDeletedPlacementIds();
  const deletedSet = new Set(deletedArray.map(d => String(d).toUpperCase().trim()));

  const result: Placement[] = [];
  
  for (const [key, p] of map.entries()) {
    const keyNorm = String(key).toUpperCase().trim();
    const idNorm = String(p.id).toUpperCase().trim();
    const nameNorm = String(p.studentName).toUpperCase().trim();

    if (!deletedSet.has(keyNorm) && !deletedSet.has(idNorm) && !deletedSet.has(nameNorm)) {
      result.push(p);
    }
  }

  // 5. Strict deduplication pass by student roll number
  const uniquePlacements: Placement[] = [];
  const seenRollNumbers = new Set<string>();

  for (const item of result) {
    const rollNo = item.studentName.trim().toUpperCase();
    if (!seenRollNumbers.has(rollNo)) {
      seenRollNumbers.add(rollNo);
      uniquePlacements.push(item);
    }
  }

  return uniquePlacements;
}
