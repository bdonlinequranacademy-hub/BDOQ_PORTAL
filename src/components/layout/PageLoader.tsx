export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 animate-page-in">
      <div className="relative size-10">
        <div className="absolute inset-0 rounded-full border-2 border-portal-border" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold" />
      </div>
      <p className="text-sm text-portal-muted">Loading…</p>
    </div>
  );
}
