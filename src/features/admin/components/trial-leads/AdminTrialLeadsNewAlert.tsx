import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface IAdminTrialLeadsNewAlertProps {
  newCount: number;
  onReview: () => void;
}

export function AdminTrialLeadsNewAlert({ newCount, onReview }: IAdminTrialLeadsNewAlertProps) {
  if (newCount <= 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-gradient-to-r",
        "from-amber-500/[0.08] via-amber-500/[0.04] to-portal-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
      )}
      role="status"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
          <Clock className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-portal-heading">New leads need follow-up</p>
          <p className="mt-0.5 text-sm text-portal-muted">
            <span className="font-semibold text-amber-800">
              {newCount} lead{newCount === 1 ? "" : "s"}
            </span>{" "}
            are waiting for your first contact via WhatsApp or phone.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
      >
        Review new leads
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
