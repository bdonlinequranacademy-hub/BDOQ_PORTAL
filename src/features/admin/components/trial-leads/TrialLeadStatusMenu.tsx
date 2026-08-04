import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

interface IMenuPosition {
  top: number;
  left: number;
  minWidth: number;
}

const MENU_MIN_WIDTH = 210;
const MENU_ESTIMATED_HEIGHT = 220;
const VIEWPORT_PADDING = 8;
const GAP = 6;

const triggerClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary disabled:opacity-50";

export function TrialLeadStatusMenu({
  lead,
  busy,
  onStatusChange,
}: ITrialLeadStatusMenuProps) {
  const { t } = usePortalTranslation();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<IMenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? MENU_ESTIMATED_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;
    const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    let top = openUpward
      ? rect.top - menuHeight - GAP
      : rect.bottom + GAP;

    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, window.innerHeight - menuHeight - VIEWPORT_PADDING)
    );

    let left = rect.right - MENU_MIN_WIDTH;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - MENU_MIN_WIDTH - VIEWPORT_PADDING)
    );

    setPosition({ top, left, minWidth: MENU_MIN_WIDTH });
  }, []);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    function handleScroll(): void {
      updatePosition();
    }

    function handlePointerDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, updatePosition]);

  function handleSelect(status: TrialBookingStatus): void {
    if (busy || status === lead.status) return;
    onStatusChange(lead, status);
    setOpen(false);
  }

  function handleToggle(): void {
    setOpen((current) => !current);
  }

  const menu =
    open && position && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={t("admin.trialLeads.statusMenuTitle")}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              minWidth: position.minWidth,
              zIndex: 9999,
            }}
            className="overflow-hidden rounded-xl border border-portal bg-portal-surface py-1 shadow-[0_16px_40px_-20px_rgba(13,74,47,0.45)]"
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
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={busy}
        onClick={handleToggle}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("admin.trialLeads.statusMenuAria", { name: lead.parentName })}
        title={t("admin.trialLeads.statusMenuTitle")}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {menu}
    </>
  );
}
