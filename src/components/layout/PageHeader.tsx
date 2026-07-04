import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface IPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/** Consistent page title block — readable on mobile & desktop */
export function PageHeader({ title, subtitle, action, className }: IPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="portal-page-title font-display font-bold text-primary-dark">{title}</h1>
        {subtitle ? (
          <p className="portal-page-subtitle mt-1 text-portal-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 sm:pt-0.5">{action}</div> : null}
    </div>
  );
}
