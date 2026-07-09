import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import {
  BISMILLAH,
  PORTAL_BRANDING_HADITH,
} from "@/lib/islamicPortal";
import {
  getPortalBrandingMeta,
  PORTAL_HEADER_QURAN_SRC,
} from "@/lib/portalBranding";
import type { Role } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface IPortalBrandingHeaderProps {
  name: string;
  role: Role;
  className?: string;
}

function displayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "User";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function BrandingLogo() {
  return (
    <div className="relative shrink-0">
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-[1.15rem] bg-gradient-to-b from-gold/25 to-gold/5"
        aria-hidden
      />
      <div className="relative flex size-[4.25rem] items-center justify-center rounded-2xl border border-gold/35 bg-white p-2 shadow-[0_8px_24px_-12px_rgba(212,168,83,0.45)] sm:size-[4.5rem] sm:p-2.5">
        <img
          src={BDOQ_BRAND.logoSrc}
          alt=""
          aria-hidden
          decoding="async"
          className="h-full w-full object-contain drop-shadow-sm"
        />
      </div>
    </div>
  );
}

export function PortalBrandingHeader({
  name,
  role,
  className,
}: IPortalBrandingHeaderProps) {
  const meta = getPortalBrandingMeta(role);
  const greetingName = displayName(name);

  return (
    <section
      className={cn(
        "portal-branding-header relative overflow-hidden rounded-xl border border-portal/80 bg-portal-surface shadow-[0_10px_32px_-24px_rgba(13,74,47,0.2)] sm:rounded-2xl",
        className
      )}
      aria-label="Portal welcome"
    >
      <div className="relative grid gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_200px] lg:items-center lg:gap-5 lg:p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_210px]">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <BrandingLogo />

          <div className="min-w-0 border-l border-portal/80 pl-3 sm:pl-4">
            <p className="font-inter text-[0.9375rem] font-medium text-portal-muted sm:text-base">
              Welcome back,
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-[1.625rem] font-bold leading-tight tracking-tight text-portal-heading sm:text-3xl">
                {greetingName}
              </h2>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 font-inter text-[11px] font-bold uppercase tracking-wide sm:text-xs",
                  meta.badgeClass
                )}
              >
                {meta.roleLabel}
              </span>
            </div>
            <p className="mt-1.5 max-w-lg font-inter text-[0.9375rem] leading-snug text-portal-heading/75 sm:text-base">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="relative min-w-0 border-t border-portal/80 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0 lg:pl-5">
          <p className="text-center font-arabic text-xl leading-relaxed text-primary-dark dark:text-gold lg:text-[1.35rem]">
            {BISMILLAH}
          </p>
          <p className="mt-2 text-center font-display text-[0.9375rem] italic leading-snug text-primary-dark dark:text-portal-heading sm:text-base">
            &ldquo;{PORTAL_BRANDING_HADITH.text}&rdquo;
          </p>
          <p className="mt-1.5 text-center font-inter text-xs font-semibold text-gold-dark dark:text-gold sm:text-sm">
            — {PORTAL_BRANDING_HADITH.source}
          </p>
        </div>

        <div className="relative hidden h-[5.25rem] overflow-hidden rounded-xl ring-1 ring-white/40 md:block lg:h-[5.5rem]">
          <img
            src={PORTAL_HEADER_QURAN_SRC}
            alt=""
            aria-hidden
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-white/75 dark:via-portal-surface/10 dark:to-portal-surface/80"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
