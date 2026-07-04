import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-portal bg-portal-surface px-6 py-12 text-center shadow-sm">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-portal-muted">
        <Icon className="size-7 text-zinc-300 dark:text-portal-muted" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-portal-heading">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">{description}</p>
      )}
      {children}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6 rounded-xl bg-primary-dark text-white">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
