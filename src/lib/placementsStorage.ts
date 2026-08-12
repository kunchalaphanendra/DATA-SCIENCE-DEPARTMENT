import { Placement, PlacementStats, CompanyLogo } from '@/src/types';
import { defaultPlacementsData, defaultPlacementStats, defaultCompanyLogos } from '@/src/data/placementsData';

const DELETED_KEY = 'vits_deleted_placement_ids_v3';
const CUSTOM_KEY = 'vits_custom_placements_v3';

// One-time cleanup of stale legacy keys from earlier testing
try {
  if (typeof window !== 'undefined' && localStorage) {
    localStorage.removeItem('vits_deleted_placement_ids');
    localStorage.removeItem('vits_custom_placements');
    localStorage.removeItem('vits_deleted_placement_ids_v2');
    localStorage.removeItem('vits_custom_placements_v2');
  }
} catch {}

const cleanKey = (str: any) => String(str || '').replace(/\s+/g, '').toUpperCase();

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
    const cleanStr = cleanKey(idOrName);
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
    const cleanName = cleanKey(placement.studentName);
    const idx = custom.findIndex(p => cleanKey(p.id) === cleanKey(placement.id) || cleanKey(p.studentName) === cleanName);
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
    const targetStr = cleanKey(idOrName);
    const custom = getCustomPlacements().filter(p => 
      cleanKey(p.id) !== targetStr && 
      cleanKey(p.studentName) !== targetStr
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
    localStorage.removeItem('vits_deleted_placement_ids');
    localStorage.removeItem('vits_custom_placements');
    localStorage.removeItem('vits_deleted_placement_ids_v2');
    localStorage.removeItem('vits_custom_placements_v2');
  } catch (e) {
    console.error('Error resetting placement storage', e);
  }
}

export function loadMergedPlacements(supabaseRows: any[] = []): Placement[] {
  const map = new Map<string, Placement>();

  // 1. Load default data (Keyed by cleaned student roll number)
  defaultPlacementsData.forEach(p => {
    const normKey = cleanKey(p.studentName);
    if (normKey) {
      map.set(normKey, { ...p, studentName: normKey });
    }
  });

  // 2. Merge custom localStorage edits/additions
  getCustomPlacements().forEach(p => {
    const normKey = cleanKey(p.studentName || p.id);
    if (normKey) {
      const existing = map.get(normKey);
      map.set(normKey, {
        id: p.id || existing?.id || `p-${normKey}`,
        studentName: normKey,
        company: p.company || existing?.company || 'Unknown',
        package: p.package || existing?.package || 'N/A',
        batchYear: p.batchYear || existing?.batchYear || '2024',
        photoUrl: p.photoUrl || existing?.photoUrl || '',
      });
    }
  });

  // 3. Merge Supabase rows
  if (supabaseRows && supabaseRows.length > 0) {
    supabaseRows.forEach(r => {
      const normKey = cleanKey(r.student_name || r.studentName || r.id);
      if (!normKey) return;
      const existing = map.get(normKey);
      map.set(normKey, {
        id: r.id || existing?.id || `p-${normKey}`,
        studentName: normKey,
        company: r.company || existing?.company || 'Unknown',
        package: r.package || existing?.package || 'N/A',
        batchYear: r.batch_year || r.batchYear || existing?.batchYear || '2024',
        photoUrl: r.photo_url || r.photoUrl || existing?.photoUrl || '',
      });
    });
  }

  // 4. Filter out deleted items cleanly
  const deletedArray = getDeletedPlacementIds();
  const deletedSet = new Set(deletedArray.map(d => cleanKey(d)));

  const result: Placement[] = [];
  
  for (const [key, p] of map.entries()) {
    const keyNorm = cleanKey(key);
    const idNorm = cleanKey(p.id);
    const nameNorm = cleanKey(p.studentName);

    if (!deletedSet.has(keyNorm) && !deletedSet.has(idNorm) && !deletedSet.has(nameNorm)) {
      result.push(p);
    }
  }

  // 5. Strict deduplication pass by cleaned roll number
  const uniquePlacements: Placement[] = [];
  const seenRollNumbers = new Set<string>();

  for (const item of result) {
    const rollNo = cleanKey(item.studentName);
    if (rollNo && !seenRollNumbers.has(rollNo)) {
      seenRollNumbers.add(rollNo);
      uniquePlacements.push({ ...item, studentName: rollNo });
    }
  }

  return uniquePlacements;
}

export function loadMergedPlacementStats(remoteStats?: any[]): PlacementStats[] {
  if (remoteStats && Array.isArray(remoteStats) && remoteStats.length > 0) {
    try {
      localStorage.setItem('vits_placement_stats_cache', JSON.stringify(remoteStats));
    } catch {}
    return remoteStats.map(r => ({
      id: r.id, year: r.year, placed: r.placed,
      highest: r.highest, average: r.average, companies: r.companies,
    }));
  }

  try {
    const cached = localStorage.getItem('vits_placement_stats_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return defaultPlacementStats;
}

export function loadMergedCompanyLogos(remoteLogos?: any[]): CompanyLogo[] {
  if (remoteLogos && Array.isArray(remoteLogos) && remoteLogos.length > 0) {
    try {
      localStorage.setItem('vits_company_logos_cache', JSON.stringify(remoteLogos));
    } catch {}
    return remoteLogos.map(r => ({
      id: r.id, name: r.name, logoUrl: r.logo_url || r.logoUrl,
    }));
  }

  try {
    const cached = localStorage.getItem('vits_company_logos_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return defaultCompanyLogos;
}

