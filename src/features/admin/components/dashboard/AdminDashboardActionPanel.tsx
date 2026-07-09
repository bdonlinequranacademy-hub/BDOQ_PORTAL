import { ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export interface IAdminDashboardActionItem {
  id: string;
  title: string;
  actionLabel: string;
  onAction: () => void;
  accent?: "primary" | "amber" | "rose" | "violet" | "sky";
}

interface IAdminDashboardActionPanelProps {
  items: IAdminDashboardActionItem[];
}

const accentDot: Record<NonNullable<IAdminDashboardActionItem["accent"]>, string> = {
  primary: "bg-primary",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
};

function ActionRow({ item }: { item: IAdminDashboardActionItem }) {
  return (
    <div className="rounded-xl border border-portal/80 bg-portal-muted/30 p-3.5">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            accentDot[item.accent ?? "primary"]
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-portal-heading">{item.title}</p>
          <button
            type="button"
            onClick={item.onAction}
            className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
          >
            {item.actionLabel}
            <ChevronRight className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardActionPanel({ items }: IAdminDashboardActionPanelProps) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
      <div>
        <h2 className="text-base font-bold text-portal-heading">Action required</h2>
        <p className="mt-0.5 text-sm text-portal-muted">Review these items first</p>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <ActionRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-portal bg-portal-muted/20 px-4 py-8 text-center">
          <CheckCircle2 className="size-8 text-primary/70" aria-hidden />
          <p className="mt-3 text-sm font-semibold text-portal-heading">All caught up</p>
          <p className="mt-1 text-xs text-portal-muted">No pending admin actions right now</p>
        </div>
      )}
    </Card>
  );
}
