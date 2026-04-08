export default function Footer() {
  return (
    <footer
      className="mt-auto py-8 px-6 text-center text-sm"
      style={{
        background: 'var(--bg-secondary)',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
      }}
    >
      © 2025 EchoStream. Built with Next.js, Node.js &amp; AWS.
    </footer>
  );
}
