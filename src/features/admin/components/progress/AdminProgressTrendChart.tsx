import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import type {
  IProgressTrendPoint,
  ProgressTrendRange,
} from "@/features/admin/components/progress/adminProgressUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminProgressTrendChartProps {
  data: IProgressTrendPoint[];
  range: ProgressTrendRange;
  onRangeChange: (range: ProgressTrendRange) => void;
}

const CHART_WIDTH = 360;
const CHART_HEIGHT = 190;
const PADDING = { top: 14, right: 12, bottom: 36, left: 40 };

function buildLinePath(
  values: number[],
  innerWidth: number,
  innerHeight: number
): string {
  if (values.length === 0) return "";
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = PADDING.left + index * step;
      const y = PADDING.top + innerHeight - (value / 100) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function AdminProgressTrendChart({
  data,
  range,
  onRangeChange,
}: IAdminProgressTrendChartProps) {
  const { t, formatNumber } = usePortalTranslation();
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const tajweedValues = data.map((point) => point.tajweed);
  const memorizationValues = data.map((point) => point.memorization);
  const tajweedPath = buildLinePath(tajweedValues, innerWidth, innerHeight);
  const memorizationPath = buildLinePath(memorizationValues, innerWidth, innerHeight);

  const gridLines = useMemo(
    () =>
      [0, 25, 50, 75, 100].map((value) => ({
        y: PADDING.top + innerHeight - (value / 100) * innerHeight,
        label: `${formatNumber(value)}%`,
      })),
    [innerHeight, formatNumber]
  );

  const hasData = data.some((point) => point.tajweed > 0 || point.memorization > 0);

  const monthLabel = (label: string) => {
    const translated = t(`months.${label}`);
    return translated === `months.${label}` ? label : translated;
  };

  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">{t("admin.progress.progressOverview")}</h2>
          <p className="mt-0.5 text-xs text-portal-muted">{t("admin.progress.monthlyAverage")}</p>
        </div>
        <select
          className={cn(formControlClass, "h-9 min-h-9 py-1.5 text-xs shadow-none")}
          value={range}
          onChange={(event) => onRangeChange(event.target.value as ProgressTrendRange)}
          aria-label={t("admin.progress.trendRangeLabel")}
        >
          <option value="year">{t("admin.progress.trendThisYear")}</option>
          <option value="six_months">{t("admin.progress.trendSixMonths")}</option>
        </select>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-semibold">
        <span className="inline-flex items-center gap-1.5 text-portal-heading">
          <span className="size-2 rounded-full bg-primary" />
          {t("tables.tajweed")}
        </span>
        <span className="inline-flex items-center gap-1.5 text-portal-heading">
          <span className="size-2 rounded-full bg-amber-500" />
          {t("tables.memorization")}
        </span>
      </div>

      <div className="mt-2 w-full overflow-x-auto">
        {!hasData ? (
          <p className="py-10 text-center text-sm text-portal-muted">
            {t("admin.progress.noUpdatesInPeriod")}
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[300px]"
            role="img"
            aria-label={t("admin.progress.chartAriaLabel")}
          >
            {gridLines.map((line) => (
              <g key={line.label}>
                <line
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={line.y}
                  y2={line.y}
                  stroke="currentColor"
                  className="text-portal-muted/30"
                  strokeDasharray="4 4"
                />
                <text
                  x={PADDING.left - 6}
                  y={line.y + 4}
                  textAnchor="end"
                  className="fill-portal-muted text-[9px]"
                >
                  {line.label}
                </text>
              </g>
            ))}

            {tajweedPath ? (
              <path
                d={tajweedPath}
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {memorizationPath ? (
              <path
                d={memorizationPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {data.map((point, index) => {
              const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;
              const x = PADDING.left + index * step;
              return (
                <text
                  key={point.label}
                  x={x}
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  className="fill-portal-muted text-[8px] font-medium"
                >
                  {monthLabel(point.label)}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </Card>
  );
}
