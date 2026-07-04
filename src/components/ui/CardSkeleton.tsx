export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="portal-card flex animate-pulse flex-col gap-3 p-5">
      <div className="h-4 w-2/5 rounded-md bg-portal-surface-muted/40" />
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-3 rounded-md bg-portal-surface-muted/30"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
