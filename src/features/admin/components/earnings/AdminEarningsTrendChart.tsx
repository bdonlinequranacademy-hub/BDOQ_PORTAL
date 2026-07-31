import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import {
  formatShortBdt,
  type EarningsTrendRange,
  type IEarningsTrendPoint,
} from "@/features/admin/components/earnings/adminEarningsUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminEarningsTrendChartProps {
  data: IEarningsTrendPoint[];
  range: EarningsTrendRange;
  onRangeChange: (range: EarningsTrendRange) => void;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const PADDING = { top: 12, right: 8, bottom: 28, left: 42 };

function buildLinePath(
  values: number[],
  max: number,
  innerWidth: number,
  innerHeight: number
): string {
  if (values.length === 0) return "";
  const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = PADDING.left + index * step;
      const y = PADDING.top + innerHeight - (max > 0 ? (value / max) * innerHeight : 0);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  linePath: string,
  values: number[],
  innerWidth: number,
  innerHeight: number
): string {
  if (!linePath || values.length === 0) return "";
  const lastX = PADDING.left + (values.length > 1 ? innerWidth : 0);
  const baseY = PADDING.top + innerHeight;
  return `${linePath} L ${lastX} ${baseY} L ${PADDING.left} ${baseY} Z`;
}

export function AdminEarningsTrendChart({
  data,
  range,
  onRangeChange,
}: IAdminEarningsTrendChartProps) {
  const { t, formatBdt } = usePortalTranslation();
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const maxValue = useMemo(() => Math.max(...data.map((point) => point.amount), 1), [data]);
  const values = data.map((point) => point.amount);
  const linePath = buildLinePath(values, maxValue, innerWidth, innerHeight);
  const areaPath = buildAreaPath(linePath, values, innerWidth, innerHeight);

  const gridLines = [0, 0.5, 1].map((ratio) => ({
    y: PADDING.top + innerHeight * (1 - ratio),
    label: formatShortBdt(Math.round(maxValue * ratio), formatBdt),
  }));

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">{t("admin.earnings.trendTitle")}</h2>
          <p className="mt-0.5 text-xs text-portal-muted">{t("admin.earnings.subtitle")}</p>
        </div>
        <select
          className={cn(formControlClass, "h-9 min-h-9 py-1.5 text-xs shadow-none")}
          value={range}
          onChange={(event) => onRangeChange(event.target.value as EarningsTrendRange)}
          aria-label={t("admin.earnings.trendTitle")}
        >
          <option value="year">{t("admin.earnings.trendRangeYear")}</option>
          <option value="six_months">{t("admin.earnings.trendRangeSixMonths")}</option>
        </select>
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-auto w-full min-w-[280px]"
          role="img"
          aria-label={t("admin.earnings.trendChartAria")}
        >
          {gridLines.map((line) => (
            <g key={line.y}>
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

          {areaPath ? <path d={areaPath} className="fill-primary/15" /> : null}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              className="stroke-primary"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {values.map((value, index) => {
            const step = values.length > 1 ? innerWidth / (values.length - 1) : 0;
            const x = PADDING.left + index * step;
            const y =
              PADDING.top + innerHeight - (maxValue > 0 ? (value / maxValue) * innerHeight : 0);
            return (
              <circle
                key={data[index]?.label ?? index}
                cx={x}
                cy={y}
                r="3.5"
                className="fill-primary stroke-portal-surface"
                strokeWidth="2"
              />
            );
          })}

          {data.map((point, index) => {
            const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;
            const x = PADDING.left + index * step;
            return (
              <text
                key={point.label}
                x={x}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                className="fill-portal-muted text-[9px] font-medium"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
