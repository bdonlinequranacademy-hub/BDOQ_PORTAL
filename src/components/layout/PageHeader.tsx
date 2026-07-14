import type { ReactNode } from "react";
import { BismillahStrip } from "@/components/layout/BismillahStrip";
import { cn } from "@/lib/utils/cn";

interface IPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showBismillah?: boolean;
  className?: string;
}

/** Consistent page title block — title left, actions right, readable on mobile */
export function PageHeader({
  title,
  subtitle,
  action,
  showBismillah = false,
  className,
}: IPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showBismillah ? <BismillahStrip /> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
