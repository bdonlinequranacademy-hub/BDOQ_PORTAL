import type { TrialBookingStatus } from "@/types/models";
import { trialLeadStatusStyles } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function TrialLeadStatusBadge({ status }: { status: TrialBookingStatus }) {
  const { statusLabel } = usePortalTranslation();

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        trialLeadStatusStyles(status)
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
