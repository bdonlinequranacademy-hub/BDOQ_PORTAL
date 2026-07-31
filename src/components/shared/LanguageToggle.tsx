import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LocaleType } from "@/i18n/types";
import { useLocaleContext } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface ILanguageToggleProps {
  className?: string;
  variant?: "light" | "dark";
}

const LOCALES = [
  { id: "en" as const, flag: "us", label: "EN", name: "English" },
  { id: "bn" as const, flag: "bd", label: "BN", name: "বাংলা" },
] as const;

function FlagImage({
  code,
  name,
  size = "md",
}: {
  code: string;
  name: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-1 ring-black/10",
        size === "sm" ? "h-5 w-5" : "h-6 w-6"
      )}
    >
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        alt={`${name} flag`}
        className="h-full w-full object-cover"
        width={size === "sm" ? 20 : 24}
        height={size === "sm" ? 20 : 24}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

export function LanguageToggle({
  className,
  variant = "light",
}: ILanguageToggleProps) {
  const { locale, setLocale, t } = useLocaleContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];
  const isDark = variant === "dark";

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleSelect = (nextLocale: LocaleType): void => {
    setOpen(false);
    if (nextLocale === locale) return;
    setLocale(nextLocale);
  };

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("layout.languageLabel", { name: active.name })}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isDark
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-transparent text-primary-dark hover:bg-primary/10 dark:text-portal-heading dark:hover:bg-portal-surface-muted/30"
        )}
      >
        <FlagImage code={active.flag} name={active.name} />
        <span className="uppercase tracking-wide">{active.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            isDark ? "text-white/80" : "text-portal-muted",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("layout.selectLanguage")}
          className={cn(
            "absolute right-0 top-[calc(100%+6px)] z-50 min-w-[10rem] overflow-hidden rounded-xl border p-1 shadow-lg",
            isDark
              ? "border-white/15 bg-primary-dark text-white"
              : "border-gray-200 bg-white text-primary-dark dark:border-portal-border dark:bg-portal-surface dark:text-portal-heading"
          )}
        >
          {LOCALES.map((item) => {
            const selected = item.id === locale;
            return (
              <li key={item.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? isDark
                        ? "bg-white/15 font-semibold"
                        : "bg-primary/10 font-semibold text-primary dark:bg-primary/20"
                      : isDark
                        ? "hover:bg-white/10"
                        : "hover:bg-primary/5 dark:hover:bg-portal-surface-muted/30"
                  )}
                >
                  <FlagImage code={item.flag} name={item.name} size="sm" />
                  <span className="uppercase tracking-wide">{item.label}</span>
                  <span
                    className={cn(
                      "ml-auto text-xs font-normal normal-case",
                      isDark ? "text-white/60" : "text-portal-muted"
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
