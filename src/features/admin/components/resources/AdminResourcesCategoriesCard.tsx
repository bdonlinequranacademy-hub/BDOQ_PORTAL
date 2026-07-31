import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import type { IResourceCategoryRow } from "@/features/admin/components/resources/adminResourcesUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminResourcesCategoriesCardProps {
  rows: IResourceCategoryRow[];
  activeKey?: string;
  onSelect: (row: IResourceCategoryRow) => void;
}

export function AdminResourcesCategoriesCard({
  rows,
  activeKey,
  onSelect,
}: IAdminResourcesCategoriesCardProps) {
  const { t } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.cms.resources.resourceCategories")}
      </h2>
      <p className="mt-0.5 text-xs text-portal-muted">
        {t("admin.cms.resources.byTypeTopic")}
      </p>

      <ul className="mt-4 space-y-1">
        {rows.map((row) => {
          const active = activeKey === row.key;
          return (
            <li key={row.key}>
              <button
                type="button"
                onClick={() => onSelect(row)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition",
                  active
                    ? "bg-primary/10 font-semibold text-primary-dark"
                    : "text-portal-heading hover:bg-portal-muted/30"
                )}
              >
                <span className="truncate">{row.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                    active ? "bg-primary/20 text-primary-dark" : "bg-portal-muted/40 text-portal-muted"
                  )}
                >
                  {row.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
