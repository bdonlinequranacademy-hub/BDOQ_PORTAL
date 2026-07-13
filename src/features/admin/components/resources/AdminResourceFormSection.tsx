import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface IAdminResourceFormSectionProps {
  number: number;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function AdminResourceFormSection({
  number,
  title,
  action,
  children,
}: IAdminResourceFormSectionProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
            {number}
          </span>
          <h2 className="text-base font-bold text-primary-dark">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
