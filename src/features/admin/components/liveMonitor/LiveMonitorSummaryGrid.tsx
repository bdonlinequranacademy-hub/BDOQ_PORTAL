import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  UserX,
} from "lucide-react";
import type { LiveMonitorSummary } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface ILiveMonitorSummaryGridProps {
  summary: LiveMonitorSummary;
}

interface IStatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  highlight?: boolean;
}

export function LiveMonitorSummaryGrid({ summary }: ILiveMonitorSummaryGridProps) {
  const { t } = usePortalTranslation();

  const items: IStatItem[] = [
    {
      label: t("admin.liveMonitor.summary.liveNow"),
      value: summary.liveCount,
      icon: Radio,
      tone: "text-red-600 dark:text-red-400",
      highlight: summary.liveCount > 0,
    },
    {
      label: t("admin.liveMonitor.summary.upcoming"),
      value: summary.upcomingCount,
      icon: Clock,
      tone: "text-primary dark:text-emerald-400",
    },
    {
      label: t("admin.liveMonitor.summary.completed"),
      value: summary.completedCount,
      icon: CheckCircle2,
      tone: "text-portal-muted",
    },
    {
      label: t("admin.liveMonitor.summary.teacherLate"),
      value: summary.teacherLateCount,
      icon: AlertTriangle,
      tone: "text-amber-600 dark:text-amber-400",
    },
    {
      label: t("admin.liveMonitor.summary.studentNoShow"),
      value: summary.studentNoShowCount,
      icon: UserX,
      tone: "text-red-500 dark:text-red-400",
    },
    {
      label: t("admin.liveMonitor.summary.teacherNoShow"),
      value: summary.teacherNoShowCount,
      icon: UserX,
      tone: "text-red-700 dark:text-red-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-2xl border bg-portal-surface p-3.5 shadow-sm transition",
            item.highlight
              ? "border-red-500/35 ring-1 ring-red-500/15 dark:ring-red-500/20"
              : "border-portal"
          )}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-portal-muted">
            <item.icon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </div>
          <p className={cn("mt-1.5 text-2xl font-bold tabular-nums", item.tone)}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
