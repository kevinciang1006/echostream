import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEpisode, getEpisodes, formatDuration, formatDate } from '@/lib/api';
import HLSPlayer from '@/components/player/HLSPlayer';
import EpisodeCard from '@/components/episodes/EpisodeCard';
import type { Episode } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const episode = await getEpisode(slug);
    return {
      title: `${episode.title} | EchoStream`,
      description: episode.description,
    };
  } catch {
    return { title: 'Episode | EchoStream' };
  }
}

function buildJsonLd(episode: Episode): string {
  // JSON.stringify produces safe, serialized output — no user-controlled HTML
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': episode.type === 'video' ? 'VideoObject' : 'PodcastEpisode',
    name: episode.title,
    description: episode.description,
    uploadDate: episode.publishedAt,
    thumbnailUrl: episode.thumbnailUrl,
    contentUrl: episode.streamUrl,
    duration: `PT${Math.floor(episode.duration / 60)}M${episode.duration % 60}S`,
  });
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug } = await params;

  let episode: Episode;
  try {
    episode = await getEpisode(slug);
  } catch {
    notFound();
  }

  // Fetch related episodes
  let relatedEpisodes: Episode[] = [];
  if (episode.relatedSlugs.length > 0) {
    try {
      const allData = await getEpisodes(1, 12);
      relatedEpisodes = allData.episodes.filter(
        (ep) => episode.relatedSlugs.includes(ep.slug) && ep.slug !== slug
      );
    } catch {
      // Skip related if API fails
    }
  }

  return (
    <>
      {/* JSON-LD structured data — content is JSON.stringify output, not user HTML */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(episode) }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Player — 60% */}
          <div className="w-full lg:w-[60%] space-y-6">
            <HLSPlayer episode={episode} />
          </div>

          {/* Metadata — 40% */}
          <div className="w-full lg:w-[40%] space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs uppercase tracking-widest font-medium px-2 py-0.5 rounded"
                  style={{
                    background: episode.type === 'video' ? '#3A1A1A' : '#2A3A4A',
                    color: episode.type === 'video' ? 'var(--accent)' : '#8BB8D4',
                  }}
                >
                  {episode.type}
                </span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl font-bold leading-snug mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {episode.title}
              </h1>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {episode.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span>{formatDuration(episode.duration)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(episode.publishedAt)}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* Keyboard Shortcuts hint */}
            <div
              className="rounded-lg p-4 text-xs space-y-1"
              style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}
            >
              <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Keyboard shortcuts
              </p>
              <p>Space / K &mdash; Play / Pause</p>
              <p>&larr; / &rarr; &mdash; Seek 10s</p>
              <p>&uarr; / &darr; &mdash; Volume</p>
              <p>M &mdash; Mute toggle</p>
              {episode.type === 'video' && <p>F &mdash; Fullscreen</p>}
            </div>
          </div>
        </div>

        {/* Related Episodes */}
        {relatedEpisodes.length > 0 && (
          <section className="mt-14">
            <h2
              className="font-display text-2xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Related Episodes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEpisodes.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
