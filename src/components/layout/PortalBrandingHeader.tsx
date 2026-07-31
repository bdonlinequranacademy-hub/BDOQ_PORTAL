import { BDOQ_BRAND } from "@/lib/bdoqBrand";
import {
  getPortalBrandingMeta,
  PORTAL_HEADER_MOSQUE_SRC,
  PORTAL_HEADER_PATTERN_SRC,
  PORTAL_HEADER_RIGHT_SCENE_SRC,
} from "@/lib/portalBranding";
import { PortalBrandingQuoteCarousel } from "@/components/layout/PortalBrandingQuoteCarousel";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { Role } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface IPortalBrandingHeaderProps {
  name: string;
  role: Role;
  className?: string;
}

function displayName(name: string, fallback: string): string {
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function BrandCrestMark() {
  return (
    <div className="portal-brand-crest relative mb-3 flex items-center justify-center" aria-hidden>
      <span className="portal-brand-crest__ring absolute size-14 rounded-full border border-[#D4A853]/50 xl:size-16" />
      <span className="portal-brand-crest__glow absolute size-10 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.35)_0%,transparent_70%)] xl:size-12" />
      <svg
        className="portal-brand-crest__icon relative z-[1] size-9 text-[#F5E6C8] xl:size-10"
        viewBox="0 0 48 48"
        fill="none"
      >
        <defs>
          <linearGradient id="crestGold" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF1CC" />
            <stop offset="0.45" stopColor="#D4A853" />
            <stop offset="1" stopColor="#8B6A2B" />
          </linearGradient>
          <linearGradient id="crestGreen" x1="14" y1="16" x2="34" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A7F3D0" />
            <stop offset="1" stopColor="#32C991" />
          </linearGradient>
        </defs>
        <path
          fill="url(#crestGold)"
          d="M24 4.5 27.2 16.8 39.5 20 27.2 23.2 24 35.5 20.8 23.2 8.5 20 20.8 16.8 24 4.5Z"
          opacity="0.95"
        />
        <path
          fill="url(#crestGreen)"
          d="M24 12.5 25.7 19.2 32.4 20.9 25.7 22.6 24 29.3 22.3 22.6 15.6 20.9 22.3 19.2 24 12.5Z"
        />
        <path
          fill="url(#crestGold)"
          d="M33.5 31.5c-3.6 2.8-8.7 2.6-12-.7-3.6-3.6-3.8-9.3-.5-13.1 4.2 5.1 10.6 6.8 15.8 5.1-1 3.4-1.7 6.5-3.3 8.7Z"
        />
      </svg>
    </div>
  );
}

export function PortalBrandingHeader({
  name,
  role,
  className,
}: IPortalBrandingHeaderProps) {
  const { t, role: roleLabel, portalLabel, brandingSubtitle } = usePortalTranslation();
  const meta = getPortalBrandingMeta(role);
  const greetingName = displayName(name, t("branding.userFallback"));
  const portalLabelText = portalLabel(role);
  const subtitle = brandingSubtitle(role);

  return (
    <section
      className={cn(
        "portal-branding-header relative overflow-hidden rounded-[22px] border border-[#0A5C46]",
        "bg-[#004D3A] shadow-[0_16px_40px_-18px_rgba(0,40,30,0.55)]",
        "dark:border-[#0A4D3C] dark:bg-[#00382C]",
        className
      )}
      aria-label={t("layout.portalWelcome")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 85% 50%, rgba(212,168,83,0.22), transparent 55%), radial-gradient(ellipse 60% 80% at 10% 80%, rgba(50,201,145,0.12), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative grid min-h-[188px] grid-cols-1 lg:grid-cols-[minmax(168px,0.85fr)_minmax(0,1.55fr)_minmax(210px,1fr)]">
        {/* LEFT — animated gradient brand (no logo) */}
        <aside className="relative z-[2] flex flex-col items-center justify-center px-4 py-5 text-center lg:px-5">
          <img
            src={PORTAL_HEADER_MOSQUE_SRC}
            alt=""
            aria-hidden
            decoding="async"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] w-full object-contain object-bottom opacity-[0.28]"
          />

          <div className="portal-brand-left relative z-[1] flex w-full max-w-[190px] flex-col items-center">
            <BrandCrestMark />

            <p className="portal-brand-gradient-text font-inter text-[1.05rem] font-extrabold uppercase leading-tight tracking-[0.06em] xl:text-[1.15rem]">
              {BDOQ_BRAND.shortName.toUpperCase()}
            </p>

            <div className="portal-brand-label mt-2.5 flex w-full items-center gap-1.5">
              <span className="portal-brand-label__line h-px flex-1" aria-hidden />
              <p className="portal-brand-gradient-text--gold shrink-0 whitespace-nowrap font-inter text-[10px] font-extrabold uppercase tracking-[0.16em] xl:text-[11px]">
                {portalLabelText}
              </p>
              <span className="portal-brand-label__line h-px flex-1 rotate-180" aria-hidden />
            </div>

            <p className="portal-brand-tagline mt-3 font-display text-[11px] font-semibold italic leading-snug text-[#CDE8DC]/90 xl:text-xs">
              {t("portal.tagline")}
            </p>
            <div className="portal-brand-dots mt-2.5 flex items-center gap-1.5" aria-hidden>
              <span />
              <span />
              <span />
            </div>
          </div>
        </aside>

        {/* CENTER — soft islamic elegance panel */}
        <div className="relative z-[3] flex items-stretch px-2 py-3 sm:px-3 sm:py-4 lg:px-2 lg:py-5">
          <div className="portal-branding-scallop relative flex w-full flex-col justify-center overflow-hidden rounded-[18px] shadow-[0_14px_36px_-16px_rgba(0,40,30,0.45)] ring-1 ring-[#D4A853]/60">
            {/* gold double rim */}
            <div
              className="pointer-events-none absolute inset-[3px] z-[2] rounded-[15px] border border-[#D4A853]/40"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2] rounded-[18px] shadow-[inset_0_0_0_1.5px_rgba(212,168,83,0.5)]"
              aria-hidden
            />

            {/* islamic geo pattern wash */}
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.11]"
              style={{
                backgroundImage: `url("${PORTAL_HEADER_PATTERN_SRC}")`,
                backgroundSize: "52px 52px",
              }}
              aria-hidden
            />

            {/* soft mosque watermark */}
            <img
              src={PORTAL_HEADER_MOSQUE_SRC}
              alt=""
              aria-hidden
              decoding="async"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[52%] w-full object-contain object-bottom opacity-[0.12]"
            />

            {/* corner gold accents */}
            <span
              className="pointer-events-none absolute left-3 top-3 z-[2] size-5 border-l-2 border-t-2 border-[#D4A853]/55"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute right-3 top-3 z-[2] size-5 border-r-2 border-t-2 border-[#D4A853]/55"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 left-3 z-[2] size-5 border-b-2 border-l-2 border-[#D4A853]/55"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 right-3 z-[2] size-5 border-b-2 border-r-2 border-[#D4A853]/55"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(212,168,83,0.12))]"
              aria-hidden
            />

            <div className="relative z-[1] grid gap-5 px-5 py-5 sm:px-6 sm:py-6 md:grid-cols-[1.05fr_auto_1fr] md:items-center md:gap-6 lg:px-7 lg:py-6">
              <div className="min-w-0">
                <p className="font-inter text-[0.9375rem] font-semibold tracking-wide text-[#3F5A4E]">
                  {t("branding.welcomeBack")}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                  <h2 className="font-display text-[1.85rem] font-extrabold leading-none tracking-tight text-[#064E3B] sm:text-[2.1rem]">
                    {greetingName}
                  </h2>
                  <span
                    className={cn(
                      "inline-flex translate-y-0.5 rounded-full border px-3 py-1 font-inter text-[11px] font-extrabold uppercase tracking-[0.06em] shadow-sm",
                      meta.badgeClass
                    )}
                  >
                    {roleLabel(role)}
                  </span>
                </div>
                <p className="mt-2.5 max-w-[300px] font-inter text-[0.9375rem] font-medium leading-relaxed text-[#4A6358]">
                  {subtitle}
                </p>
              </div>

              <div
                className="mx-auto hidden h-[5.25rem] w-px shrink-0 bg-gradient-to-b from-transparent via-[#D4A853]/75 to-transparent md:block"
                aria-hidden
              />

              <PortalBrandingQuoteCarousel />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="relative z-[1] hidden min-h-[180px] overflow-hidden lg:block">
          <img
            src={PORTAL_HEADER_RIGHT_SCENE_SRC}
            alt=""
            aria-hidden
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#004D3A_0%,rgba(0,77,58,0.35)_28%,transparent_55%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(0,61,46,0.55),transparent)]"
            aria-hidden
          />
        </aside>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-8 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 50% 120%, rgba(212,168,83,0.35), transparent 60%)",
        }}
        aria-hidden
      />
    </section>
  );
}
