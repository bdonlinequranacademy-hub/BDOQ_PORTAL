import { Check, Circle, Lightbulb, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

interface IAdminResourceChecklistProps {
  items: IChecklistItem[];
}

export function AdminResourceChecklist({ items }: IAdminResourceChecklistProps) {
  const { t } = usePortalTranslation();

  const doneCount = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-primary-dark">
          {t("admin.cms.resources.resourceChecklist")}
        </h2>
        <span className="text-xs font-bold text-primary">{pct}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-portal-muted/40">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5 text-sm">
            {item.done ? (
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-3" aria-hidden />
              </span>
            ) : (
              <Circle className="mt-0.5 size-5 shrink-0 text-portal-muted/50" aria-hidden />
            )}
            <span
              className={cn(
                item.done ? "text-portal-heading" : "text-portal-muted"
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const FORM_TIP_KEYS = [
  "admin.cms.resources.formTip1",
  "admin.cms.resources.formTip2",
  "admin.cms.resources.formTip3",
  "admin.cms.resources.formTip4",
] as const;

export function AdminResourceFormTips() {
  const { t } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-primary-dark" aria-hidden />
        <h2 className="text-sm font-bold text-primary-dark">
          {t("admin.cms.resources.tipsTitle")}
        </h2>
      </div>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-portal-muted">
        {FORM_TIP_KEYS.map((key) => (
          <li key={key} className="flex items-start gap-2">
            <Star className="mt-0.5 size-3 shrink-0 fill-primary text-primary" aria-hidden />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
