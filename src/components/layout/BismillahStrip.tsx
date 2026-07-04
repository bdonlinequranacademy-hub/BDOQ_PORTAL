import { BISMILLAH } from "@/lib/islamicPortal";
import { cn } from "@/lib/utils/cn";

interface IBismillahStripProps {
  className?: string;
}

/** Decorative Bismillah — portal page top banner */
export function BismillahStrip({ className }: IBismillahStripProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-portal bg-portal-surface px-4 py-3 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-4",
        className
      )}
      aria-label="Bismillahir Rahmanir Rahim"
    >
      <p className="font-arabic text-2xl leading-loose tracking-wide text-primary-dark dark:text-gold sm:text-3xl md:text-4xl">
        {BISMILLAH}
      </p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-portal-muted sm:text-xs">
        Bismillahir Rahmanir Rahim
      </p>
    </div>
  );
}
