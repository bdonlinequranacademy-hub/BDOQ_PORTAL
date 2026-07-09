import { CheckCircle2, Clock, GraduationCap, User, XCircle } from "lucide-react";
import type { LiveMonitorJoinStatus } from "@/types/models";
import { cn } from "@/lib/utils/cn";

interface ILiveMonitorJoinBadgeProps {
  role: "Teacher" | "Student";
  status: LiveMonitorJoinStatus;
  variant?: "inline" | "panel";
  joinedAt?: string;
}

const STATUS_CONFIG: Record<
  LiveMonitorJoinStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    pillClass: string;
    panelClass: string;
    iconWrapClass: string;
    accentClass: string;
  }
> = {
  joined: {
    label: "Joined",
    icon: CheckCircle2,
    pillClass:
      "border-emerald-500/35 bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
    panelClass: "border-emerald-500/25 bg-emerald-500/[0.06]",
    iconWrapClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    accentClass: "border-l-emerald-500",
  },
  late: {
    label: "Late",
    icon: Clock,
    pillClass: "border-amber-500/35 bg-amber-500/12 text-amber-900 dark:text-amber-300",
    panelClass: "border-amber-500/25 bg-amber-500/[0.07]",
    iconWrapClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    accentClass: "border-l-amber-500",
  },
  not_joined: {
    label: "Not joined",
    icon: XCircle,
    pillClass: "border-red-500/35 bg-red-500/12 text-red-800 dark:text-red-300",
    panelClass: "border-red-500/25 bg-red-500/[0.06]",
    iconWrapClass: "bg-red-500/15 text-red-700 dark:text-red-300",
    accentClass: "border-l-red-500",
  },
};

function formatJoinedAt(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LiveMonitorJoinBadge({
  role,
  status,
  variant = "inline",
  joinedAt,
}: ILiveMonitorJoinBadgeProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;
  const RoleIcon = role === "Teacher" ? GraduationCap : User;
  const joinedLabel = formatJoinedAt(joinedAt);

  if (variant === "panel") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-l-[3px] px-3.5 py-3",
          config.panelClass,
          config.accentClass
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            config.iconWrapClass
          )}
        >
          <RoleIcon className="size-4" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-portal-heading">{role}</p>
          <p className="mt-0.5 text-xs text-portal-muted">
            {joinedLabel
              ? `Joined at ${joinedLabel}`
              : status === "not_joined"
                ? "Waiting for portal Launch"
                : "Joined via portal Launch"}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
            config.pillClass
          )}
        >
          <StatusIcon className="size-3.5" aria-hidden />
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm",
        config.pillClass
      )}
    >
      <RoleIcon className="size-3 shrink-0 opacity-80" aria-hidden />
      <span className="text-portal-heading/80">{role}</span>
      <span className="opacity-40" aria-hidden>
        ·
      </span>
      <StatusIcon className="size-3 shrink-0" aria-hidden />
      <span>{config.label}</span>
    </span>
  );
}
