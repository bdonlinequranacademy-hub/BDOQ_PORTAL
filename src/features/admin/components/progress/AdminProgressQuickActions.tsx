import { Link } from "react-router-dom";
import {
  BarChart3,
  Download,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface IAdminProgressQuickActionsProps {
  isFetching: boolean;
  onExport: () => void;
  onRefresh: () => void;
}

const actionTileClass =
  "flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 p-3.5 text-left transition hover:border-primary/25 hover:bg-primary/5";

export function AdminProgressQuickActions({
  isFetching,
  onExport,
  onRefresh,
}: IAdminProgressQuickActionsProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Quick actions</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={onExport} className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Download className="size-4 text-primary" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Student progress report</span>
        </button>
        <Link to="/admin/classes" className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-100">
            <GraduationCap className="size-4 text-blue-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Class progress report</span>
        </Link>
        <Link to="/admin/curriculum" className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-violet-100">
            <BarChart3 className="size-4 text-violet-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Program analysis</span>
        </Link>
        <Link to="/admin/users?role=student" className={actionTileClass}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-100">
            <Users className="size-4 text-emerald-600" aria-hidden />
          </span>
          <span className="text-xs font-semibold text-portal-heading">Student list</span>
        </Link>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-portal px-4 text-sm font-semibold text-portal-heading transition hover:border-primary/25 hover:text-primary disabled:opacity-50"
      >
        <RefreshCw
          className={cn("size-4 text-primary", isFetching && "animate-spin")}
          aria-hidden
        />
        {isFetching ? "Refreshing…" : "Refresh data"}
      </button>
    </Card>
  );
}
