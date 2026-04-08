'use client';

import Hls from 'hls.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Episode } from '@/lib/types';
import PlayerControls from './PlayerControls';
import ErrorState from '@/components/ui/ErrorState';

interface HLSPlayerProps {
  episode: Episode;
}

interface QualityLevel {
  height: number;
  bitrate: number;
}

export default function HLSPlayer({ episode }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const rafRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [levels, setLevels] = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);

    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  }, []);

  const startRAF = useCallback(() => {
    rafRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  const stopRAF = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setupHLS = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(episode.streamUrl);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          setLevels(
            data.levels.map((l) => ({
              height: l.height,
              bitrate: l.bitrate,
            }))
          );
          setIsLoading(false);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error. Check your connection and try again.');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error. The stream could not be decoded.');
                break;
              default:
                setError('An unknown error occurred.');
                break;
            }
          }
        });

        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari)
        video.src = episode.streamUrl;
        setIsLoading(false);
      } else {
        setError('HLS streaming is not supported in this browser.');
      }
    };

    setupHLS();

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      startRAF();
    };

    const handlePause = () => {
      setIsPlaying(false);
      stopRAF();
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      stopRAF();
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [episode.streamUrl, startRAF, stopRAF]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setError('Failed to play the stream.'));
    } else {
      video.pause();
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    video.muted = vol === 0;
    setVolume(vol);
    setIsMuted(vol === 0);
  }, []);

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const handleLevelChange = useCallback((level: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      setCurrentLevel(level);
    }
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    if (hlsRef.current) {
      hlsRef.current.startLoad();
    } else if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, video.currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, video.currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, video.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, video.volume - 0.1));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'f':
        case 'F':
          if (episode.type === 'video') {
            e.preventDefault();
            handleFullscreenToggle();
          }
          break;
      }
    },
    [handlePlayPause, handleSeek, handleVolumeChange, handleMuteToggle, handleFullscreenToggle, duration, episode.type]
  );

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden outline-none"
      style={{ background: '#000', border: '1px solid var(--border)' }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${episode.type === 'video' ? 'Video' : 'Audio'} player: ${episode.title}`}
    >
      {/* Video/Audio element */}
      {episode.type === 'video' ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            playsInline
            preload="metadata"
            aria-label={episode.title}
          />
          {/* Loading Overlay */}
          {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div
                className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                aria-label="Loading"
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex items-center justify-center py-8 px-6"
          style={{ background: 'var(--bg-secondary)', minHeight: '120px' }}
        >
          <video
            ref={videoRef}
            className="sr-only"
            playsInline
            preload="metadata"
            aria-label={episode.title}
          />
          {/* Podcast visual */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-end gap-0.5 h-8" aria-hidden="true">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-150"
                  style={{
                    height: `${20 + Math.sin(i * 0.8) * 12 + (isPlaying ? Math.sin(Date.now() / 100 + i) * 8 : 0)}%`,
                    background: i % 3 === 0 ? 'var(--accent)' : 'var(--border-light)',
                    minHeight: '20%',
                  }}
                />
              ))}
            </div>
            {isLoading && !error && (
              <div
                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                aria-label="Loading"
              />
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={handleRetry} />}

      {/* Controls */}
      {!error && (
        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          levels={levels}
          currentLevel={currentLevel}
          mediaType={episode.type}
          isFullscreen={isFullscreen}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
          onPlaybackRateChange={handlePlaybackRateChange}
          onLevelChange={handleLevelChange}
          onFullscreenToggle={handleFullscreenToggle}
        />
      )}
    </div>
  );
}
