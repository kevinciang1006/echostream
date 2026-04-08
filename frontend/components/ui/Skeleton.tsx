export default function Skeleton() {
  return (
    <div
      className="rounded-lg overflow-hidden animate-pulse"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Thumbnail placeholder */}
      <div className="w-full aspect-video" style={{ background: 'var(--bg-elevated)' }} />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Badge */}
        <div className="h-4 w-16 rounded" style={{ background: 'var(--bg-elevated)' }} />
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded" style={{ background: 'var(--bg-elevated)' }} />
          <div className="h-4 w-3/4 rounded" style={{ background: 'var(--bg-elevated)' }} />
        </div>
        {/* Meta */}
        <div className="flex gap-4">
          <div className="h-3 w-12 rounded" style={{ background: 'var(--bg-elevated)' }} />
          <div className="h-3 w-20 rounded" style={{ background: 'var(--bg-elevated)' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  );
}
