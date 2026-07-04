import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import { BISMILLAH, dailyPortalQuote } from "@/lib/islamicPortal";

/** Left panel on auth screens — green Islamic branding */
export function AuthBrandingPanel() {
  const quote = dailyPortalQuote();

  return (
    <div className="portal-auth-panel relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex lg:w-[42%] xl:w-[44%]">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <img
          src={BDOQ_BRAND.logoSrc}
          alt=""
          aria-hidden
          decoding="async"
          className="mx-auto max-h-28 w-auto object-contain"
        />
        <p className="mt-4 text-center font-display text-xl font-bold tracking-wide text-white">
          {BDOQ_BRAND.shortName}
        </p>
        <p className="mt-2 text-center text-xs font-medium uppercase tracking-[0.22em] text-gold/90">
          Online Quran Academy
        </p>
      </div>

      <div className="relative space-y-6">
        <p className="text-center font-arabic text-2xl leading-loose text-gold/95">{BISMILLAH}</p>
        <blockquote className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-center font-arabic text-xl leading-loose text-white/95">{quote.arabic}</p>
          <p className="mt-3 text-center text-sm leading-relaxed text-white/75">
            &ldquo;{quote.translation}&rdquo;
          </p>
          <footer className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-gold/80">
            {quote.source}
          </footer>
        </blockquote>
      </div>

      <p className="relative text-center text-xs leading-relaxed text-white/60">{BDOQ_BRAND.tagline}</p>
    </div>
  );
}
