export type MediaType = 'podcast' | 'video';

export interface Episode {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: MediaType;
  duration: number; // seconds
  publishedAt: string; // ISO date string
  thumbnailUrl: string;
  streamUrl: string; // HLS .m3u8 manifest URL
  relatedSlugs: string[];
}

export interface EpisodesResponse {
  episodes: Episode[];
  total: number;
  page: number;
  limit: number;
}
