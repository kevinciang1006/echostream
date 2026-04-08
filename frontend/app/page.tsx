import { getEpisodes } from '@/lib/api';
import type { Episode } from '@/lib/types';
import EpisodeFilter from '@/components/episodes/EpisodeFilter';

export const revalidate = 60;

export default async function HomePage() {
  let episodes: Episode[] = [];
  try {
    const data = await getEpisodes(1, 12);
    episodes = data.episodes;
  } catch {
    // API unavailable — render with empty list; error shown in UI
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="mb-16 max-w-3xl">
        <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          Stories Worth{' '}
          <span
            className="relative inline-block"
            style={{ color: 'var(--accent)' }}
          >
            Streaming
            <span
              className="absolute -bottom-1 left-0 right-0 h-0.5"
              style={{ background: 'var(--accent)' }}
            />
          </span>
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          In-depth audio and video journalism on the forces shaping our world. From central banking to semiconductor geopolitics — premium content, adaptive streaming.
        </p>
      </section>

      {/* Episodes */}
      <section>
        <EpisodeFilter episodes={episodes} />
      </section>
    </div>
  );
}
