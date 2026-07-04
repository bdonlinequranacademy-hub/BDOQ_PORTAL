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

/** Consistent page title block — readable on mobile & desktop */
export function PageHeader({
  title,
  subtitle,
  action,
  showBismillah = false,
  className,
}: IPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showBismillah ? <BismillahStrip /> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="portal-page-title font-display font-bold text-primary-dark">{title}</h1>
          {subtitle ? (
            <p className="portal-page-subtitle mt-1 text-portal-muted">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0 sm:pt-0.5">{action}</div> : null}
      </div>
    </div>
  );
}
