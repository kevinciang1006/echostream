'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13, 13, 13, 0.92)' : 'var(--bg-primary)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid var(--accent)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          ECHO
          <span style={{ color: 'var(--accent)' }}>STREAM</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium transition-colors duration-200 hover:text-white"
            style={{ color: 'var(--text-secondary)' }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors duration-200 hover:text-white"
            style={{ color: 'var(--text-secondary)' }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
