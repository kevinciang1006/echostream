import type { Episode, EpisodesResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function getEpisodes(page = 1, limit = 12): Promise<EpisodesResponse> {
  const res = await fetch(`${API_BASE}/api/episodes?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch episodes');
  return res.json() as Promise<EpisodesResponse>;
}

export async function getEpisode(slug: string): Promise<Episode> {
  const res = await fetch(`${API_BASE}/api/episodes/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Episode not found: ${slug}`);
  return res.json() as Promise<Episode>;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
