import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

interface IAdminCenteredModalProps {
  open: boolean;
  titleId: string;
  onClose: () => void;
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  closeLabel: string;
  widthClass?: string;
}

export function AdminCenteredModal({
  open,
  titleId,
  onClose,
  header,
  footer,
  children,
  closeLabel,
  widthClass = "max-w-3xl",
}: IAdminCenteredModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.scrollTo({ top: 0 });

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
    >
      <div className="flex min-h-[100dvh] items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="fixed inset-0 bg-[#0A1628]/60 backdrop-blur-[2px]"
          aria-label={closeLabel}
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "relative z-10 flex w-full max-h-[min(88dvh,820px)] flex-col overflow-hidden",
            "rounded-2xl border border-portal bg-portal-surface shadow-2xl",
            widthClass
          )}
        >
          <div className="shrink-0 border-b border-portal">{header}</div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
            {children}
          </div>
          {footer ? (
            <div className="shrink-0 border-t border-portal">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
