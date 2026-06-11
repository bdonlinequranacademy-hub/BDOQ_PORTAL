import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`portal-card p-5 ${className}`}
      {...props}
    />
  );
}
