type PageLoadingProps = {
  label?: string;
  /** Smaller padding — cards, widgets, sheets */
  compact?: boolean;
};

export function PageLoading({ label = "Loading…", compact = false }: PageLoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${compact ? "py-8" : "py-16"}`}
    >
      <div
        className={`${compact ? "size-7" : "size-9"} animate-spin rounded-full border-2 border-portal border-t-[#03214F] dark:border-t-[#C4922B]`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-portal-muted">{label}</p>
    </div>
  );
}
