/**
 * Aerial Optic — Public API client
 * Fetches site content from Opsidian D1 via the public API.
 */

const API_BASE = 'https://api.opsidian.com/public/aerial-optic';

export interface SitePhoto {
  id: string;
  title: string | null;
  caption: string | null;
  category: string;
  r2_key: string;
  sort_order: number;
}

export async function fetchPhotos(category?: string): Promise<SitePhoto[]> {
  const url = category
    ? `${API_BASE}/site/photos?category=${encodeURIComponent(category)}`
    : `${API_BASE}/site/photos`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json() as { data: SitePhoto[] };
  return json.data || [];
}


/** Get all unique categories from all photos */
export async function fetchCategories(): Promise<string[]> {
  const photos = await fetchPhotos();
  const cats = new Set<string>();
  for (const p of photos) {
    if (p.category) cats.add(p.category);
  }
  return Array.from(cats).sort();
}
