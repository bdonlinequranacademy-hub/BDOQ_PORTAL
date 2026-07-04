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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-portal bg-portal-surface px-5 py-10 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-12">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-portal-muted sm:size-14">
        <Icon className="size-8 text-zinc-300 dark:text-portal-muted sm:size-7" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-portal-heading sm:text-lg">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-portal-muted sm:text-sm">{description}</p>
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
