import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EpisodeCard from '../components/episodes/EpisodeCard';
import type { Episode } from '../lib/types';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockEpisode: Episode = {
  id: 'ep-001',
  slug: 'test-episode',
  title: 'The Future of Central Banking',
  description: 'A deep dive into monetary policy.',
  type: 'podcast',
  duration: 2730, // 45:30
  publishedAt: '2025-01-15T09:00:00Z',
  thumbnailUrl: 'https://picsum.photos/seed/echo-001/800/450',
  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  relatedSlugs: [],
};

describe('EpisodeCard', () => {
  it('renders the episode title', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('The Future of Central Banking')).toBeInTheDocument();
  });

  it('renders the podcast badge', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('podcast')).toBeInTheDocument();
  });

  it('renders the formatted duration', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('45:30')).toBeInTheDocument();
  });

  it('renders the formatted publish date', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument();
  });

  it('links to the episode detail page', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/episodes/test-episode');
  });

  it('renders thumbnail with correct alt text', () => {
    render(<EpisodeCard episode={mockEpisode} />);
    expect(screen.getByAltText('The Future of Central Banking')).toBeInTheDocument();
  });

  it('renders the video badge for video type', () => {
    const videoEpisode = { ...mockEpisode, type: 'video' as const };
    render(<EpisodeCard episode={videoEpisode} />);
    expect(screen.getByText('video')).toBeInTheDocument();
  });
});
