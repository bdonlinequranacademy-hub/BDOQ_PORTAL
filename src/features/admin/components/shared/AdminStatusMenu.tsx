import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface IAdminStatusMenuProps<TStatus extends string, TItem> {
  item: TItem;
  currentStatus: TStatus;
  statuses: readonly TStatus[];
  busy: boolean;
  title: string;
  currentLabel: string;
  ariaLabel: string;
  onStatusChange: (item: TItem, status: TStatus) => void;
  renderBadge: (status: TStatus) => ReactNode;
}

interface IMenuPosition {
  top: number;
  left: number;
  minWidth: number;
}

const MENU_MIN_WIDTH = 220;
const MENU_ESTIMATED_HEIGHT = 260;
const VIEWPORT_PADDING = 8;
const GAP = 6;

const triggerClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:bg-portal-muted/50 hover:text-primary disabled:opacity-50";

export function AdminStatusMenu<TStatus extends string, TItem>({
  item,
  currentStatus,
  statuses,
  busy,
  title,
  currentLabel,
  ariaLabel,
  onStatusChange,
  renderBadge,
}: IAdminStatusMenuProps<TStatus, TItem>) {
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

    let top = openUpward ? rect.top - menuHeight - GAP : rect.bottom + GAP;
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
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
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

  function handleSelect(status: TStatus): void {
    if (busy || status === currentStatus) return;
    onStatusChange(item, status);
    setOpen(false);
  }

  const menu =
    open && position && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={title}
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
              {title}
            </p>
            <ul className="py-1">
              {statuses.map((status) => {
                const isCurrent = currentStatus === status;
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
                      {renderBadge(status)}
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                          <Check className="size-3.5" aria-hidden />
                          {currentLabel}
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
        onClick={() => setOpen((current) => !current)}
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        title={title}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </button>
      {menu}
    </>
  );
}
