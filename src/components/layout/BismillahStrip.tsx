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
        "relative overflow-hidden rounded-xl border border-primary/10 bg-gradient-to-r from-primary/5 via-gold/10 to-primary/5 px-4 py-3 text-center sm:rounded-2xl sm:px-6 sm:py-4",
        className
      )}
      aria-label="Bismillahir Rahmanir Rahim"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "var(--islamic-pattern-light)", backgroundSize: "48px 48px" }}
        aria-hidden
      />
      <p className="relative font-arabic text-2xl leading-loose tracking-wide text-primary-dark dark:text-gold sm:text-3xl md:text-4xl">
        {BISMILLAH}
      </p>
      <p className="relative mt-0.5 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark dark:text-gold/80 sm:text-xs">
        Bismillahir Rahmanir Rahim
      </p>
    </div>
  );
}
