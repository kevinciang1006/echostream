'use client';

import { useState, useMemo } from 'react';
import type { Episode, MediaType } from '@/lib/types';
import EpisodeGrid from './EpisodeGrid';

type FilterType = 'all' | MediaType;

interface EpisodeFilterProps {
  episodes: Episode[];
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Podcasts', value: 'podcast' },
  { label: 'Videos', value: 'video' },
];

export default function EpisodeFilter({ episodes }: EpisodeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = episodes;

    if (activeFilter !== 'all') {
      result = result.filter((ep) => ep.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [episodes, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Filter Tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          role="tablist"
          aria-label="Filter episodes"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.value)}
                className="px-4 py-1.5 text-sm font-medium rounded transition-all duration-200"
                style={{
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ color: 'var(--text-muted)' }}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors duration-200"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            aria-label="Search episodes"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          />
        </div>
      </div>

      <EpisodeGrid episodes={filtered} />
    </div>
  );
}
