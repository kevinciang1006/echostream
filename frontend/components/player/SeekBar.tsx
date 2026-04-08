'use client';

import { useRef, useState, useCallback } from 'react';
import { formatDuration } from '@/lib/api';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
}

export default function SeekBar({ currentTime, duration, buffered, onSeek }: SeekBarProps) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  const played = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  const getTimeFromEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect || duration === 0) return 0;
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = barRef.current?.getBoundingClientRect();
      if (!rect) return;
      setHoverTime(getTimeFromEvent(e));
      setHoverX(e.clientX - rect.left);
    },
    [getTimeFromEvent]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onSeek(getTimeFromEvent(e));
    },
    [getTimeFromEvent, onSeek]
  );

  return (
    <div className="relative w-full group">
      {/* Tooltip */}
      {hoverTime !== null && (
        <div
          className="absolute -top-8 text-xs px-1.5 py-0.5 rounded pointer-events-none transform -translate-x-1/2 z-10"
          style={{
            left: hoverX,
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
          }}
        >
          {formatDuration(Math.round(hoverTime))}
        </div>
      )}

      {/* Track */}
      <div
        ref={barRef}
        className="relative w-full h-1 rounded cursor-pointer group-hover:h-1.5 transition-all duration-150"
        style={{ background: 'var(--border-light)' }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={formatDuration(Math.round(currentTime))}
      >
        {/* Buffered */}
        <div
          className="absolute top-0 left-0 h-full rounded"
          style={{ width: `${bufferedPct}%`, background: 'var(--border-light)', opacity: 0.6 }}
        />
        {/* Played */}
        <div
          className="absolute top-0 left-0 h-full rounded"
          style={{ width: `${played}%`, background: 'var(--accent)' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            left: `calc(${played}% - 6px)`,
            background: 'var(--accent)',
          }}
        />
      </div>
    </div>
  );
}
