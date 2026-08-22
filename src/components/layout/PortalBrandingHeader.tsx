import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { getPortalBrandingMeta } from "@/lib/portalBranding";
import type { Role } from "@/types/models";
import { cn } from "@/lib/utils/cn";
import { Sparkles } from "lucide-react";

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

export function PortalBrandingHeader({
  name,
  role,
  className,
}: IPortalBrandingHeaderProps) {
  const { t, role: roleLabel, brandingSubtitle } = usePortalTranslation();
  const meta = getPortalBrandingMeta(role);
  const greetingName = displayName(name, t("branding.userFallback"));
  const subtitle = brandingSubtitle(role);

  return (
    <section
      className={cn(
        "portal-branding-header relative flex flex-col sm:flex-row sm:items-center sm:justify-between overflow-hidden rounded-xl border border-gold/20 bg-white px-5 py-4 shadow-sm dark:border-gold/10 dark:bg-portal-surface",
        className
      )}
      aria-label={t("layout.portalWelcome")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top right, #D4A853, transparent 50%)",
        }}
        aria-hidden
      />
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#A7F3D0]">
          <Sparkles className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 font-display text-lg font-bold text-portal-heading sm:text-xl">
            <span className="truncate">{t("branding.welcomeBack")}, {greetingName}</span>
            <span
              className={cn(
                "inline-flex translate-y-[1px] rounded-full border px-2 py-0.5 font-inter text-[9px] font-extrabold uppercase tracking-wider shadow-sm",
                meta.badgeClass
              )}
            >
              {roleLabel(role)}
            </span>
          </h2>
          <p className="truncate text-xs font-medium text-portal-muted sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
