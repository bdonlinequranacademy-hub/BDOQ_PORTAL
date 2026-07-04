import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface IModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
}

const SIZE_CLASS = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: IModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "grid w-full overflow-hidden rounded-2xl border border-portal bg-portal-surface shadow-2xl",
          "max-h-[calc(100dvh-2rem)]",
          footer ? "grid-rows-[auto_minmax(0,1fr)_auto]" : "grid-rows-[auto_minmax(0,1fr)]",
          SIZE_CLASS[size]
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-portal px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="modal-title" className="text-lg font-bold text-portal-heading">
                {title}
              </h2>
              {description ? (
                <p className="mt-1 text-sm text-portal-muted">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-portal-muted transition hover:bg-portal-surface-muted/40 hover:text-portal-heading"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          {children}
        </div>

        {footer ? (
          <footer className="border-t border-portal bg-portal-surface px-5 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:px-6 sm:py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
