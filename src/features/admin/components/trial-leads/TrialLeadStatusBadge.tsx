import type { TrialBookingStatus } from "@/types/models";
import {
  trialLeadStatusLabel,
  trialLeadStatusStyles,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { cn } from "@/lib/utils/cn";

export function TrialLeadStatusBadge({ status }: { status: TrialBookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        trialLeadStatusStyles(status)
      )}
    >
      {trialLeadStatusLabel(status)}
    </span>
  );
}
