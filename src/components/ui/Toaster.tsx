import { useEffect } from "react";
import { useUiStore, type ToastItem } from "@/stores/uiStore";

const kindStyles: Record<ToastItem["kind"], string> = {
  success: "border-l-4 border-success",
  error: "border-l-4 border-danger",
  info: "border-l-4 border-info",
};

function ToastRow({ item }: { item: ToastItem }) {
  const removeToast = useUiStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(item.id), 4000);
    return () => clearTimeout(timer);
  }, [item.id, removeToast]);

  return (
    <div
      className={`pointer-events-auto w-80 rounded-lg bg-portal-surface p-3 text-sm text-portal-heading shadow-md ${kindStyles[item.kind]}`}
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

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>
  );
}
