import type { Episode } from '@/lib/types';
import EpisodeCard from './EpisodeCard';

interface EpisodeGridProps {
  episodes: Episode[];
}

export default function EpisodeGrid({ episodes }: EpisodeGridProps) {
  if (episodes.length === 0) {
    return (
      <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
        <p className="text-lg">No episodes found.</p>
        <p className="text-sm mt-2">Try adjusting your search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}
    </div>
  );
}
