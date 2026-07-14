import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "portal-card portal-card-islamic bg-portal-surface rounded-[8px] p-3.5 sm:p-4",
        className
      )}
      {...props}
    />
  );
}
