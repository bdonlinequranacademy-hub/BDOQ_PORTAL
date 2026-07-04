import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

export function ThemeToggle({
  compact = false,
  inverted = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  const compactClass = inverted
    ? "rounded-lg p-1.5 text-white/80 transition hover:bg-white/10"
    : "rounded-lg p-1.5 text-portal-heading transition hover:bg-portal-surface-muted/40";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? compactClass
          : "inline-flex items-center gap-2 rounded-xl border border-portal-border bg-portal-surface px-3 py-1.5 text-sm text-portal-heading transition hover:bg-portal-surface-muted/30"
      }
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className={`size-4 ${inverted ? "text-gold" : "text-gold"}`} />
      ) : (
        <Moon className={`size-4 ${inverted ? "text-white" : "text-portal-heading"}`} />
      )}
      {!compact ? <span>{isDark ? "Light" : "Dark"}</span> : null}
    </button>
  );
}
