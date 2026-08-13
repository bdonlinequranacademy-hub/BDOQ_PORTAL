import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useUiStore, type ToastItem } from "@/stores/uiStore";

const kindStyles: Record<ToastItem["kind"], string> = {
  success: "border-l-4 border-success bg-emerald-50",
  error: "border-l-4 border-danger bg-red-50",
  info: "border-l-4 border-info bg-sky-50",
};

function ToastRow({ item }: { item: ToastItem }) {
  const removeToast = useUiStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(item.id), 6000);
    return () => clearTimeout(timer);
  }, [item.id, removeToast]);

  return (
    <div
      className={`pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-xl p-3 text-sm font-medium text-portal-heading shadow-lg ${kindStyles[item.kind]}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <span>{item.message}</span>
        <button
          onClick={() => removeToast(item.id)}
          className="text-navy-500 hover:text-navy"
          aria-label="Dismiss"
        >
          x
        </button>
      </div>
    </div>
  );
}

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[500] flex flex-col gap-2">
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>,
    document.body
  );
}
