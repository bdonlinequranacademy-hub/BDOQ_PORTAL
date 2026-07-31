import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminAttendanceSummaryCardProps {
  present: number;
  absent: number;
  total: number;
}

export function AdminAttendanceSummaryCard({
  present,
  absent,
  total,
}: IAdminAttendanceSummaryCardProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  const pctOfTotalLabel = (count: number): string => {
    const pctValue = total <= 0 ? 0 : Math.round((count / total) * 1000) / 10;
    return t("labels.of_total", { pct: `${formatNumber(pctValue)}%` });
  };

  const items = [
    { label: statusLabel("present"), count: present, color: "#32C991" },
    { label: statusLabel("absent"), count: absent, color: "#EF4444" },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.attendance.summaryTitle")}
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 font-medium text-portal-heading">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <span className="font-semibold tabular-nums">
                {formatNumber(item.count)} · {pctOfTotalLabel(item.count)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-portal-muted/40">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-portal-muted">{t("admin.attendance.summaryFootnote")}</p>
      </div>
    </Card>
  );
}
