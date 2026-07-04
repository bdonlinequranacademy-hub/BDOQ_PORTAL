import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface IDashboardTwoColumnProps {
  main: ReactNode;
  aside: ReactNode;
  className?: string;
}

export function DashboardTwoColumn({ main, aside, className }: IDashboardTwoColumnProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8", className)}>
      <div className="flex flex-col gap-6 lg:col-span-2">{main}</div>
      <div className="flex flex-col gap-6">{aside}</div>
    </div>
  );
}
