import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface IAdminCertFormSectionProps {
  number: number;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function AdminCertFormSection({
  number,
  title,
  children,
  action,
}: IAdminCertFormSectionProps) {
  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-white">
            {number}
          </span>
          <h2 className="text-sm font-bold text-primary-dark">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}
