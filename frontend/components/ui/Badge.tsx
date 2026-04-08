import type { MediaType } from '@/lib/types';

interface BadgeProps {
  variant: MediaType;
}

const styles: Record<MediaType, { background: string; color: string }> = {
  podcast: { background: '#2A3A4A', color: '#8BB8D4' },
  video: { background: '#3A1A1A', color: 'var(--accent)' },
};

export default function Badge({ variant }: BadgeProps) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-medium uppercase tracking-widest rounded"
      style={styles[variant]}
    >
      {variant}
    </span>
  );
}
