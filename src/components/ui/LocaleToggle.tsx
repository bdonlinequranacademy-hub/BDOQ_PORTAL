import { useUiStore, type AiLocale } from "@/stores/uiStore";

const OPTIONS: { id: AiLocale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "bn", label: "বাং" },
];

export function LocaleToggle() {
  const locale = useUiStore((s) => s.aiLocale);
  const setAiLocale = useUiStore((s) => s.setAiLocale);

  return (
    <div
      className="flex rounded-lg border border-portal bg-portal-muted p-0.5"
      role="group"
      aria-label="Display language for AI content"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setAiLocale(opt.id)}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
            locale === opt.id
              ? "bg-portal-surface text-portal-heading shadow-sm"
              : "text-portal-muted hover:text-portal-heading"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
