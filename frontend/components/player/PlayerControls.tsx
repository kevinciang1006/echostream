'use client';

import SeekBar from './SeekBar';
import QualitySelector from './QualitySelector';
import { formatDuration } from '@/lib/api';
import type { MediaType } from '@/lib/types';

interface QualityLevel {
  height: number;
  bitrate: number;
}

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  levels: QualityLevel[];
  currentLevel: number;
  mediaType: MediaType;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onMuteToggle: () => void;
  onPlaybackRateChange: (rate: number) => void;
  onLevelChange: (level: number) => void;
  onFullscreenToggle: () => void;
}

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export default function PlayerControls({
  isPlaying,
  currentTime,
  duration,
  buffered,
  volume,
  isMuted,
  playbackRate,
  levels,
  currentLevel,
  mediaType,
  isFullscreen,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onLevelChange,
  onFullscreenToggle,
}: PlayerControlsProps) {
  return (
    <div
      className="px-4 py-3 space-y-2"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
    >
      {/* Seek Bar */}
      <SeekBar currentTime={currentTime} duration={duration} buffered={buffered} onSeek={onSeek} />

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          className="flex-shrink-0 transition-opacity hover:opacity-80"
          style={{ color: 'var(--text-primary)' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          )}
        </button>

        {/* Time */}
        <span className="text-xs tabular-nums flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
          {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onMuteToggle}
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : volume < 0.5 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-20 h-1 rounded"
            style={{
              accentColor: 'var(--accent)',
              background: `linear-gradient(to right, var(--accent) ${(isMuted ? 0 : volume) * 100}%, var(--border-light) ${(isMuted ? 0 : volume) * 100}%)`,
            }}
            aria-label="Volume"
          />
        </div>

        {/* Playback Rate */}
        <select
          value={playbackRate}
          onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
          className="text-xs px-2 py-1 rounded cursor-pointer outline-none"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-light)',
          }}
          aria-label="Playback speed"
        >
          {PLAYBACK_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </select>

        {/* Quality Selector */}
        <QualitySelector levels={levels} currentLevel={currentLevel} onLevelChange={onLevelChange} />

        {/* Fullscreen (video only) */}
        {mediaType === 'video' && (
          <button
            onClick={onFullscreenToggle}
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
