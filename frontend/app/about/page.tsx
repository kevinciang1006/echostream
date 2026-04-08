import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | EchoStream',
  description: 'About EchoStream — a production-grade media streaming platform demo.',
};

const TECH_STACK = [
  { label: 'Next.js 15', color: '#000', bg: '#fff' },
  { label: 'React 19', color: '#fff', bg: '#087EA4' },
  { label: 'TypeScript', color: '#fff', bg: '#3178C6' },
  { label: 'HLS.js', color: '#fff', bg: '#E8192C' },
  { label: 'Tailwind CSS', color: '#fff', bg: '#0F766E' },
  { label: 'Node.js', color: '#fff', bg: '#417E38' },
  { label: 'Express', color: '#fff', bg: '#404040' },
  { label: 'AWS S3', color: '#fff', bg: '#E35B16' },
  { label: 'CloudFront', color: '#fff', bg: '#7B1FA2' },
  { label: 'App Runner', color: '#fff', bg: '#C62828' },
  { label: 'AWS Amplify', color: '#fff', bg: '#FF9900' },
  { label: 'Docker', color: '#fff', bg: '#1565C0' },
  { label: 'GitHub Actions', color: '#fff', bg: '#161616' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        About EchoStream
      </h1>

      <div className="space-y-5 text-base leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
        <p>
          EchoStream is a production-grade media streaming platform built to demonstrate fullstack engineering across the entire stack — from React server components and adaptive bitrate video delivery, to containerised Node.js APIs and AWS cloud infrastructure. It is designed as a portfolio piece for senior engineering roles, showing real-world patterns rather than toy examples.
        </p>
        <p>
          The platform streams audio and video content using HLS (HTTP Live Streaming), delivered through AWS CloudFront for global low-latency distribution. The custom player — built from scratch with hls.js — supports adaptive bitrate switching, quality selection, keyboard shortcuts, and graceful error handling, without relying on any third-party player UI.
        </p>
      </div>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech.label}
              className="px-3 py-1.5 text-xs font-medium rounded-full"
              style={{ background: tech.bg, color: tech.color }}
            >
              {tech.label}
            </span>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section>
        <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Architecture
        </h2>
        <pre
          className="text-xs leading-relaxed p-6 rounded-lg overflow-x-auto"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            fontFamily: 'monospace',
          }}
        >
          {`
┌─────────────────────────────────────────────────────┐
│                    Client Browser                    │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
               ▼                  ▼
┌──────────────────┐   ┌──────────────────────────┐
│  AWS Amplify     │   │  AWS App Runner          │
│  (Next.js SSR)   │   │  (Node.js/Express API)   │
└──────────────────┘   └──────────────────────────┘
                                  │
               ┌──────────────────┘
               ▼
┌──────────────────────────────────────┐
│         AWS CloudFront (CDN)         │
│  .m3u8 TTL: 30s / .ts TTL: 86400s   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│         AWS S3 (echostream-media)    │
│  /media/episodes/{id}/index.m3u8    │
│  /media/episodes/{id}/segment*.ts   │
│  /thumbnails/{id}.jpg               │
└──────────────────────────────────────┘
`.trim()}
        </pre>

        <div className="mt-8 space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <div
            className="rounded-lg p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              What is HLS Streaming?
            </h3>
            <p>
              HTTP Live Streaming (HLS) breaks video and audio into small <code className="text-xs px-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}>.ts</code> segments (~6 seconds each), described by a <code className="text-xs px-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}>.m3u8</code> manifest file. The player fetches the manifest, then downloads segments sequentially. Adaptive Bitrate (ABR) streaming embeds multiple quality variants in the manifest — the player automatically switches between them based on available bandwidth, ensuring smooth playback without buffering. CloudFront serves segments from edge locations close to the viewer, minimising latency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
