import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { cn } from "@/lib/utils/cn";

/** Portal sidebar — single logo placement for the authenticated app */
export function BrandLogo({
  className,
  subtitle,
  compact = false,
}: {
  className?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        role="img"
        aria-label={BDOQ_BRAND.shortName}
      >
        <img
          src={BDOQ_BRAND.logoSrc}
          alt=""
          aria-hidden
          decoding="async"
          className="size-10 object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full flex-col items-center gap-3 text-center", className)}
      role="img"
      aria-label={BDOQ_BRAND.shortName}
    >
      <img
        src={BDOQ_BRAND.logoSrc}
        alt=""
        aria-hidden
        decoding="async"
        className="mx-auto w-full max-h-[140px] object-contain"
      />
      {subtitle ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/90">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
