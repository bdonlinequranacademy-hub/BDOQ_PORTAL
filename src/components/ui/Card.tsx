import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`portal-card portal-card-islamic bg-portal-surface rounded-xl p-4 sm:rounded-2xl sm:p-5 ${className}`}
      {...props}
    />
  );
}
