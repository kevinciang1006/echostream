interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
        style={{ background: '#3A1A1A' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium rounded transition-colors duration-200"
          style={{
            background: 'var(--accent)',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
          }}
          aria-label="Retry loading"
        >
          Try again
        </button>
      )}
    </div>
  );
}
