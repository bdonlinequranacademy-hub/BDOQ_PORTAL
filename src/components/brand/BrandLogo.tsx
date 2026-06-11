import { cn } from "@/lib/utils/cn";

const sizeClasses = {
  sm: "h-10",
  sidebar: "h-14 w-auto",
  md: "h-14",
  lg: "h-[4.5rem]",
} as const;

type BrandLogoVariant = "auto" | "light" | "dark";
type BrandLogoLayout = "full" | "sidebar";

export function BrandLogo({
  size = "md",
  className,
  variant = "auto",
  layout = "full",
  subtitle,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
  /** auto: theme-aware swap; light/dark: force a specific mark */
  variant?: BrandLogoVariant;
  /** sidebar: icon + readable wordmark (for navy sidebar) */
  layout?: BrandLogoLayout;
  subtitle?: string;
}) {
  if (layout === "sidebar") {
    return (
      <div
        className={cn("brand-logo-sidebar flex flex-col items-center gap-2 bg-transparent", className)}
        role="img"
        aria-label="Al Bayaan"
      >
        <img
          src="/images/logo-mark-dark.png"
          alt=""
          aria-hidden
          draggable={false}
          className="brand-logo-sidebar__mark h-14 w-auto object-contain"
          decoding="async"
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="brand-wordmark text-[2.35rem] text-white">Al-bayaan</span>
          {subtitle ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  const showLight = variant === "light" || variant === "auto";
  const showDark = variant === "dark" || variant === "auto";

  return (
    <span
      className={cn(
        "brand-logo inline-flex items-center justify-center bg-transparent",
        variant === "auto" && "brand-logo--auto",
        variant === "dark" && "brand-logo--dark",
        variant === "light" && "brand-logo--light",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label="Al-bayaan"
    >
      {showLight ? (
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            "brand-logo__img brand-logo__img--light",
            variant === "auto" && "dark:hidden"
          )}
          decoding="async"
        />
      ) : null}
      {showDark ? (
        <img
          src="/images/logo-dark.png"
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            "brand-logo__img brand-logo__img--dark",
            variant === "auto" ? "hidden dark:block" : "block"
          )}
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = "/images/logo.png";
            img.classList.add("brand-logo__img--fallback");
          }}
        />
      ) : null}
    </span>
  );
}
