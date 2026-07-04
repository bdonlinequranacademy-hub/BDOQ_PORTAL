import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { LiveMonitorJoinStatus } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface ILiveMonitorJoinBadgeProps {
  role: "Teacher" | "Student";
  status: LiveMonitorJoinStatus;
}

const STATUS_CONFIG: Record<
  LiveMonitorJoinStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  joined: {
    label: "Joined",
    icon: CheckCircle2,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  late: {
    label: "Late",
    icon: Clock,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:border-amber-400/25 dark:bg-amber-500/15 dark:text-amber-300",
  },
  not_joined: {
    label: "Not joined",
    icon: XCircle,
    className:
      "border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-400/25 dark:bg-red-500/15 dark:text-red-300",
  },
};

export function LiveMonitorJoinBadge({ role, status }: ILiveMonitorJoinBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-semibold",
        config.className
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="text-portal-muted dark:text-inherit/70">{role}</span>
      <span>{config.label}</span>
    </span>
  );
}
