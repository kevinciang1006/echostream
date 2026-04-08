import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HLSPlayer from '../components/player/HLSPlayer';
import type { Episode } from '../lib/types';

// Mock hls.js with isSupported=true so player initializes without error state
jest.mock('hls.js', () => {
  const MockHls = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    attachMedia: jest.fn(),
    loadSource: jest.fn(),
    destroy: jest.fn(),
    startLoad: jest.fn(),
    currentLevel: -1,
  }));

  (MockHls as unknown as Record<string, unknown>).isSupported = jest.fn(() => true);
  (MockHls as unknown as Record<string, unknown>).Events = {
    MEDIA_ATTACHED: 'hlsMediaAttached',
    MANIFEST_PARSED: 'hlsManifestParsed',
    ERROR: 'hlsError',
  };
  (MockHls as unknown as Record<string, unknown>).ErrorTypes = {
    NETWORK_ERROR: 'networkError',
    MEDIA_ERROR: 'mediaError',
  };

  return { __esModule: true, default: MockHls };
});

const mockVideoEpisode: Episode = {
  id: 'ep-009',
  slug: 'semiconductor-decade',
  title: 'The Semiconductor Decade',
  description: 'The humble microchip has become the most strategically important object in the world.',
  type: 'video',
  duration: 3240,
  publishedAt: '2025-02-26T09:00:00Z',
  thumbnailUrl: 'https://picsum.photos/seed/echo-009/800/450',
  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  relatedSlugs: [],
};

const mockPodcastEpisode: Episode = {
  ...mockVideoEpisode,
  id: 'ep-001',
  slug: 'future-of-central-banking',
  title: 'The Future of Central Banking',
  type: 'podcast',
};

describe('HLSPlayer', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
      configurable: true,
      value: jest.fn(),
    });
  });

  it('renders the player container with accessible aria-label', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    const container = document.querySelector('[aria-label="Video player: The Semiconductor Decade"]');
    expect(container).toBeInTheDocument();
  });

  it('shows loading spinner while stream initializes', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    // With hls.js mocked (attachMedia does nothing), MANIFEST_PARSED never fires
    // so isLoading stays true and the spinner is visible
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders 16:9 video container for video type', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    const videoContainer = document.querySelector('[style*="padding-bottom"]');
    expect(videoContainer).toBeInTheDocument();
  });

  it('does not render 16:9 container for podcast type', () => {
    render(<HLSPlayer episode={mockPodcastEpisode} />);
    const videoContainer = document.querySelector('[style*="padding-bottom"]');
    expect(videoContainer).not.toBeInTheDocument();
  });

  it('renders play button in controls', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  it('renders mute button in controls', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    expect(screen.getByLabelText('Mute')).toBeInTheDocument();
  });

  it('renders fullscreen button for video type', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    expect(screen.getByLabelText('Enter fullscreen')).toBeInTheDocument();
  });

  it('does not render fullscreen button for podcast type', () => {
    render(<HLSPlayer episode={mockPodcastEpisode} />);
    expect(screen.queryByLabelText('Enter fullscreen')).not.toBeInTheDocument();
  });

  it('renders volume slider', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
  });

  it('renders playback speed selector', () => {
    render(<HLSPlayer episode={mockVideoEpisode} />);
    expect(screen.getByLabelText('Playback speed')).toBeInTheDocument();
  });
});
