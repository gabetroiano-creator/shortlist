import { catalog } from "@/lib/catalog";
import { buildSchool, type ScoredSchool } from "@/lib/data";

// Encode a list into a compact, backend-free share token (base64 of {sat, [[id,importance]]}).
export function encodeList(sat: number, schools: { id: string; importance: number }[]): string {
  const payload = { s: sat, l: schools.map((x) => [x.id, x.importance]) };
  return encodeURIComponent(btoa(JSON.stringify(payload)));
}

// Decode a share token back into scored schools (rebuilt from the catalog at the
// shared SAT). Returns null if the token is missing or malformed.
export function decodeList(d: string): { sat: number; schools: ScoredSchool[] } | null {
  if (!d) return null;
  try {
    const payload = JSON.parse(atob(decodeURIComponent(d)));
    const sat = Number(payload.s) || 1450;
    const schools = (payload.l as [string, number][])
      .map(([id, imp]) => {
        const cat = catalog.find((c) => c.id === id);
        return cat ? buildSchool(cat, Number(imp) || 3, sat) : null;
      })
      .filter((s): s is ScoredSchool => s !== null);
    return { sat, schools };
  } catch {
    return null;
  }
}
