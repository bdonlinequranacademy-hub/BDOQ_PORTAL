import { useEffect, useRef, useState } from "react";
import { Check, MoreHorizontal } from "lucide-react";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import { TrialLeadStatusBadge } from "@/features/admin/components/trial-leads/TrialLeadStatusBadge";
import { TRIAL_LEAD_STATUSES } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface ITrialLeadStatusMenuProps {
  lead: TrialBookingView;
  busy: boolean;
  onStatusChange: (lead: TrialBookingView, status: TrialBookingStatus) => void;
}

const triggerClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary disabled:opacity-50";

export function TrialLeadStatusMenu({
  lead,
  busy,
  onStatusChange,
}: ITrialLeadStatusMenuProps) {
  const { t } = usePortalTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handleSelect(status: TrialBookingStatus): void {
    if (busy || status === lead.status) return;
    onStatusChange(lead, status);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen((current) => !current)}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("admin.trialLeads.statusMenuAria", { name: lead.parentName })}
        title={t("admin.trialLeads.statusMenuTitle")}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("admin.trialLeads.statusMenuTitle")}
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[210px] overflow-hidden rounded-xl border border-portal bg-portal-surface py-1 shadow-[0_16px_40px_-20px_rgba(13,74,47,0.45)]"
        >
          <p className="border-b border-portal px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-portal-muted">
            {t("admin.trialLeads.statusMenuTitle")}
          </p>
          <ul className="py-1">
            {TRIAL_LEAD_STATUSES.map((status) => {
              const isCurrent = lead.status === status;

              return (
                <li key={status}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={busy || isCurrent}
                    onClick={() => handleSelect(status)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition",
                      isCurrent
                        ? "cursor-default bg-portal-muted/30"
                        : "hover:bg-portal-muted/40"
                    )}
                  >
                    <TrialLeadStatusBadge status={status} />
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <Check className="size-3.5" aria-hidden />
                        {t("admin.trialLeads.statusMenuCurrent")}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
