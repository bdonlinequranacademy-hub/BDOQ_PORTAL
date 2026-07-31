import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { IAttendanceTrendPoint } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminAttendanceTrendChartProps {
  data: IAttendanceTrendPoint[];
}

const CHART_WIDTH = 340;
const CHART_HEIGHT = 180;
const PADDING = { top: 12, right: 8, bottom: 36, left: 40 };

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

export function AdminAttendanceTrendChart({ data }: IAdminAttendanceTrendChartProps) {
  const { t, formatNumber } = usePortalTranslation();
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const values = data.map((point) => point.percentage);
  const linePath = buildLinePath(values, innerWidth, innerHeight);
  const areaPath = buildAreaPath(linePath, values, innerWidth, innerHeight);

  const gridLines = useMemo(
    () =>
      [0, 25, 50, 75, 100].map((value) => ({
        y: PADDING.top + innerHeight - (value / 100) * innerHeight,
        label: `${formatNumber(value)}%`,
      })),
    [innerHeight, formatNumber]
  );

  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div>
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.attendance.trendTitle")}
        </h2>
        <p className="mt-0.5 text-xs text-portal-muted">
          {t("admin.attendance.trendSubtitle")}
        </p>
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-portal-muted">
            {t("admin.attendance.noChartData")}
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[300px]"
            role="img"
            aria-label={t("admin.attendance.chartAria")}
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
              const y = PADDING.top + innerHeight - (value / 100) * innerHeight;
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
                  y={CHART_HEIGHT - 10}
                  textAnchor="middle"
                  className="fill-portal-muted text-[8px] font-medium"
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
        )}
      </div>
    </Card>
  );
}
