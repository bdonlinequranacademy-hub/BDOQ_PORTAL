import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "outline-danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30",
  secondary:
    "border-2 border-gold bg-transparent text-primary-dark hover:bg-gold/10 hover:border-gold-dark",
  ghost: "bg-transparent text-primary-dark hover:bg-primary/10",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-primary text-white hover:bg-primary-dark",
  "outline-danger":
    "border-2 border-red-300 bg-white text-red-600 hover:border-red-400 hover:bg-red-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-[40px] items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
