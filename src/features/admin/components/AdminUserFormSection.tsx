import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function AdminUserFormSection({
  title,
  description,
  columns = 1,
  children,
}: {
  title: string;
  description?: string;
  columns?: 1 | 2;
  children: ReactNode;
}) {
  
  return (
    <section className="rounded-xl border border-portal bg-portal-surface-muted/25 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-portal-heading">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-portal-muted">{description}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "flex flex-col gap-3",
          columns === 2 && "sm:grid sm:grid-cols-2 sm:items-start sm:gap-x-4 sm:gap-y-3"
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function AdminUserFormFullWidth({ children }: { children: ReactNode }) {

  return <div className="sm:col-span-2">{children}</div>;
}
