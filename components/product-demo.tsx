// Frames an interactive product walkthrough (Arcade, Storylane, Supademo) or a
// hosted video (YouTube, Vimeo). Falls back to `children` — normally the coded
// <AppPreview /> — until an embed URL is configured. Any host used here must
// also be allowed in the frame-src CSP in next.config.ts.

interface ProductDemoProps {
  embedUrl?: string;
  title: string;
  children: React.ReactNode;
}

export function ProductDemo({ embedUrl, title, children }: ProductDemoProps) {
  if (!embedUrl) return <>{children}</>;

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900 overflow-hidden aspect-video">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="fullscreen; clipboard-write"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
