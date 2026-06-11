export function PageLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        className="size-9 animate-spin rounded-full border-2 border-portal border-t-[#03214F] dark:border-t-[#C4922B]"
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-portal-muted">{label}</p>
    </div>
  );
}
