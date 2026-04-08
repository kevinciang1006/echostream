import Image from 'next/image';
import Link from 'next/link';
import type { Episode } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { formatDuration, formatDate } from '@/lib/api';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link
      href={`/episodes/${episode.slug}`}
      className="group block rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={episode.thumbnailUrl}
          alt={episode.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Badge variant={episode.type} />
        <h3
          className="font-display text-base font-semibold leading-snug line-clamp-2 mt-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {episode.title}
        </h3>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{formatDuration(episode.duration)}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(episode.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
