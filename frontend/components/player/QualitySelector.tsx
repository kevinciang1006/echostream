'use client';

interface QualityLevel {
  height: number;
  bitrate: number;
}

interface QualitySelectorProps {
  levels: QualityLevel[];
  currentLevel: number;
  onLevelChange: (level: number) => void;
}

export default function QualitySelector({ levels, currentLevel, onLevelChange }: QualitySelectorProps) {
  if (levels.length === 0) return null;

  const getLabel = (level: QualityLevel): string => {
    if (level.height >= 1080) return '1080p';
    if (level.height >= 720) return '720p';
    if (level.height >= 480) return '480p';
    if (level.height >= 360) return '360p';
    return `${level.height}p`;
  };

  return (
    <div className="relative">
      <select
        value={currentLevel}
        onChange={(e) => onLevelChange(Number(e.target.value))}
        className="text-xs px-2 py-1 rounded cursor-pointer outline-none appearance-none pr-6"
        style={{
          background: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-light)',
        }}
        aria-label="Select video quality"
      >
        <option value={-1}>Auto</option>
        {levels.map((level, index) => (
          <option key={index} value={index}>
            {getLabel(level)}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ color: 'var(--text-muted)' }}
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
